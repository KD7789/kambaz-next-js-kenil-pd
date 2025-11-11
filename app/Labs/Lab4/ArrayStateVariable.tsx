import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { ListGroup, ListGroupItem } from "react-bootstrap";

type Todo = {
  id: string | number;
  title: string;
  completed?: boolean;
};

export default function ArrayStateVariable() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);

  const [array, setArray] = useState<number[]>([1, 2, 3, 4, 5]);

  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };

  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>

      <button
        onClick={addElement}
        style={{
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "6px 14px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Add Element
      </button>

      <ListGroup>
        {todos.map((todo: Todo) => (
          <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
      </ListGroup>

      <hr />

      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {array.map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px", // ✅ space between number and button
            }}
          >
            <span>{item}</span>
            <button
              onClick={() => deleteElement(index)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <hr />
    </div>
  );
}
