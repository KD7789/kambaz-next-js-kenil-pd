import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER!;

/* -----------------------------------------
   Types
----------------------------------------- */
export interface Todo {
  id: number | string;
  title: string;
  completed: boolean;
  editing?: boolean;
}

/* -----------------------------------------
   Welcome
----------------------------------------- */
export const fetchWelcomeMessage = async (): Promise<string> => {
  const response = await axios.get(`${HTTP_SERVER}/lab5/welcome`);
  return response.data;
};

/* -----------------------------------------
   Assignment
----------------------------------------- */
const ASSIGNMENT_API = `${HTTP_SERVER}/lab5/assignment`;

export interface Assignment {
  title: string;
  description: string;
  due: string;
  completed: boolean;
}

export const fetchAssignment = async (): Promise<Assignment> => {
  const response = await axios.get(ASSIGNMENT_API);
  return response.data;
};

export const updateTitle = async (title: string): Promise<Assignment> => {
  const response = await axios.get(`${ASSIGNMENT_API}/title/${title}`);
  return response.data;
};

/* -----------------------------------------
   Todos
----------------------------------------- */
const TODOS_API = `${HTTP_SERVER}/lab5/todos`;

/** GET all todos */
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(TODOS_API);
  return response.data;
};

/** REMOVE (server returns updated array) */
export const removeTodo = async (todo: Todo): Promise<Todo[]> => {
  const response = await axios.get(`${TODOS_API}/${todo.id}/delete`);
  return response.data;
};

/** CREATE */
export const createNewTodo = async (): Promise<Todo[]> => {
  const response = await axios.get(`${TODOS_API}/create`);
  return response.data;
};

/** POST */
export const postNewTodo = async (
  todo: Omit<Todo, "id">
): Promise<Todo> => {
  const response = await axios.post(`${TODOS_API}`, todo);
  return response.data;
};

/** DELETE */
export const deleteTodo = async (
  todo: Todo
): Promise<{ message: string } | Todo[]> => {
  const response = await axios.delete(`${TODOS_API}/${todo.id}`);
  return response.data;
};

/** UPDATE */
export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await axios.put(`${TODOS_API}/${todo.id}`, todo);
  return response.data;
};
