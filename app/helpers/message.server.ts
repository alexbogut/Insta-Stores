import { prisma } from "./prisma.server";

export const createMessage = async (
  message: string,
  userId: string,
  recipientId: string
) => {
  await prisma.message.create({
    data: {
      text: message,
      author: {
        connect: {
          id: userId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
    },
  });
};

export const getMessages = async (userId: string) => {
  let messages = await prisma.message.findMany({
    where: { recipientId: userId },
  });
  return messages;
};
