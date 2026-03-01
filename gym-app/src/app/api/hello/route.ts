import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || !session?.user) {
    return NextResponse.json({ message: "Not authenticated" });
  }
  const user = session?.user;

  // const resApi = await fetch(`http://feed-service:8000/feed/${user.email}`);

  // res.status(resApi.status).json(await resApi.json());
  return NextResponse.json({ message: `Hello from API folder ${user.email}` });
}
