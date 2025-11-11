import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { add } from "./addReducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";

export default function AddRedux() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(23);
  const { sum } = useSelector((state: RootState) => state.addReducer);
  const dispatch = useDispatch();

  return (
    <div className="w-25" id="wd-add-redux">
      <h1>Add Redux</h1>
      <h2>
        {a} + {b} = {sum}
      </h2>

      {/* ✅ Added vertical spacing between inputs */}
      <FormControl
        type="number"
        defaultValue={a}
        onChange={(e) => setA(parseInt(e.target.value))}
        className="mb-3"
      />

      <FormControl
        type="number"
        defaultValue={b}
        onChange={(e) => setB(parseInt(e.target.value))}
        className="mb-3"
      />

      {/* ✅ Added margin-top for spacing above button */}
      <Button
        id="wd-add-redux-click"
        onClick={() => dispatch(add({ a, b }))}
        style={{ marginTop: "10px", display: "block" }}
      >
        Add Redux
      </Button>

      <hr />
    </div>
  );
}
