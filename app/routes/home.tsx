import { Layout } from "~/components/layout";
import { Card } from "~/components/card";
import type { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/helpers/auth.server";
import { Outlet, useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  let INSTAGRAM_CLIENT_ID: any = process.env.INSTAGRAM_CLIENT_ID;
  let INSTAGRAM_CLIENT_SECRET: any = process.env.INSTAGRAM_CLIENT_SECRET;
  let url = new URL(request.url);
  let code = url.searchParams.get("code");
  console.log(code);

  const fetchData = async (props: {
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

  const fetchToken = async (code: any) => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Cookie",
      "csrftoken=KohUfJJzyRrIApexqBW3enDMmHjgTJNH; ig_nrcb=1"
    );

    var formdata = new URLSearchParams();
    formdata.append("client_id", INSTAGRAM_CLIENT_ID);
    formdata.append("client_secret", INSTAGRAM_CLIENT_SECRET);
    formdata.append("grant_type", "authorization_code");
    formdata.append("redirect_uri", "https://6ea2-69-127-45-71.ngrok.io/home");
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

  const res = await fetchToken(code);
  console.log(res);
  const data = await fetchData(res);
  console.log(data);
  return data;
};

export default function Home() {
  const { data } = useLoaderData();

  return (
    <>
      <Outlet />
      <div className="h-full flex">
        {data.map((item: any) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </>
  );
}
