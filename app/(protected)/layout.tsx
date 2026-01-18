import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-transparent">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <div
          className="flex min-h-screen flex-col gap-6 p-6"
          style={{ backgroundColor: "var(--app-main-bg)" }}
        >
          <TopBar username={user.username} />
          <main className="flex flex-1 flex-col gap-6 animate-rise">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
