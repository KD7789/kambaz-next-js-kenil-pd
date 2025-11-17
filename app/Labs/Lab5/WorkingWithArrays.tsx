"use client";
import React, { useState } from "react";
import { FormCheck, FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithArrays() {
  const API = `${HTTP_SERVER}/lab5/todos`;

  const [todo, setTodo] = useState({
    id: "1",
    title: "Task 1",
    description: "Sample description",
    completed: false,
  });  

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>

      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos
      </a>
      <hr />

      <h4>Retrieving an Item from an Array by ID</h4>
      <a
        id="wd-retrieve-todo-by-id"
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}`}
      >
        Get Todo by ID
      </a>

      <FormControl
        id="wd-todo-id"
        defaultValue={todo.id}
        className="w-50"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />

      <hr />

      <h3>Filtering Array Items</h3>
      <a
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        href={`${API}?completed=true`}
      >
        Get Completed Todos
      </a>
      <hr />

      <h3>Creating new Items in an Array</h3>
      <a id="wd-create-todo" className="btn btn-primary" href={`${API}/create`}>
        Create Todo
      </a>
      <hr />

      <h3>Removing from an Array</h3>
      <a
        id="wd-remove-todo"
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}/delete`}
      >
        Remove Todo with ID = {todo.id}
      </a>

      <FormControl
        defaultValue={todo.id}
        className="w-50"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />

      <h3>Updating an Item in an Array</h3>
      <a
        href={`${API}/${todo.id}/title/${todo.title}`}
        id="wd-update-todo"
        className="btn btn-primary float-end"
      >
        Update Todo
      </a>

      <FormControl
        defaultValue={todo.id}
        className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />

      <FormControl
        defaultValue={todo.title}
        className="w-50 float-start"
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />

      <br />
      <br />
      <hr />

      <h3>Updating Completed & Description</h3>

<div className="d-flex align-items-center mb-3">
  <FormCheck
    type="checkbox"
    id="wd-todo-completed"
    label="Completed?"
    checked={todo.completed}
    onChange={(e) =>
      setTodo({ ...todo, completed: e.target.checked })
    }
    className="me-3"
  />

  <a
    className="btn btn-warning"
    href={`${API}/${todo.id}/completed/${todo.completed}`}
  >
    Update Completed
  </a>
</div>

<div className="d-flex align-items-center mb-3">
  <FormControl
    className="me-3"
    style={{ maxWidth: "300px" }}
    defaultValue={todo.description}
    onChange={(e) =>
      setTodo({ ...todo, description: e.target.value })
    }
  />

  <a
    className="btn btn-info"
    href={`${API}/${todo.id}/description/${todo.description}`}
  >
    Update Description
  </a>
</div>

<hr />

    </div>
  );
}
