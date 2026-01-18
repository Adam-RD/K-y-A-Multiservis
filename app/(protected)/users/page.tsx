import { requireUser } from "@/lib/auth";
import { listUsersPaged } from "@/lib/repositories/users";
import { UserManager } from "./UserManager";

type UsersPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const currentUser = await requireUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const page = Number(resolvedSearchParams?.page ?? "1");
  const pageSize = 7;
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const skip = (currentPage - 1) * pageSize;

  const usersResult = await listUsersPaged(skip, pageSize);
  const totalPages = Math.max(1, Math.ceil(usersResult.total / pageSize));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Usuarios</h1>
        <p className="text-sm text-slate-500">
          Crea, edita o elimina usuarios. Usa una contrasena segura y confirma
          antes de guardar.
        </p>
      </div>
      <UserManager
        users={usersResult.items.map(
          (user: { id: string; username: string }) => ({
            id: user.id,
            username: user.username,
          })
        )}
        currentUserId={currentUser.id}
        totalItems={usersResult.total}
        page={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default UsersPage;
