import { prisma } from "./prisma.server";

let INSTAGRAM_CLIENT_ID: any = process.env.INSTAGRAM_CLIENT_ID;
let INSTAGRAM_CLIENT_SECRET: any = process.env.INSTAGRAM_CLIENT_SECRET;

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
  formdata.append("redirect_uri", "https://069b-69-127-45-71.ngrok.io/insta");
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
  let media = await prisma.user.findUnique({
    where: { id: userId },
    select: { items: true },
  });
  if (media === null) {
    return "[]" as string;
  } else {
    return media.items;
  }
};

export const getMedia = async (username: string) => {
  // if (userId === null) {
  //   return "[]" as string;
  // }
  let media = await prisma.user.findFirst({
    where: { username: username },
    select: { items: true },
  });
  if (media === null) {
    return "[]" as string;
  } else {
    return media.items;
  }
};

export const saveMedia = async (userId: string | null, media: any) => {
  console.log(userId);
  if (userId === null) {
    return "sorry";
  }
  let item = await prisma.user.update({
    where: { id: userId },
    data: { items: media },
  });
  return item;
};

export const searchStores = async (query: string) => {
  let stores = await prisma.user.findMany({
    where: { username: { contains: query } },
    select: { username: true },
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
