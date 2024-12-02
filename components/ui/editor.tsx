"use client"

import { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from '@tiptap/extension-text-align';
import { Color } from "@tiptap/extension-color";
import { Extension, Editor as TiptapEditor } from "@tiptap/core";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const fontSizes = [
  "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px"
] as const;

const fontFamilies = [
  { name: "Default", value: "Inter" },
  { name: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Serif", value: "Georgia, serif" },
  { name: "Garamond", value: "Garamond, serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Racing", value: "var(--font-racing)" },
  { name: "Comic Sans", value: "Comic Sans MS, cursive" },
  { name: "Impact", value: "Impact, fantasy" },
  { name: "Brush Script", value: "Brush Script MT, cursive" },
  { name: "Monospace", value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
] as const;

const colors = [
  { name: "Default", value: "#000000" },
  { name: "Racing Red", value: "#FF0000" },
  { name: "Navy", value: "#1a1e31" },
  { name: "Gray", value: "#4A4A4A" },
  { name: "White", value: "#FFFFFF" },
] as const;

type EditorProps = {
  content: string;
  onChange: (content: string) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
    };
    fontFamily: {
      setFontFamily: (family: string) => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain, editor }) => {
          return chain()
            .setMark('textStyle', { fontSize })
            .run();
        },
    };
  },
});

const FontFamily = Extension.create({
  name: 'fontFamily',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily || null,
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {};
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
        ({ chain, editor }) => {
          return chain()
            .setMark('textStyle', { fontFamily })
            .run();
        },
    };
  },
});

export function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
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
      TextStyle,
      Color,
      FontSize.configure(),
      FontFamily.configure(),
      TextAlign.configure({
        types: ['paragraph', 'bulletList', 'orderedList'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 focus:outline-none min-h-[100px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setStyle = useCallback((property: string, value: string) => {
    if (!editor) return;
    
    switch (property) {
      case "color":
        editor.chain().focus().setColor(value).run();
        break;
      case "font-size":
        editor.chain().focus().setMark('textStyle', { fontSize: value }).run();
        break;
      case "font-family":
        editor.chain().focus().setMark('textStyle', { fontFamily: value }).run();
        break;
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
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

        <div className="w-px h-6 bg-border mx-1" />

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

        <div className="w-px h-6 bg-border mx-1" />

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

        <div className="w-px h-6 bg-border mx-1" />

        <Select onValueChange={(value) => setStyle("font-family", value)}>
          <SelectTrigger className="w-[130px] h-8">
            <Type className="h-4 w-4 mr-2" />
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

        <Select onValueChange={(value) => setStyle("font-size", value)}>
          <SelectTrigger className="w-[100px] h-8">
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

        <Popover>
          <PopoverTrigger asChild>
            <Toggle size="sm">
              <Palette className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <div className="grid gap-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted"
                  onClick={() => setStyle("color", color.value)}
                >
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-sm">{color.name}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4" />
    </div>
  );
} 