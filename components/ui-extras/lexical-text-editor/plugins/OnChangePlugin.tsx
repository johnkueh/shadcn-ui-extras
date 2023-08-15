'use client';

import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function OnChangePlugin({ onChange }: { onChange: any }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener((editorState) => {
      onChange(editorState);
    });
  }, [editor, onChange]);

  return null;
}
