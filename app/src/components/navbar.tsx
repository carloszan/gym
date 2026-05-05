import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import MobileMenu from "./mobile-menu";

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session;

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <nav className="bg-white shadow-md relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Gym
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex space-x-2">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    href="/students"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Cadastrar Aluno
                  </Link>
                  <Link
                    href="/checkin"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Entrada de Alunos
                  </Link>
                  <Link
                    href="/lista"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Lista de Alunos
                  </Link>
                </>
              )}

              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sobre
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Desktop auth / avatar */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <button
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={handleSignOut}
                >
                  <div className="flex items-center">
                    <Image width={24} height={24} src={"/avatar.png"} alt="avatar" />
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

            {/* Mobile menu (client component) */}
            <MobileMenu isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
          </div>
        </div>
      </div>
    </nav>
  );
}
