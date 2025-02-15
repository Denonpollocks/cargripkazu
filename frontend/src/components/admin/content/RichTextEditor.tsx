import React, { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd
    });
  };

  const insertFormat = (format: string) => {
    const before = value.substring(0, selection.start);
    const selected = value.substring(selection.start, selection.end);
    const after = value.substring(selection.end);

    switch (format) {
      case 'bold':
        onChange(`${before}**${selected}**${after}`);
        break;
      case 'italic':
        onChange(`${before}_${selected}_${after}`);
        break;
      case 'h1':
        onChange(`${before}# ${selected}${after}`);
        break;
      case 'h2':
        onChange(`${before}## ${selected}${after}`);
        break;
      case 'h3':
        onChange(`${before}### ${selected}${after}`);
        break;
      case 'link':
        onChange(`${before}[${selected}](url)${after}`);
        break;
      case 'list':
        onChange(`${before}- ${selected}${after}`);
        break;
    }
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex space-x-2 bg-zinc-900 p-2 rounded-t border-b border-gold-500">
        <button
          onClick={() => insertFormat('h1')}
          className="px-2 py-1 text-gold-400 hover:text-gold-300"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => insertFormat('h2')}
          className="px-2 py-1 text-gold-400 hover:text-gold-300"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => insertFormat('h3')}
          className="px-2 py-1 text-gold-400 hover:text-gold-300"
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px bg-gold-500/30" />
        <button
          onClick={() => insertFormat('bold')}
          className="px-2 py-1 text-gold-400 hover:text-gold-300"
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => insertFormat('italic')}
          className="px-2 py-1 text-gold-400 hover:text-gold-300"
          title="Italic"
        >
          I
        </button>
        <div className="w-px bg-gold-500/30" />
        <button
          onClick={() => insertFormat('list')}
          className="px-2 py-1 text-gold-400 hover:text-gold-300"
          title="List"
        >
          •
        </button>
        <button
          onClick={() => insertFormat('link')}
          className="px-2 py-1 text-gold-400 hover:text-gold-300"
          title="Link"
        >
          🔗
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        className="w-full h-64 bg-black border border-gold-500 rounded-b p-4 text-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
        placeholder="Enter your content here... (Supports Markdown)"
      />

      {/* Preview */}
      <div className="mt-4">
        <h3 className="text-gold-500 mb-2">Preview:</h3>
        <div 
          className="prose prose-invert max-w-none p-4 bg-zinc-900 rounded border border-gold-500"
          dangerouslySetInnerHTML={{ 
            __html: value
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/_(.*?)_/g, '<em>$1</em>')
              .replace(/^# (.*$)/gm, '<h1>$1</h1>')
              .replace(/^## (.*$)/gm, '<h2>$1</h2>')
              .replace(/^### (.*$)/gm, '<h3>$1</h3>')
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-gold-400 hover:text-gold-300">$1</a>')
              .replace(/^- (.*$)/gm, '<li>$1</li>')
              .replace(/<li>.*<\/li>/g, match => `<ul>${match}</ul>`)
              .replace(/\n/g, '<br />')
          }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor; 