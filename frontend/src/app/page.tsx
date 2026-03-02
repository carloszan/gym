import { redirect } from "next/navigation";

import SignIn from "@/components/signin-button";
import { SignOut } from "@/components/signout-button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user) return redirect("/login");

  return (
    <div className="min-h-screen py-2">
      <div className="max-w-2xl mx-auto p-6">
        Esse é o sistema de entradas da sua academia.
      </div>
    </div>
  );
}
