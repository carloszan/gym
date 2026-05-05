"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  isLoggedIn: boolean;
  onSignOut: () => Promise<void>;
}

export default function MobileMenu({ isLoggedIn, onSignOut }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const id = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <>
      <button
        className="md:hidden flex items-center cursor-pointer p-2 text-gray-700 hover:text-gray-900"
        aria-label="Toggle navigation"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md flex flex-col md:hidden px-2 pb-3 space-y-1 z-50">
          <Link
            href="/"
            className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/checkin"
                className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              >
                Entrada de Alunos
              </Link>
              <Link
                href="/lista"
                className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              >
                Lista de Alunos
              </Link>
              <Link
                href="/students"
                className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              >
                Cadastrar Aluno
              </Link>
            </>
          )}

          <Link
            href="/about"
            className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
          >
            Sobre
          </Link>

          {!isLoggedIn && (
            <Link
              href="/politica-de-privacidade"
              className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Política de Privacidade
            </Link>
          )}

          {isLoggedIn ? (
            <button
              className="text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => onSignOut()}
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
      )}
    </>
  );
}
