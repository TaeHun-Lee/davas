import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import type { CommentEntity } from '../database/entities/comment.entity';
import type { DiaryEntity } from '../database/entities/diary.entity';
import type { UserEntity } from '../database/entities/user.entity';

type FakeCommentsRepository = {
  calls: Array<{ method: string; input: unknown }>;
  rows: CommentEntity[];
  create: (input: Partial<CommentEntity>) => CommentEntity;
  save: (input: CommentEntity) => Promise<CommentEntity>;
  find: (input: unknown) => Promise<CommentEntity[]>;
  findOne: (input: unknown) => Promise<CommentEntity | null>;
  softDelete: (input: unknown) => Promise<unknown>;
};

function makeComment(overrides: Partial<CommentEntity> = {}): CommentEntity {
  return {
    id: 'comment-1',
    diaryId: 'diary-1',
    userId: 'user-1',
    content: '좋은 기록입니다.',
    user: { id: 'user-1', nickname: '댓글러', profileImageUrl: null } as UserEntity,
    diary: { id: 'diary-1', visibility: 'FRIENDS' } as unknown as DiaryEntity,
    createdAt: new Date('2026-05-09T12:00:00.000Z'),
    updatedAt: new Date('2026-05-09T12:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  } as CommentEntity;
}

function fakeCommentsRepository(rows: CommentEntity[] = []): FakeCommentsRepository {
  return {
    calls: [],
    rows,
    create(input) {
      this.calls.push({ method: 'create', input });
      return makeComment(input);
    },
    async save(input) {
      this.calls.push({ method: 'save', input });
      return input;
    },
    async find(input) {
      this.calls.push({ method: 'find', input });
      return this.rows;
    },
    async findOne(input) {
      this.calls.push({ method: 'findOne', input });
      const where = (input as { where?: Partial<CommentEntity> }).where ?? {};
      return this.rows.find((row) => {
        if (where.id && row.id !== where.id) return false;
        if (where.userId && row.userId !== where.userId) return false;
        if (where.diaryId && row.diaryId !== where.diaryId) return false;
        return true;
      }) ?? null;
    },
    async softDelete(input) {
      this.calls.push({ method: 'softDelete', input });
      return { affected: 1 };
    },
  };
}

function fakeDiariesRepository(row: DiaryEntity | null) {
  return {
    calls: [] as Array<{ method: string; input: unknown }>,
    async findOne(input: unknown) {
      this.calls.push({ method: 'findOne', input });
      return row;
    },
  };
}

function fakeAccess(allowed = true) {
  return {
    calls: [] as Array<{ diary: DiaryEntity | null; userId: string }>,
    async assertCanView(diary: DiaryEntity | null, userId: string) {
      this.calls.push({ diary, userId });
      if (!diary) throw new NotFoundException('기록을 찾을 수 없습니다.');
      if (!allowed) throw new ForbiddenException('기록을 볼 권한이 없습니다.');
    },
  };
}

describe('CommentsService', () => {
  it('lists comments for an accessible diary with real author data in oldest-first order', async () => {
    const comments = fakeCommentsRepository([makeComment()]);
    const diaries = fakeDiariesRepository({ id: 'diary-1', visibility: 'FRIENDS' } as unknown as DiaryEntity);

    const result = await new CommentsService(comments as never, diaries as never, fakeAccess() as never).listForDiary('diary-1');

    assert.deepEqual(diaries.calls[0], { method: 'findOne', input: { where: { id: 'diary-1' } } });
    assert.deepEqual(comments.calls[0], {
      method: 'find',
      input: { where: { diaryId: 'diary-1' }, relations: { user: true }, order: { createdAt: 'ASC' } },
    });
    assert.deepEqual(result.items, [{
      id: 'comment-1',
      diaryId: 'diary-1',
      content: '좋은 기록입니다.',
      author: { id: 'user-1', nickname: '댓글러', profileImageUrl: null },
      createdAt: '2026-05-09T12:00:00.000Z',
      updatedAt: '2026-05-09T12:00:00.000Z',
      isMine: false,
    }]);
  });

  it('creates comments only on a diary accessible to the authenticated user', async () => {
    const comments = fakeCommentsRepository();
    const diaries = fakeDiariesRepository({ id: 'diary-1', visibility: 'FRIENDS' } as unknown as DiaryEntity);

    const result = await new CommentsService(comments as never, diaries as never, fakeAccess() as never).create('diary-1', 'user-1', '  새 댓글  ');

    assert.deepEqual(comments.calls.map((call) => call.method), ['create', 'save', 'findOne']);
    assert.equal((comments.calls[0].input as Partial<CommentEntity>).content, '새 댓글');
    assert.equal(result.content, '새 댓글');
    assert.equal(result.isMine, true);
  });

  it('reloads a created comment with the persisted user relation before returning author data', async () => {
    const comments = fakeCommentsRepository([
      makeComment({ content: '새 댓글', user: { id: 'user-1', nickname: '실제닉네임', profileImageUrl: '/uploads/me.jpg' } as UserEntity }),
    ]);
    const diaries = fakeDiariesRepository({ id: 'diary-1', userId: 'author-1', visibility: 'FRIENDS' } as unknown as DiaryEntity);

    const result = await new CommentsService(comments as never, diaries as never, fakeAccess() as never).create('diary-1', 'user-1', '새 댓글');

    assert.deepEqual(comments.calls.map((call) => call.method), ['create', 'save', 'findOne']);
    assert.deepEqual(comments.calls.at(-1), {
      method: 'findOne',
      input: { where: { id: 'comment-1', userId: 'user-1' }, relations: { user: true } },
    });
    assert.deepEqual(result.author, { id: 'user-1', nickname: '실제닉네임', profileImageUrl: '/uploads/me.jpg' });
  });

  it('maps comment user relation through the persisted snake_case user_id column', () => {
    const source = readFileSync(join(process.cwd(), 'src/database/entities/comment.entity.ts'), 'utf8');
    assert.match(
      source,
      /@Column\(\{ name: 'user_id', type: 'uuid' \}\)\s+userId!: string;\s+@ManyToOne\(\(\) => UserEntity, \(user\) => user\.comments, \{ onDelete: 'CASCADE' \}\)\s+@JoinColumn\(\{ name: 'user_id' \}\)\s+user!: UserEntity;/,
    );
  });

  it('updates and deletes only comments owned by the authenticated user', async () => {
    const comments = fakeCommentsRepository([makeComment()]);
    const diaries = fakeDiariesRepository({ id: 'diary-1', visibility: 'FRIENDS' } as unknown as DiaryEntity);
    const service = new CommentsService(comments as never, diaries as never, fakeAccess() as never);

    const updated = await service.update('comment-1', 'user-1', '  수정 댓글  ');
    await service.remove('comment-1', 'user-1');

    assert.deepEqual(comments.calls.filter((call) => call.method === 'findOne').map((call) => call.input), [
      { where: { id: 'comment-1', userId: 'user-1' }, relations: { user: true, diary: true } },
      { where: { id: 'comment-1', userId: 'user-1' }, relations: { user: true, diary: true } },
    ]);
    assert.equal(updated.content, '수정 댓글');
    assert.deepEqual(comments.calls.at(-1), { method: 'softDelete', input: { id: 'comment-1', userId: 'user-1' } });
  });

  it('rejects update and delete attempts from a different authenticated user', async () => {
    const comments = fakeCommentsRepository([makeComment({ id: 'comment-1', userId: 'owner-1' })]);
    const diaries = fakeDiariesRepository({ id: 'diary-1', visibility: 'FRIENDS' } as unknown as DiaryEntity);
    const service = new CommentsService(comments as never, diaries as never, fakeAccess() as never);

    await assert.rejects(() => service.update('comment-1', 'intruder-1', '남의 댓글 수정'), NotFoundException);
    await assert.rejects(() => service.remove('comment-1', 'intruder-1'), NotFoundException);

    assert.deepEqual(comments.calls.filter((call) => call.method === 'findOne').map((call) => call.input), [
      { where: { id: 'comment-1', userId: 'intruder-1' }, relations: { user: true, diary: true } },
      { where: { id: 'comment-1', userId: 'intruder-1' }, relations: { user: true, diary: true } },
    ]);
    assert.equal(comments.calls.some((call) => call.method === 'save'), false);
    assert.equal(comments.calls.some((call) => call.method === 'softDelete'), false);
  });

  it('rejects comments for missing diaries', async () => {
    const comments = fakeCommentsRepository();
    const diaries = fakeDiariesRepository(null);

    await assert.rejects(() => new CommentsService(comments as never, diaries as never, fakeAccess() as never).listForDiary('private-diary'), NotFoundException);
  });

  it('fails closed before exposing comment rows when the viewer loses diary access', async () => {
    const comments = fakeCommentsRepository([makeComment()]);
    const diary = { id: 'diary-1', visibility: 'FRIENDS' } as DiaryEntity;
    const diaries = fakeDiariesRepository(diary);
    const access = fakeAccess(false);
    const service = new CommentsService(comments as never, diaries as never, access as never);

    await assert.rejects(() => service.listForDiary('diary-1', 'former-friend'), ForbiddenException);

    assert.deepEqual(access.calls, [{ diary, userId: 'former-friend' }]);
    assert.equal(comments.calls.some((call) => call.method === 'find'), false);
  });
});
