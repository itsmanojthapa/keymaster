import prisma from "@/prisma/prisma";

export const getUserFromDB = async (userId: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return null;
  }
};
