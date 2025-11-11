"use client";
import { usePathname } from "next/navigation";

export default function Breadcrumb({
  course,
}: {
  course: { name: string } | undefined;
}) {
  const pathname = usePathname();
  const page = pathname.split("/").pop();

  return (
    <span style={{ color: "#d63b3b", fontWeight: 600 }}>
      {course?.name}
      <span style={{ color: "#444", margin: "0 8px" }}>&gt;</span>
      {page}
    </span>
  );
}
