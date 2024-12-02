"use client"

import { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import TextStyle from '@tiptap/extension-text-style'
import { Mark } from '@tiptap/core'
import { Toggle } from "@/components/ui/toggle"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Palette,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const fontSizes = [
  "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px"
] as const;

const fontFamilies = [
  { name: "Default", value: "Inter" },
  { name: "Serif", value: "Georgia" },
  { name: "Monospace", value: "monospace" },
  { name: "Racing", value: "var(--font-racing)" },
] as const;

const colors = [
  { name: "Default", value: "#000000" },
  { name: "Racing Red", value: "#FF0000" },
  { name: "Navy", value: "#1a1e31" },
  { name: "Gray", value: "#4A4A4A" },
  { name: "White", value: "#FFFFFF" },
] as const;

// Create custom extensions for styling
const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.size) return {}
          return { style: `font-size: ${attributes.size}` }
        }
      }
    }
  }
})

const FontFamily = Mark.create({
  name: 'fontFamily',
  addAttributes() {
    return {
      family: {
        default: null,
        parseHTML: element => element.style.fontFamily,
        renderHTML: attributes => {
          if (!attributes.family) return {}
          return { style: `font-family: ${attributes.family}` }
        }
      }
    }
  }
})

const TextColor = Mark.create({
  name: 'textColor',
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.style.color,
        renderHTML: attributes => {
          if (!attributes.color) return {}
          return { style: `color: ${attributes.color}` }
        }
      }
    }
  }
})

type EditorProps = {
  content: string;
  onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      FontFamily,
      TextColor,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  })

  const setStyle = useCallback((property: string, value: string) => {
    if (!editor) return;
    
    if (property === 'color') {
      editor.chain().focus().setMark('textColor', { color: value }).run();
    } else if (property === 'font-size') {
      editor.chain().focus().setMark('fontSize', { size: value }).run();
    } else if (property === 'font-family') {
      editor.chain().focus().setMark('fontFamily', { family: value }).run();
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
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Select onValueChange={(value) => setStyle('font-family', value)}>
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

        <Select onValueChange={(value) => setStyle('font-size', value)}>
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
                  onClick={() => setStyle('color', color.value)}
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
  )
} 