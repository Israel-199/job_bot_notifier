import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    console.log("Connected to Postgres via Prisma");
  } catch (err) {
    console.error("Prisma connection error:", err.message);
  }
})();

export default prisma;
