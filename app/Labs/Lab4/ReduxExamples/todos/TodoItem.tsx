import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { Button, FormControl, ListGroupItem } from "react-bootstrap";

export default function TodoItem({
  todo,
}: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();

  return (
    <ListGroupItem key={todo.id}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* ✅ Input box first */}
        <FormControl
          defaultValue={todo.title}
          onChange={(e) =>
            dispatch(setTodo({ ...todo, title: e.target.value }))
          }
          style={{ flex: 1 }}
        />

        {/* ✅ Blue Edit button */}
        <Button
          variant="primary"
          style={{ borderRadius: "6px" }}
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
        >
          Edit
        </Button>

        {/* ✅ Red Delete button */}
        <Button
          variant="danger"
          style={{ borderRadius: "6px" }}
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  );
}
