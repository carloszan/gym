import { redirect } from "next/navigation";
import { auth } from "@/auth";
import InactiveStudentsDashboard from "@/components/inactive-students-dashboard";

export default async function AlunosInativosPage() {
  const session = await auth();
  if (!session?.user) return redirect("/login");
  return <InactiveStudentsDashboard />;
}
