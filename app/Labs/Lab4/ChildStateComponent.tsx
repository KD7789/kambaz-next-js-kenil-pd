export default function ChildStateComponent({
  counter,
  setCounter,
}: {
  counter: number;
  setCounter: (counter: number) => void;
}) {
  return (
    <div id="wd-child-state">
      <h3>Counter {counter}</h3>
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <button
          onClick={() => setCounter(counter + 1)}
          id="wd-increment-child-state-click"
        >
          Increment
        </button>
        <button
          onClick={() => setCounter(counter - 1)}
          id="wd-decrement-child-state-click"
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
