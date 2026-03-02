import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session;
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        {/* checkbox peer toggles the mobile menu (no client JS required) */}
        <input id="nav-toggle" type="checkbox" className="hidden peer" aria-hidden="true" />

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
                  onClick={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
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

            {/* Mobile hamburger */}
            <label
              htmlFor="nav-toggle"
              className="md:hidden flex items-center cursor-pointer p-2 text-gray-700 hover:text-gray-900"
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
        </div>

        {/* Mobile menu (visible when checkbox is checked) */}
        <div className="hidden peer-checked:flex flex-col md:hidden px-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/costumers"
                className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              >
                Cadastrar Aluno
              </Link>
              <Link
                href="/join"
                className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              >
                Entrada de Alunos
              </Link>
            </>
          )}

          <Link
            href="/about"
            className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
          >
            Sobre
          </Link>

          {isLoggedIn ? (
            <button
              className="text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              onClick={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <div className="flex items-center">
                <Image width={24} height={24} src={"/avatar.png"} alt="avatar" />
                <span className="pl-3">Logout</span>
              </div>
            </button>
          ) : (
            <Link
              href="/login"
              className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
