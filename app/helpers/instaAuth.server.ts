import { prisma } from "./prisma.server";

let INSTAGRAM_CLIENT_ID: any = process.env.INSTAGRAM_CLIENT_ID;
let INSTAGRAM_CLIENT_SECRET: any = process.env.INSTAGRAM_CLIENT_SECRET;
let URI: any = process.env.INSTAGRAM_REDIRECT_URI;

export const fetchData = async (props: {
  access_token: string;
  user_id: string;
}) => {
  var myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "csrftoken=KohUfJJzyRrIApexqBW3enDMmHjgTJNH; ig_nrcb=1"
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_url,username&access_token=${props.access_token}`,
    requestOptions as RequestInit
  );

  const data = await res.json();

  return data;
};

export const fetchToken = async (code: any) => {
  var myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "csrftoken=KohUfJJzyRrIApexqBW3enDMmHjgTJNH; ig_nrcb=1"
  );

  var formdata = new URLSearchParams();
  formdata.append("client_id", INSTAGRAM_CLIENT_ID);
  formdata.append("client_secret", INSTAGRAM_CLIENT_SECRET);
  formdata.append("grant_type", "authorization_code");
  formdata.append("redirect_uri", URI);
  formdata.append("code", code);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  const res = await fetch(
    "https://api.instagram.com/oauth/access_token",
    requestOptions as RequestInit
  );

  const data = await res.json();

  return data;
};

export const requireMedia = async (userId: string | null) => {
  if (userId === null) {
    return "[]" as string;
  }
  let media = await prisma.item.findMany({
    where: { ownerId: userId },
  });
  if (media === null) {
    return "[]" as string;
  } else {
    return media;
  }
};

export const getMedia = async (id: string) => {
  // if (userId === null) {
  //   return "[]" as string;
  // }
  let media = await prisma.item.findMany({
    where: { ownerId: id },
  });
  if (media === null) {
    return "[]" as string;
  } else {
    return media;
  }
};

const deleteMedia = async (userId: string) => {
  const res = await prisma.item.deleteMany({ where: { ownerId: userId } });
  return res;
};

export const saveMedia = async (userId: string | null, media: any) => {
  if (userId === null) {
    return "Invalid UserID";
  }

  await deleteMedia(userId);

  await media.map(
    async (content: { caption: string; media_url: string; username: string }) =>
      await prisma.item.create({
        data: {
          caption: content.caption,
          imageURL: content.media_url,
          username: content.username,
          owner: { connect: { id: userId } },
        },
      })
  );

  return media;
};

export const searchStores = async (query: string) => {
  let stores = await prisma.user.findMany({
    where: { username: { contains: query } },
    select: { username: true, id: true },
  });
  return stores;
};

export const saveUsername = async (userId: string | null, username: string) => {
  if (userId === null) {
    return "sorry";
  }
  let user = await prisma.user.update({
    where: { id: userId },
    data: { username: username },
  });
  return user;
};
