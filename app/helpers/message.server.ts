import { prisma } from "./prisma.server";

export const createMessage = async (
  message: string,
  userId: string,
  recipientId: string,
  item: string
) => {
  let product = JSON.parse(item);
  console.log("ITEM:", item);
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

export const getMessages = async (userId: string) => {
  let messages = await prisma.message.findMany({
    where: { recipientId: userId },
    include: { author: true },
  });
  return messages;
};

export const clearMessages = async () => {
  await prisma.message.deleteMany();
};

export const deleteMessage = async (messageId: string) => {
  console.log("ID:", messageId);
  const message = await prisma.message.delete({ where: { id: messageId } });
  console.log("MESSAGE;", message);
  return message;
};
