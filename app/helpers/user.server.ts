// app/utils/user.server.ts
import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server";
import { prisma } from "./prisma.server";

const sample_URL =
  "data:image/jpeg;base64,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";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  });
  await prisma.message.create({
    data: {
      text: "Hello! Welcome to your Insta Stores Mailbox! This is where all sent and recived messages from other users will reside. The item of interest will be displayed to to the right.",
      author: {
        connect: {
          id: newUser.id,
        },
      },
      recipient: {
        connect: {
          id: newUser.id,
        },
      },
      product: {
        id: "123456789",
        caption: "The Caption for the Sample Product",
        imageURL: sample_URL,
        username: "sample_user",
        ownerId: "12345678",
      },
    },
  });
  return { id: newUser.id, email: user.email };
};

export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

export const getCode = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { code: true },
  });
};

export const getToken = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};
