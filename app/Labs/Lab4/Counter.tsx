import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(7);
  console.log(count);

  return (
    <div>
      <h2>Counter: {count}</h2>

      {/* ✅ Added flex container and button styles */}
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          onClick={() => setCount(count + 1)}
          id="wd-counter-up-click"
          style={{
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Up
        </button>

        <button
          onClick={() => setCount(count - 1)}
          id="wd-counter-down-click"
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Down
        </button>
      </div>

      <hr />
    </div>
  );
}
