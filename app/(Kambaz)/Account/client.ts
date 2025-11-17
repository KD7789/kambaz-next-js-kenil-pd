import axios from "axios";

/* ---------------------------------------------------
   Types
--------------------------------------------------- */
export interface UserCredentials {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  password?: string;
  role?: string;
}

export interface UpdateUserPayload extends Partial<User> {
  _id: string;
}

/* ---------------------------------------------------
   Axios instance (with cookies)
--------------------------------------------------- */
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

/* ---------------------------------------------------
   API Base URLs
--------------------------------------------------- */
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER!;
export const USERS_API = `${HTTP_SERVER}/api/users`;

/* ---------------------------------------------------
   API Functions
--------------------------------------------------- */
export const signup = async (user: UserCredentials): Promise<User> => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return response.data;
};

export const signin = async (credentials: UserCredentials): Promise<User> => {
  const response = await axios.post(`${USERS_API}/signin`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const signout = async (): Promise<{ message: string }> => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

export const profile = async (): Promise<User | null> => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

export const updateUser = async (
  user: UpdateUserPayload
): Promise<User> => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};
