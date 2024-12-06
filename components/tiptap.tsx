"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TipTapProps } from '@/types/course';

const Tiptap = ({ content, onChange }: TipTapProps) => {
  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: content,
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] max-w-none',
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editable: true,
      injectCSS: true,
      parseOptions: {
        preserveWhitespace: true,
      }
    },
    []
  );

  return (
    <div className="border rounded-md p-4">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
