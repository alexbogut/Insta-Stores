import type { LoaderFunction } from "@remix-run/node";
import { requireMedia } from "~/helpers/instaAuth.server";
import { getUserId } from "~/helpers/auth.server";
import { clearMessages } from "~/helpers/message.server";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
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
    window.location.href = `https://api.instagram.com/oauth/authorize?client_id=1332287557340473&redirect_uri=https://c638-69-127-45-71.ngrok.io/insta&scope=user_profile,user_media&response_type=code`;
  };

  return (
    <>
      <Link className="flex" to={"/home"}>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5 mt-5">
          Home
        </button>
      </Link>
      <button
        onClick={() => instaLogin()}
        className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
      >
        Log in with Insta
      </button>
      <div className="grid grid-cols-4 gap-y-6 justify-around mt-10">
        {res.length !== 0 ? (
          res.map((item: any) => <Card key={item.id} {...item} />)
        ) : (
          <h2>No Items in Store ...</h2>
        )}
      </div>
      <div>
        <Link to={"/home"}>Home</Link>
        {/* <button className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Home
        </button> */}
      </div>
    </>
  );
}
