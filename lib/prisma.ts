import { PrismaClient } from "@/app/prisma/client";

// === Global PrismaClient a Next.js dev hot reload miatt ===
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Alap kliens létrehozása (ha még nincs)
const basePrisma = globalForPrisma.prisma ?? new PrismaClient();

// 2. Kliens kiterjesztése a validációhoz ($extends)
// Fontos: Az $extends új példányt ad vissza, ezt kell exportálni!
// const prisma = basePrisma.$extends({
//   query: {
//     example_model: {
//       async $allOperations({
//         args,
//         query,
//         operation,
//       }: {
//         args: any;
//         query: any;
//         operation: string;
//       }) {
//         const { field1, field2 } = args.data || {};
//         if (operation.includes("update") || operation.includes("create")) {
//           if (field1) {
//             const builtDate = new Date(field1 as string);
//             if (builtDate > new Date()) {
//               throw new Error("field1 conot be in the future!");
//             }
//           }

//           if (field2 && (field2 as string).length > 50) {
//             throw new Error("field2 length must be 50 characters or less!");
//           }
//         }

//         return query(args);
//       },
//     },
//   },
// });

// === Node.js dev hot reload fix ===
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
}

// export default prisma; // Ha használunk model $extends-t
export default basePrisma; // Ha nem használunk $extends-t
