import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('space management and picking together', () => {
  it('lets the owner rename the space and an invitee decline', () => {
    const spaces = source('components/spaces/SpacesScreen.tsx');
    const invite = source('components/spaces/SpaceInviteScreen.tsx');
    assert.match(spaces, /isOwner && renaming \? \(/);
    assert.match(spaces, /await renameSpace\(activeSpace\.id, spaceName\.trim\(\)\)/);
    assert.match(invite, /await declineSpaceInvite\(token\)/);
    assert.match(invite, /거절하면 이 링크로는 다시 참여할 수 없고/);
    assert.match(invite, /data-state="declined"/);
  });

  it('lists a space’s picks so everyone asked can open one and answer', () => {
    const hook = source('hooks/useGroupRecommendations.ts');
    const panel = source('components/spaces/GroupRecommendationPanel.tsx');
    assert.match(hook, /listGroupRecommendationSessions\(space\.id\)/);
    assert.match(hook, /setMyFeedback\(answersOf\(next\)\)/);
    assert.match(panel, /최근 함께 고르기/);
    assert.match(panel, /waitingForMe \? '답하기' : '열기'/);
    // Moods come from the shared table the server matches against.
    assert.match(panel, /RECOMMENDATION_MOODS\.map/);
  });
});
