import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ReportsDashboard from "@/components/reports-dashboard";

export default async function Home() {
  const session = await auth();
  if (!session?.user) return redirect("/login");
  return <ReportsDashboard />;
}
