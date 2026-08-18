import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) =>
  readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('core record compose', () => {
  it('keeps viewing source in writing while search only filters by media type', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const hook = source('hooks/useMediaSearch.ts');
    const findBranch = composer.slice(
      composer.indexOf("if (step === 'find'"),
      composer.indexOf('<TaskShell', composer.indexOf("if (step === 'find'")),
    );
    const chooseBranch = composer.slice(
      composer.indexOf('async function choose'),
      composer.indexOf('async function save'),
    );
    assert.doesNotMatch(findBranch, /SourceKindControl|어디서 봤나요/);
    assert.match(findBranch, /SearchField/);
    assert.match(findBranch, /MediaTypeControl/);
    assert.match(findBranch, /MediaDetailModal/);
    assert.doesNotMatch(chooseBranch, /draft!\.sourceKind|viewingRef/);
    assert.match(composer, /어디서 봤나요\? \*/);
    assert.match(composer, /SourceKindControl/);
    assert.match(hook, /searchMedia\(\{ query: trimmedQuery, type/);
  });

  it('shows media detail before the user confirms record writing', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const chooseBranch = composer.slice(
      composer.indexOf('async function choose'),
      composer.indexOf('async function save'),
    );
    assert.match(chooseBranch, /await selectMedia\(item\)/);
    assert.match(chooseBranch, /await getMediaDetail\(selected\.id\)/);
    assert.match(chooseBranch, /setDetailPreview\(detail\)/);
    assert.doesNotMatch(chooseBranch, /setStep\('write'\)/);
    assert.match(composer, /onRecord=\{\(\) => \{/);
    assert.match(composer, /\/records\/new\?mediaId=/);
    assert.match(composer, /const detailMediaId = params\.get\('detail'\)/);
  });

  it('keeps a per-user session draft while allowing repeated watches as new events', () => {
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(composer, /davas:draft:\$\{id\}/);
    assert.match(composer, /sessionStorage/);
    assert.match(composer, /createWatchEvent/);
    assert.doesNotMatch(composer, /POSSIBLE_REWATCH|allowDuplicate/);
  });

  it('does not let a saved draft skip the generic TMDB search entry', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const savedDraftBranch = composer.slice(
      composer.indexOf('const saved = sessionStorage.getItem'),
      composer.indexOf('if (editId) {'),
    );
    assert.doesNotMatch(savedDraftBranch, /setStep\('write'\)/);
    assert.match(
      composer,
      /mediaId \|\| requestedStep === 'write' \? 'write' : 'find'/,
    );
    assert.match(composer, /router\.replace\('\/records\/new\?step=find'\)/);
  });

  it('uses the common half-star control and explicit space participant fields', () => {
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(composer, /WatchRatingControl/);
    assert.match(composer, /spaceIds/);
    assert.match(composer, /participantAccountIds/);
    assert.match(composer, /placeText/);
  });
});
