import axios from "axios";
import type { Assignment } from "./[cid]/Assignments/reducer";
import type { Course } from "./reducer";
import type { Enrollment } from "../Enrollments/reducer";
import type { Quiz, Question, Answer } from "../Courses/[cid]/Quizzes/reducer";

/* ---------------------------------------------------
   Types
--------------------------------------------------- */
export interface Module {
  _id: string;
  name: string;
  course: string;
  editing?: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  _id: string;
  name: string;
}

export type CreateCourseInput = Omit<Course, "_id">;
export type CreateModuleInput = Omit<Module, "_id">;
export type CreateAssignmentInput = Omit<Assignment, "_id">;

/* ---------------------------------------------------
   Axios with credentials
--------------------------------------------------- */
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

/* ---------------------------------------------------
   API Base URLs
--------------------------------------------------- */
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER!;
export const USERS_API = `${HTTP_SERVER}/api/users`;
export const COURSES_API = `${HTTP_SERVER}/api/courses`;
export const MODULES_API = `${HTTP_SERVER}/api/modules`;
export const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
export const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
export const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

/* ---------------------------------------------------
   COURSES
--------------------------------------------------- */
export const fetchAllCourses = async (): Promise<Course[]> => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async (): Promise<Course[]> => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`
  );
  return data;
};

export const createCourse = async (
  course: CreateCourseInput
): Promise<Course> => {
  const { data } = await axiosWithCredentials.post(
    `${HTTP_SERVER}/api/courses`,
    course
  );
  return data;
};

export const deleteCourse = async (
  courseId: string
): Promise<{ message: string }> => {
  const { data } = await axiosWithCredentials.delete(
    `${COURSES_API}/${courseId}`
  );
  return data;
};

export const updateCourse = async (course: Course): Promise<Course> => {
  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${course._id}`,
    course
  );
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};

/* ---------------------------------------------------
   MODULES
--------------------------------------------------- */
export const findModulesForCourse = async (
  courseId: string
): Promise<Module[]> => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return data;
};

export const createModuleForCourse = async (
  courseId: string,
  module: CreateModuleInput
): Promise<Module> => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return data;
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${COURSES_API}/${courseId}/modules/${moduleId}`
  );
  return data;
};

export const updateModule = async (
  courseId: string,
  module: Module
): Promise<Module> => {
  const { data } = await axios.put(
    `${COURSES_API}/${courseId}/modules/${module._id}`,
    module
  );
  return data;
};

/* ---------------------------------------------------
   ASSIGNMENTS
--------------------------------------------------- */
export const findAssignmentsForCourse = async (
  courseId: string
): Promise<Assignment[]> => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return data as Assignment[];
};

export const findAssignmentById = async (
  assignmentId: string
): Promise<Assignment> => {
  const { data } = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data as Assignment;
};

export const createAssignmentForCourse = async (
  courseId: string,
  assignment: Omit<Assignment, "_id">
): Promise<Assignment> => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment
  );
  return data;
};

export const deleteAssignment = async (
  assignmentId: string
): Promise<{ message: string }> => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};

export const updateAssignment = async (
  assignment: Assignment
): Promise<Assignment> => {
  const { data } = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
  return data;
};

/* ---------------------------------------------------
   ENROLLMENTS
--------------------------------------------------- */
export const fetchEnrollments = async (
  userId: string
): Promise<Course[]> => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/${userId}/courses`
  );
  return data;
};

export const enrollInCourse = async (
  userId: string,
  courseId: string
): Promise<Enrollment> => {
  const { data } = await axiosWithCredentials.post(ENROLLMENTS_API, {
    userId,
    courseId,
  });
  return data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};

export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};

/* ---------------------------------------------------
   QUIZZES (NEW, FIXED PART ONLY)
--------------------------------------------------- */
export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/quizzes`
  );
  return data;
};

export const createQuizForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/quizzes`,
    {}
  );
  return data;
};

export const findQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const updateQuiz = async (quizId: string, quiz: Quiz): Promise<Quiz> => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quizId}`,
    quiz
  );
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}`
  );
  return data;
};

export const saveQuizQuestions = async (
  quizId: string,
  questions: Question[]
): Promise<Quiz> => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quizId}/questions`,
    { questions }
  );
  return data;
};

export const submitQuizAttempt = async (
  quizId: string,
  payload: { answers: Answer[]; score: number }
) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    payload
  );
  return data;
};

export const findMyLastAttempt = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts/me`
  );
  return data;
};
