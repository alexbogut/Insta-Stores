import { prisma } from "./prisma.server";

export const createMessage = async (
  message: string,
  userId: string,
  recipientId: string,
  item: string
) => {
  let product = JSON.parse(item);
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
      product: {
        id: product.id,
        caption: product.caption,
        imageURL: product.imageURL,
        username: product.username,
        ownerId: product.ownerId,
      },
    },
  });
};

export const getRecievedMessages = async (userId: string) => {
  let messages = await prisma.message.findMany({
    where: { recipientId: userId },
    include: { author: true },
  });
  return messages;
};

export const getSentMessages = async (userId: string) => {
  let messages = await prisma.message.findMany({
    where: { authorId: userId },
    include: { recipient: true, author: true },
  });
  return messages;
};

export const clearMessages = async () => {
  await prisma.message.deleteMany();
};

export const deleteMessage = async (messageId: string) => {
  const message = await prisma.message.delete({ where: { id: messageId } });
  return message;
};

export const getMessage = async (messageId: string) => {
  let message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { author: true },
  });
  return message;
};
