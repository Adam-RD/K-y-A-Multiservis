"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteProductAction } from "./actions";

type ProductDeleteButtonProps = {
  id: string;
};

export const ProductDeleteButton = ({ id }: ProductDeleteButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    toast("¿Eliminar producto?", {
      description:
        "Se borrarán también los movimientos asociados. Esta acción no se puede deshacer.",
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
      action: {
        label: "Eliminar",
        onClick: () => {
          startTransition(async () => {
            const result = await deleteProductAction(id);
            if (result?.error) {
              toast.error(result.error);
              return;
            }
            toast.success("Producto eliminado.");
            router.refresh();
          });
        },
      },
      duration: 8000,
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-rose-100/80 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:border-rose-400 hover:bg-rose-200 disabled:opacity-60"
    >
      <RiDeleteBin6Line />
      Eliminar
    </button>
  );
};
