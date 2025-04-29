"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'
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

// Create a proper fontSize extension
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
    }
  },
})

// Create a proper fontFamily extension
const FontFamily = Extension.create({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily?.replace(/['"]/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {}
              }

              return {
                style: `font-family: ${attributes.fontFamily}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontFamily: (fontFamily) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily })
          .run()
      },
    }
  },
})

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
  const [error, setError] = useState<string | null>(null);

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
        FontSize,
        FontFamily,
      ],
      content: content,
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm dark:prose-invert max-w-none min-h-[150px] p-4 focus:outline-none",
            className
          ),
        },
        handlePaste: (view, event) => {
          try {
            const clipboardData = event?.clipboardData;
            if (!clipboardData) return false;
            
            const text = clipboardData.getData('text');
            
            // If pasted content is very large, handle it differently
            if (text && text.length > 50000) {
              event.preventDefault();
              
              // For very large content, insert text in chunks
              if (text.length > 200000) {
                // Insert the first 10K characters immediately
                view.dispatch(view.state.tr.insertText(text.substring(0, 10000)));
                
                // Insert the rest with a delay to avoid UI freezing
                setTimeout(() => {
                  view.dispatch(view.state.tr.insertText(text.substring(10000)));
                }, 50);
              } else {
                // For moderately large content, insert as plain text
                view.dispatch(view.state.tr.insertText(text));
              }
              
              return true; // Prevent default paste behavior
            }
          } catch (error) {
            console.error("Error handling paste:", error);
          }
          
          return false; // Allow default paste behavior for normal content
        },
      },
      onUpdate: ({ editor }) => {
        try {
          const html = editor.getHTML();
          setHtmlContent(html);
          onChange(html);
          if (error) setError(null);
        } catch (error) {
          console.error("Error updating content:", error);
          setError("Error updating content. Try using simpler formatting.");
        }
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
      try {
        setHtmlContent(content);
        
        // For large content, handle differently to avoid UI freezing
        if (content && content.length > 50000) {
          editor.commands.setContent('Loading content...');
          
          setTimeout(() => {
            try {
              editor.commands.setContent(content);
              if (error) setError(null);
            } catch (e) {
              console.error("Error setting large content:", e);
              setError("Error loading large content. Try using HTML Source view.");
              
              // Last resort - try insertion as plain text
              editor.commands.setContent('');
              editor.commands.insertContent(content);
            }
          }, 50);
        } else {
          editor.commands.setContent(content);
          if (error) setError(null);
        }
      } catch (error) {
        console.error("Error setting editor content:", error);
        setError("Error loading content. Try using HTML Source view instead.");
      }
    }
  }, [content, editor, htmlContent, error]);

  const handleHtmlSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const html = e.target.value;
      setHtmlContent(html);
      onChange(html);
      
      if (editor) {
        // When updating from source view, use a timeout to avoid UI freezing
        // with very large content
        if (html.length > 50000) {
          editor.commands.setContent('Loading...');
          setTimeout(() => {
            try {
              editor.commands.setContent(html);
              if (error) setError(null);
            } catch (e) {
              console.error("Error setting content from HTML source:", e);
              setError("Error applying HTML. The content may be too complex.");
            }
          }, 50);
        } else {
          editor.commands.setContent(html);
          if (error) setError(null);
        }
      }
    } catch (error) {
      console.error("Error updating HTML source:", error);
      setError("Error processing HTML source.");
    }
  };

  return (
    <div className="border rounded-md">
      <MenuBar editor={editor} showHtmlSource={showHtmlSource} setShowHtmlSource={setShowHtmlSource} />
      
      {error && (
        <div className="bg-red-100 text-red-800 p-2 text-sm">
          {error}
        </div>
      )}
      
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