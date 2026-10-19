import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";

// 1. Add your new custom arguments here
interface CodeEditorProps {
  language: string;
  value: string;
  onChange?: (value: string | undefined) => void; // Made optional with '?'
  theme?: string;         // New optional prop
  height?: string;        // New optional prop
  fontSize?: number;      // New optional prop
  readOnly?: boolean;     // New optional prop
}

// 2. Destructure the new arguments (with default fallback values)
export default function CodeEditor({ 
  language, 
  value, 
  onChange,
  theme = "vs-dark",      // Default to dark mode
  height = "100%",        // Default to fill container
  fontSize = 14,          // Default font size
  readOnly = false        // Default to editable
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, _monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-700" style={{ height }}>
      <Editor
        height="100%"
        theme={theme} // 3. Pass the theme prop to Monaco
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize, // 4. Pass the fontSize prop to Monaco options
          readOnly: readOnly, // 5. Pass readOnly prop
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}