import type { LoaderFunction } from "@remix-run/node";
import { requireMedia } from "~/helpers/instaAuth.server";
import { getUserId } from "~/helpers/auth.server";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "~/components/card";

export const loader: LoaderFunction = async ({ request }) => {
  let userId = await getUserId(request);
  let media = await requireMedia(userId);
  console.log(media);
  return media;
};
export default function Store() {
  const media = useLoaderData();

  const instaLogin = () => {
    window.location.href = `https://api.instagram.com/oauth/authorize?client_id=1332287557340473&redirect_uri=https://069b-69-127-45-71.ngrok.io/insta&scope=user_profile,user_media&response_type=code`;
  };

  return (
    <>
      <button
        onClick={() => instaLogin()}
        className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
      >
        Log in with Insta
      </button>
      {media.length !== 0
        ? media.map((item: any) => <Card key={item.id} {...item} />)
        : null}
    </>
  );
}
