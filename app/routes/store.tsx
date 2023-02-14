import type { LoaderFunction } from "@remix-run/node";
import { requireMedia } from "~/helpers/instaAuth.server";
import { getUserId } from "~/helpers/auth.server";
import { clearMessages } from "~/helpers/message.server";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Card } from "~/components/card";
import { Link } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  console.log(userId);
  const media = await requireMedia(userId);
  console.log(json(media));
  return json(media);
};
export default function Store() {
  const res = useLoaderData();

  let navigate = useNavigate();
  const instaLogin = () => {
    window.location.href = `https://api.instagram.com/oauth/authorize?client_id=1332287557340473&redirect_uri=https://insta-stores-7hzw8fk1d-alexbogut.vercel.app/insta&scope=user_profile,user_media&response_type=code`;
  };

  return (
    <>
      <div className="flex justify-between">
        <Link className="" to={"/home"}>
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5 mt-5">
            Home
          </button>
        </Link>
        <button
          onClick={() => instaLogin()}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-5 mt-5"
        >
          Sign into Insta
        </button>
      </div>

      <div className=" mt-11 flex justify-center">
        <h1 className="text-[50px] font-semibold">
          {res.length === 0 ? "My Store" : res[0].username}
        </h1>
        <hr />
      </div>
      <div className="grid grid-cols-4 gap-y-6 justify-around mt-10">
        {res.length !== 0 ? (
          res.map((item: any) => <Card key={item.id} {...item} />)
        ) : (
          <h2 className="text-2xl text-center ml-11">
            No Items in Store ... Sign in to Instagram to instantly build a
            store!{JSON.stringify(res)}
          </h2>
        )}
      </div>
      <div></div>
    </>
  );
}
