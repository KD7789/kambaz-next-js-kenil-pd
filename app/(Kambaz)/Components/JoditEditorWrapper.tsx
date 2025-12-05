"use client";

import { useRef } from "react";
import JoditEditor from "jodit-react";

export default function JoditEditorWrapper({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editor = useRef(null);

  const config = {
    readonly: false,
    height: 300,
    theme: "default",
    toolbarAdaptive: false,
  };

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onBlur={(content) => onChange(content)}
    />
  );
}
