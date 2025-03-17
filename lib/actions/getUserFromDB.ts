import prisma from "../../prisma/client";

export const getUserFromDB = async (userId: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return null;
  }
};
