import { signIn, auth } from "@/auth";

import Image from "next/image";
import { redirect } from "next/navigation";

import GoogleSVG from "@/../public/google.svg";
import AuthentikSVG from "@/../public/authentik.svg";

function Button({
  signInMethod,
  svg,
  alt,
  text,
  color,
  hover,
}: {
  signInMethod: string;
  svg: any;
  alt: string;
  text: string;
  color: string;
  hover: string;
}) {
  return (
    <button
      onClick={async () => {
        "use server";
        await signIn(signInMethod);
      }}
      className={`w-full flex items-center justify-between gap-2 ${color} text-white px-4 py-2 rounded-lg hover:${hover} transition-colors`}
    >
      <Image src={svg} alt={alt} className="w-8 h-8 flex-2" />
      <span className="text-left flex-1 pl-20">{text}</span>
    </button>
  );
}

export default async function LoginPage() {
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Olá amante do esporte
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Entre com algum login social
        </p>
        <div className="space-y-4">
          <Button
            signInMethod="authentik"
            svg={AuthentikSVG}
            color="bg-green-600"
            hover="bg-green-700"
            alt="Login com Authentik"
            text="Sign in with Authentik"
          />

          <Button
            signInMethod="google"
            svg={GoogleSVG}
            color="bg-blue-600"
            hover="bg-blue-700"
            alt="Sign in with Google"
            text="Sign in with Google"
          />

          {/* <Button
            signInMethod="github"
            svg={GithubSVG}
            color="bg-black"
            alt="Sign in with Github"
            text="Sign in with Github"
          /> */}
        </div>
      </div>
    </div>
  );
}
