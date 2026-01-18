import { logoutAction } from "@/app/(protected)/actions";
import { RiAddLine, RiLogoutBoxLine, RiUser3Line } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { ThemeSelector } from "@/components/ThemeSelector";

type TopBarProps = {
  username: string;
};

export const TopBar = ({ username }: TopBarProps) => (
  <header className="flex flex-col gap-3 rounded-2xl border border-app bg-white/80 px-4 py-2 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:h-10 sm:w-10">
        <Image
          src="/K y A Multiservis.png"
          alt="K y A Multiservis"
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </div>
      <div>
        <p className="text-xs text-slate-500 sm:text-sm">Dios te bendiga!</p>
        <p className="text-sm font-semibold text-slate-900 capitalize sm:text-base">
          {username}
        </p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <Link
        href="/products/new"
        className="flex items-center gap-2 rounded-lg border border-sky-300 bg-sky-100/80 px-2.5 py-1.5 text-xs font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-200 sm:px-3 sm:py-2 sm:text-sm"
      >
        <RiAddLine className="text-sky-700" />
        <span className="hidden sm:inline">Nuevo producto</span>
      </Link>
      <ThemeSelector />
      <Link
        href="/users"
        className="flex items-center gap-2 rounded-lg border border-teal-300 bg-teal-100/80 px-2.5 py-1.5 text-xs font-semibold text-teal-900 transition hover:border-teal-400 hover:bg-teal-200 sm:px-3 sm:py-2 sm:text-sm"
      >
        <RiUser3Line className="text-teal-700" />
        <span className="hidden sm:inline">Usuarios</span>
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-100/80 px-2.5 py-1.5 text-xs font-semibold text-amber-900 transition hover:border-amber-400 hover:bg-amber-200 hover:cursor-pointer sm:px-3 sm:py-2 sm:text-sm"
        >
          <RiLogoutBoxLine className="text-amber-700" />
          <span className="hidden sm:inline">Cerrar sesion</span>
        </button>
      </form>
    </div>
  </header>
);
