import { PrismaClient } from "@prisma/client";

// === Global PrismaClient a Next.js dev hot reload miatt ===
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Manual type definition for Prisma middleware parameters
type PrismaMiddlewareParams = {
  model?: string; // Probably undefined for raw queries
  action: string; // ex. 'create', 'createMany', 'update', 'updateMany', 'delete', 'deleteMany', stb.
  args: any; // Dinamic arguments (fields)
  dataPath: string[];
  runInTransaction: boolean;
};

// Prisma middleware for custom validation
prisma.$use(async (params: PrismaMiddlewareParams, next: any) => {
  // Custom validation example for the 'User_example_model' model on create action
  if (params.model === "User_example_model" && params.action === "create") {
    
    const { email, password } = params.args.data || {};

    // Example validation: Check if email contains '@'
    if (email && !email.includes("@")) {
      throw new Error("Invalid email format");
    }

    // Example validation: Check if password length is at least 8 characters
    if (password && password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
  }

  // Proceed with the query
  return next(params);
});

// === Node.js dev hot reload fix ===
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
