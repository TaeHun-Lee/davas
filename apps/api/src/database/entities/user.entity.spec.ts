import 'reflect-metadata';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getMetadataArgsStorage } from 'typeorm';
import { UserEntity } from './user.entity';
import { DiaryEntity } from './diary.entity';
import { CommentEntity } from './comment.entity';
import { MediaEntity } from './media.entity';
import { MediaImageEntity } from './media-image.entity';

describe('TypeORM Davas entities', () => {
  it('maps core User, Media, Diary, Comment relationships', () => {
    const storage = getMetadataArgsStorage();
    const entityTargets = storage.tables.map((table) => table.target);
    const relationTargets = storage.relations.map((relation) => relation.target);
    const diaryColumns = storage.columns
      .filter((column) => column.target === DiaryEntity)
      .map((column) => column.propertyName);
    const mediaColumns = storage.columns
      .filter((column) => column.target === MediaEntity)
      .map((column) => column.propertyName);

    assert.ok(entityTargets.includes(UserEntity));
    assert.ok(entityTargets.includes(MediaEntity));
    assert.ok(entityTargets.includes(MediaImageEntity));
    assert.ok(entityTargets.includes(DiaryEntity));
    assert.ok(entityTargets.includes(CommentEntity));
    assert.ok(relationTargets.includes(DiaryEntity));
    assert.ok(relationTargets.includes(CommentEntity));
    assert.ok(diaryColumns.includes('rating'));
    assert.ok(diaryColumns.includes('visibility'));
    assert.ok(mediaColumns.includes('externalProvider'));
  });
});
