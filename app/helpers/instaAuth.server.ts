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
    `https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=${props.access_token}`,
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
  if (userId !== typeof "string") {
    return null;
  }
  let media = await prisma.user.findUnique({
    where: { id: userId },
    select: { items: true },
  });
  return media;
};

export const saveMedia = async (userId: string | null, media: any) => {
  if (userId !== typeof "string") {
    return null;
  }
  let item = await prisma.user.update({
    where: { id: userId },
    data: { items: media },
  });
  return item;
};
