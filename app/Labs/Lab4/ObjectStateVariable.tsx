import { useState } from "react";
import { FormControl } from "react-bootstrap";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });

  return (
    <div>
      <h2>Object State Variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>

      {/* ✅ Added vertical spacing between inputs */}
      <FormControl
        defaultValue={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
        className="mb-3"
        placeholder="Enter name"
      />

      <FormControl
        defaultValue={person.age}
        type="number"
        onChange={(e) =>
          setPerson({ ...person, age: parseInt(e.target.value) })
        }
        placeholder="Enter age"
        className="mb-3"
      />

      <hr />
    </div>
  );
}
