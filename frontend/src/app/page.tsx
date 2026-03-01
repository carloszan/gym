import { redirect } from "next/navigation";

import SignIn from "@/components/signin-button";
import { SignOut } from "@/components/signout-button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user) return redirect("/login");

  return (
    <div>
    </div>
  );
}
