import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, "Usuario minimo 3 caracteres"),
    password: z.string().min(6, "Contrasena minimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma la contrasena"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

export const userCreateSchema = z
  .object({
    username: z.string().min(3, "Usuario minimo 3 caracteres"),
    password: z.string().min(6, "Contrasena minimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma la contrasena"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

export const userUpdateSchema = z
  .object({
    username: z.string().min(3, "Usuario minimo 3 caracteres"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password && !data.confirmPassword) {
        return true;
      }
      if (!data.password || !data.confirmPassword) {
        return false;
      }
      if (data.password.length < 6) {
        return false;
      }
      return data.password === data.confirmPassword;
    },
    {
      message: "Contrasena invalida o no coincide",
      path: ["confirmPassword"],
    }
  );

export const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  categoryId: z.string().min(1, "Categoría requerida"),
  unit: z.string().min(1, "Unidad requerida"),
  costPrice: z.coerce.number().positive("Costo debe ser mayor a 0"),
  salePrice: z.coerce.number().positive("Precio venta debe ser mayor a 0"),
  minStock: z.coerce.number().int().min(0, "Stock mínimo inválido"),
  currentStock: z.coerce.number().int().min(0, "Stock actual inválido"),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  categoryId: z.string().min(1, "Categoría requerida"),
  unit: z.string().min(1, "Unidad requerida"),
  costPrice: z.number().positive("Costo debe ser mayor a 0"),
  salePrice: z.number().positive("Precio venta debe ser mayor a 0"),
  minStock: z.number().int().min(0, "Stock mínimo inválido"),
  currentStock: z.number().int().min(0, "Stock actual inválido"),
});

export const movementSchema = z.object({
  type: z.enum(["OUT"]),
  reason: z.enum(["SALE"]),
  productId: z.string().min(1, "Producto requerido"),
  qty: z.coerce.number().int().positive("Cantidad debe ser mayor a 0"),
});

export const movementFormSchema = z.object({
  type: z.enum(["OUT"]),
  reason: z.enum(["SALE"]),
  productId: z.string().min(1, "Producto requerido"),
  qty: z.number().int().positive("Cantidad debe ser mayor a 0"),
});

export const addStockSchema = z.object({
  productId: z.string().min(1, "Producto requerido"),
  qty: z.coerce.number().int().positive("Cantidad debe ser mayor a 0"),
});

export const addStockFormSchema = z.object({
  productId: z.string().min(1, "Producto requerido"),
  qty: z.number().int().positive("Cantidad debe ser mayor a 0"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductFormInput = z.infer<typeof productFormSchema>;
export type MovementInput = z.infer<typeof movementSchema>;
export type MovementFormInput = z.infer<typeof movementFormSchema>;
export type AddStockInput = z.infer<typeof addStockSchema>;
export type AddStockFormInput = z.infer<typeof addStockFormSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
