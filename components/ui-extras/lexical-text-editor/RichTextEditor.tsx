'use client';

import { cn } from '@/lib/utils';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorState, TextNode } from 'lexical';
import { AutoFocusPlugin } from './plugins/AutoFocusPlugin';
import { AutoLinkPlugin } from './plugins/AutoLinkPlugin';
import { OnChangePlugin } from './plugins/OnChangePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';

export function RichTextEditor() {
  return (
    <div
      className={cn(
        `prose-sm prose-slate`,
        `prose-headings:mt-0 prose-headings:mb-1 prose-p:m-0`,
        `prose-ul:m-0 prose-ul:pl-5 prose-li:m-0 prose-li:p-0`,
        `prose-ol:m-0 prose-ol:pl-5 prose-li:m-0 prose-li:p-0`,
        `prose-blockquote:m-0 prose-blockquote:ml-1 prose-blockquote:pl-2 prose-blockquote:border-gray-300 prose-blockquote:border-l-4`,
        `prose-code:bg-gray-100 prose-code:p-1`,
        `prose-a:text-blue-500`
      )}>
      <LexicalComposer
        initialConfig={{
          namespace: 'lexical-editor',
          theme: {
            list: {
              nested: {
                listitem: 'list-none',
              },
              ol: 'list-decimal',
              ul: 'list-disc',
            },
            text: {
              bold: 'font-semibold',
              underline: 'underline',
              italic: 'italic',
              strikethrough: 'line-through',
              underlineStrikethrough: 'underlined-line-through',
            },
          },
          onError: (error) => {
            console.error(error);
          },
          nodes: [
            TextNode,
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            AutoLinkNode,
            LinkNode,
          ],
        }}>
        <div className="flex flex-col space-y-2">
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="testing focus:outline-none min-h-[5rem]" />
              }
              placeholder={
                <div className="text-gray-400 absolute top-0 left-0 pointer-events-none">
                  Enter some text...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            {/* <FloatingLinkEditorPlugin /> */}
            <AutoLinkPlugin />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin
              onChange={(state: EditorState) => {
                // console.log(state);
              }}
            />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
