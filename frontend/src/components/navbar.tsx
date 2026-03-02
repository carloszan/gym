import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session;
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Gym
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/costumers"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Cadastrar Aluno
            </Link>
            <Link
              href="/join"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Entrada de Alunos
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sobre
            </Link>
          </div>
          <div>
            {isLoggedIn ? (
              <button
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                onClick={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <div className="flex justify-between">
                  <Image
                    width={24}
                    height={24}
                    src={"/avatar.png"}
                    alt="avatar"
                  />
                  <span className="pl-4">Logout</span>
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
