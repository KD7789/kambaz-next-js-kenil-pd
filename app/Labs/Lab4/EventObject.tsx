import { useState } from "react";

export default function EventObject() {
  const [event, setEvent] = useState<Record<string, unknown> | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const cleanEvent: Record<string, unknown> = {
      type: e.type,
      timeStamp: e.timeStamp,
      target: (e.target as HTMLElement)?.outerHTML,
    };
    setEvent(cleanEvent);
  };

  return (
    <div>
      <h2>Event Object</h2>
      <button
        onClick={handleClick}
        className="btn btn-primary"
        id="wd-display-event-obj-click"
      >
        Display Event Object
      </button>

      {/* ✅ Added marginTop for vertical space */}
      <pre style={{ marginTop: "15px" }}>
        {JSON.stringify(event, null, 2)}
      </pre>

      <hr />
    </div>
  );
}
