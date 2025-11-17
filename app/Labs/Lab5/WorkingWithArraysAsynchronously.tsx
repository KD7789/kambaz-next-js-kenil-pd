"use client";

import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";
import * as client from "./client";
import { AxiosError } from "axios";

/* --------------------------------------
   Types
-------------------------------------- */
export interface Todo {
  id: string | number;
  title: string;
  completed: boolean;
  editing?: boolean;
}

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* --------------------------------------
     FETCH
  -------------------------------------- */
  const fetchTodos = async () => {
    const todos: Todo[] = await client.fetchTodos();
    setTodos(todos);
  };

  /* --------------------------------------
     REMOVE
  -------------------------------------- */
  const removeTodo = async (todo: Todo) => {
    const updatedTodos: Todo[] = await client.removeTodo(todo);
    setTodos(updatedTodos);
  };

  /* --------------------------------------
     DELETE
  -------------------------------------- */
  const deleteTodo = async (todo: Todo) => {
    try {
      await client.deleteTodo(todo);
      setTodos(todos.filter((t) => t.id !== todo.id));
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setErrorMessage(err.response?.data?.message || "Error deleting todo");
      } else {
        setErrorMessage("Error deleting todo");
      }
    }
  };

  /* --------------------------------------
     CREATE
  -------------------------------------- */
  const createNewTodo = async () => {
    const updatedTodos: Todo[] = await client.createNewTodo();
    setTodos(updatedTodos);
  };

  /* --------------------------------------
     POST NEW
  -------------------------------------- */
  const postNewTodo = async () => {
    const newTodo: Todo = await client.postNewTodo({
      title: "New Posted Todo",
      completed: false,
    });
    setTodos([...todos, newTodo]);
  };

  /* --------------------------------------
     EDIT
  -------------------------------------- */
  const editTodo = (todo: Todo) => {
    setTodos(
      todos.map((t) =>
        t.id === todo.id ? { ...todo, editing: true } : t
      )
    );
  };

  /* --------------------------------------
     UPDATE
  -------------------------------------- */
  const updateTodo = async (todo: Todo) => {
    try {
      await client.updateTodo(todo);

      setTodos(
        todos.map((t) =>
          t.id === todo.id ? todo : t
        )
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setErrorMessage(err.response?.data?.message || "Error updating todo");
      } else {
        setErrorMessage("Error updating todo");
      }
    }
  };

  /* --------------------------------------
     LOAD
  -------------------------------------- */
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>

      {errorMessage && (
        <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">
          {errorMessage}
        </div>
      )}

      <h4>
        Todos
        <FaPlusCircle
          onClick={createNewTodo}
          className="text-success float-end fs-3"
          id="wd-create-todo"
        />
        <FaPlusCircle
          onClick={postNewTodo}
          className="text-primary float-end fs-3 me-3"
          id="wd-post-todo"
        />
      </h4>

      <ListGroup>
        {todos.map((todo: Todo) => (
          <ListGroupItem key={todo.id} className="clearfix">
            <FaTrash
              onClick={() => removeTodo(todo)}
              className="text-danger float-end mt-1 ms-2"
              id="wd-remove-todo"
            />

            <TiDelete
              onClick={() => deleteTodo(todo)}
              className="text-danger float-end fs-3 me-2"
              id="wd-delete-todo"
            />

            <FaPencil
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
            />

            <input
              type="checkbox"
              className="form-check-input float-start me-2"
              checked={todo.completed}
              onChange={(e) =>
                updateTodo({ ...todo, completed: e.target.checked })
              }
            />

            {!todo.editing ? (
              <span>{todo.title}</span>
            ) : (
              <FormControl
                className="w-50 float-start"
                defaultValue={todo.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                onChange={(e) =>
                  updateTodo({ ...todo, title: e.target.value })
                }
              />
            )}
          </ListGroupItem>
        ))}
      </ListGroup>

      <hr />
    </div>
  );
}
