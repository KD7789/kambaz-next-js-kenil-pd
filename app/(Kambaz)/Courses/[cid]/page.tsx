import { redirect } from "next/navigation";

export default function CoursesPage({ params }: { params: { cid: string } }) {
  const { cid } = params;
  redirect(`/Courses/${cid}/Home`);
}

/* import { redirect } from "next/navigation";


export default async function CoursesPage({ params, }: { params: Promise<{ cid: string }>; }) {
 const { cid } = await params;
 redirect(`/Courses/${cid}/Home`);
}

 */