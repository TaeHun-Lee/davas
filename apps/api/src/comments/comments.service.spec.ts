import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { NotFoundException } from '@nestjs/common';
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
    diary: { id: 'diary-1', visibility: 'PUBLIC' } as DiaryEntity,
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
      return this.rows[0] ?? null;
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

describe('CommentsService', () => {
  it('lists comments for public diaries with real author data in oldest-first order', async () => {
    const comments = fakeCommentsRepository([makeComment()]);
    const diaries = fakeDiariesRepository({ id: 'diary-1', visibility: 'PUBLIC' } as DiaryEntity);

    const result = await new CommentsService(comments as never, diaries as never).listForDiary('diary-1');

    assert.deepEqual(diaries.calls[0], { method: 'findOne', input: { where: { id: 'diary-1', visibility: 'PUBLIC' } } });
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

  it('creates comments only on public diaries for the authenticated user', async () => {
    const comments = fakeCommentsRepository();
    const diaries = fakeDiariesRepository({ id: 'diary-1', visibility: 'PUBLIC' } as DiaryEntity);

    const result = await new CommentsService(comments as never, diaries as never).create('diary-1', 'user-1', '  새 댓글  ');

    assert.deepEqual(comments.calls.map((call) => call.method), ['create', 'save', 'findOne']);
    assert.equal((comments.calls[0].input as Partial<CommentEntity>).content, '새 댓글');
    assert.equal(result.content, '새 댓글');
    assert.equal(result.isMine, true);
  });

  it('reloads a created comment with the persisted user relation before returning author data', async () => {
    const comments = fakeCommentsRepository([
      makeComment({ content: '새 댓글', user: { id: 'user-1', nickname: '실제닉네임', profileImageUrl: '/uploads/me.jpg' } as UserEntity }),
    ]);
    const diaries = fakeDiariesRepository({ id: 'diary-1', userId: 'author-1', visibility: 'PUBLIC' } as DiaryEntity);

    const result = await new CommentsService(comments as never, diaries as never).create('diary-1', 'user-1', '새 댓글');

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
    const diaries = fakeDiariesRepository({ id: 'diary-1', visibility: 'PUBLIC' } as DiaryEntity);
    const service = new CommentsService(comments as never, diaries as never);

    const updated = await service.update('comment-1', 'user-1', '  수정 댓글  ');
    await service.remove('comment-1', 'user-1');

    assert.deepEqual(comments.calls.filter((call) => call.method === 'findOne').map((call) => call.input), [
      { where: { id: 'comment-1', userId: 'user-1' }, relations: { user: true, diary: true } },
      { where: { id: 'comment-1', userId: 'user-1' }, relations: { user: true, diary: true } },
    ]);
    assert.equal(updated.content, '수정 댓글');
    assert.deepEqual(comments.calls.at(-1), { method: 'softDelete', input: { id: 'comment-1', userId: 'user-1' } });
  });

  it('rejects comments for missing or private diaries', async () => {
    const comments = fakeCommentsRepository();
    const diaries = fakeDiariesRepository(null);

    await assert.rejects(() => new CommentsService(comments as never, diaries as never).listForDiary('private-diary'), NotFoundException);
  });
});
