import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (name: string) =>
  readFileSync(join(process.cwd(), 'src/components/core', name), 'utf8');

describe('record list and composer async lifecycle', () => {
  const composer = source('RecordComposer.tsx');

  it('guards list responses by request generation and keeps pagination errors visible inline', () => {
    const list = source('RecordListScreens.tsx');
    assert.match(list, /generationRef/);
    assert.match(list, /recordListRequestIsCurrent/);
    assert.match(list, /moreError/);
    assert.match(list, /더 보기를 완료하지 못했어요/);
  });

  it('does not nest the search form inside a link and supports Enter submission', () => {
    const list = source('RecordListScreens.tsx');
    assert.doesNotMatch(list, /<Link[^>]+>(?:(?!<\/Link>)[\s\S])*<SearchField/);
    assert.match(list, /onSubmit=/);
    assert.match(list, /router\.push/);
  });

  it('checks hydration activity after every awaited draft source', () => {
    assert.match(composer, /await restoreSavedDraft[\s\S]+?if \(!active\) return/);
    assert.match(composer, /await getRecord[\s\S]+?if \(!active\) return/);
    assert.match(composer, /await applyPreselectedMedia[\s\S]+?if \(!active\) return/);
    assert.match(composer, /catch \{\s*if \(active\) setError/);
  });

  it('locks every editor mutation and discard path while a save is pending', () => {
    const editor = source('RecordEditorView.tsx');
    const shell = source('CoreShell.tsx');

    assert.match(editor, /backDisabled=\{busy\}/);
    assert.match(editor, /<fieldset[^>]*disabled=\{busy\}/);
    assert.match(editor, /aria-busy=\{busy\}/);
    assert.match(shell, /backDisabled\?: boolean/);
    assert.match(shell, /disabled=\{backDisabled\}/);
    assert.match(composer, /function changeMedia\(\) \{\s*if \(busy\) return/);
    assert.match(composer, /function discard\(\) \{\s*if \(busy\) return/);
    assert.match(composer, /onDraftChange=\{\(value\) => \{\s*if \(busy\) return/);
    assert.match(composer, /mountedRef/);
    assert.match(
      composer,
      /savedDraftMatchesSubmission\(sessionStorage\.getItem\(key\), submittedDraft\)/,
    );
  });
});
