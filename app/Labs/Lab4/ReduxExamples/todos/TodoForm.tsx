import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";
import { Button, FormControl, ListGroupItem } from "react-bootstrap";

export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();

  return (
    <ListGroupItem>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* ✅ Input box first */}
        <FormControl
          defaultValue={todo.title}
          onChange={(e) =>
            dispatch(setTodo({ ...todo, title: e.target.value }))
          }
          style={{ flex: 1 }}
        />

        {/* ✅ Yellow Update button */}
        <Button
          variant="warning"
          style={{ borderRadius: "6px" }}
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
        >
          Update
        </Button>

        {/* ✅ Green Add button */}
        <Button
          variant="success"
          style={{ borderRadius: "6px" }}
          onClick={() => dispatch(addTodo(todo))}
          id="wd-add-todo-click"
        >
          Add
        </Button>
      </div>
    </ListGroupItem>
  );
}
