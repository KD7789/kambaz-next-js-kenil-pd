declare module "react-quill" {
    import React from "react";
  
    export interface ReactQuillProps {
      value: string;
      onChange: (value: string) => void;
      theme?: string;
      style?: React.CSSProperties; // <-- REQUIRED FOR YOUR ERROR
    }
  
    const ReactQuill: React.FC<ReactQuillProps>;
    export default ReactQuill;
  }
  