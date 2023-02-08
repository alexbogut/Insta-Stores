import { prisma } from "./prisma.server";

export const getItem = async (id: string) => {
  let item = await prisma.item.findUnique({ where: { id: id } });
  return item;
};
