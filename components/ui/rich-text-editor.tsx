"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo,
  Redo,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const fontSizes = [
  "12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"
];

const fontFamilies = [
  { name: "Default", value: "Inter" },
  { name: "Serif", value: "Georgia" },
  { name: "Mono", value: "monospace" },
];

const colors = [
  "#000000", // Black
  "#4A5568", // Gray
  "#718096", // Cool Gray
  "#F56565", // Red
  "#ED8936", // Orange
  "#ECC94B", // Yellow
  "#48BB78", // Green
  "#4299E1", // Blue
  "#667EEA", // Indigo
  "#9F7AEA", // Purple
  "#ED64A6", // Pink
];

const MenuBar = ({ editor, showHtmlSource, setShowHtmlSource }: { editor: any, showHtmlSource: boolean, setShowHtmlSource: (value: boolean) => void }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b">
      <div className="flex items-center gap-2 border-r pr-2">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading")}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
      </div>

      <div className="flex items-center gap-2 border-r pr-2">
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>

      <div className="flex items-center gap-2 border-r pr-2">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'left' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'center' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'right' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'justify' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>
      </div>

      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => editor.chain().focus().setFontSize(value).run()}
        >
          <SelectTrigger className="h-8 w-[80px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => editor.chain().focus().setColor(value).run()}
        >
          <SelectTrigger className="h-8 w-[80px]">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color} value={color}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">
                    {color === "#000000" ? "Black" : color}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 border-l pl-2">
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={showHtmlSource}
          onPressedChange={setShowHtmlSource}
        >
          <Code className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  );
};

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [htmlContent, setHtmlContent] = useState(content);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: true,
            HTMLAttributes: {
              class: 'list-disc pl-4'
            }
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: true,
            HTMLAttributes: {
              class: 'list-decimal pl-4'
            }
          },
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph', 'bulletList', 'orderedList'],
          alignments: ['left', 'center', 'right', 'justify'],
          defaultAlignment: 'left',
        }),
        TextStyle,
        Color,
      ],
      content: content,
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm dark:prose-invert max-w-none min-h-[150px] p-4 focus:outline-none",
            className
          ),
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        setHtmlContent(html);
        onChange(html);
      },
      editable: true,
      injectCSS: true,
      parseOptions: {
        preserveWhitespace: true,
      },
      immediatelyRender: false
    },
    []
  );

  useEffect(() => {
    if (editor && content !== htmlContent) {
      setHtmlContent(content);
      editor.commands.setContent(content);
    }
  }, [content, editor, htmlContent]);

  const handleHtmlSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    setHtmlContent(html);
    onChange(html);
    if (editor) {
      editor.commands.setContent(html);
    }
  };

  return (
    <div className="border rounded-md">
      <MenuBar editor={editor} showHtmlSource={showHtmlSource} setShowHtmlSource={setShowHtmlSource} />
      {showHtmlSource ? (
        <Textarea
          value={htmlContent}
          onChange={handleHtmlSourceChange}
          className="min-h-[150px] font-mono text-sm p-4 focus:outline-none rounded-none rounded-b-md"
          placeholder="HTML Source"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
} 