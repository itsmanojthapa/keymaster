import { encryptPassword } from "@/utils/password";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    id: "cm7y6scjd0000ki7760a5e1ol",
    name: "Temp temp",
    email: "temp@gmail.com",
    password: await encryptPassword("12345678"),
    role: "user", // Should be a string since Prisma enums accept string literals
    image: "https://api.dicebear.com/8.x/bottts/svg?seed=Temptemp",
    emailVerified: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function main() {
  try {
    for (const u of userData) {
      await prisma.user.create({ data: u });
    }
    console.log("Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
