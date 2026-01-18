import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";

const main = async (): Promise<void> => {
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: hashPassword("admin123"),
    },
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: "Cuadernos" },
      { name: "Escritura" },
      { name: "Arte" },
    ],
    skipDuplicates: true,
  });

  const categoryRows: { id: string; name: string }[] =
    await prisma.category.findMany();

  const notebooks = categoryRows.find((item) => item.name === "Cuadernos");
  const writing = categoryRows.find((item) => item.name === "Escritura");
  const art = categoryRows.find((item) => item.name === "Arte");

  if (!notebooks || !writing || !art) {
    throw new Error("Seed dependencies missing");
  }

  await prisma.product.createMany({
    data: [
      {
        name: "Cuaderno A4 100 hojas",
        categoryId: notebooks.id,
        unit: "unidad",
        costPrice: 2.5,
        salePrice: 4.0,
        minStock: 10,
        currentStock: 50,
      },
      {
        name: "Boligrafo azul",
        categoryId: writing.id,
        unit: "unidad",
        costPrice: 0.2,
        salePrice: 0.6,
        minStock: 30,
        currentStock: 120,
      },
      {
        name: "Marcadores x6",
        categoryId: art.id,
        unit: "paquete",
        costPrice: 3.0,
        salePrice: 5.5,
        minStock: 8,
        currentStock: 25,
      },
    ],
    skipDuplicates: true,
  });

  const products = await prisma.product.findMany();
  const firstProduct = products[0];

  if (firstProduct) {
    await prisma.stockMovement.create({
      data: {
        type: "IN",
        reason: "PURCHASE",
        qty: 20,
        productId: firstProduct.id,
        userId: admin.id,
      },
    });
  }

  console.log(
    `Seed completado. Admin: admin / admin123. Categories: ${categories.count}`
  );
};

main()
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

