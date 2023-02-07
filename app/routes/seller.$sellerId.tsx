import type { LoaderFunction } from "@remix-run/node";
import { requireMedia, getMedia } from "~/helpers/instaAuth.server";
import { getUserId } from "~/helpers/auth.server";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "~/components/card";
import { Link } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = params.sellerId;

  if (userId === undefined) {
    return null;
  }
  const media = await getMedia(userId);

  return { media };
};
export default function Store() {
  const { media, userId } = useLoaderData();

  return (
    <>
      <div className="flex justify-center mt-6">
        <h2 className="text-2xl font-extrabold">{`Welcome to ${media[0].username}!`}</h2>
      </div>
      <div className="flex justify-center">
        <h2 className="text-xl font-semi-bold">
          Click on an item to send a message
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-y-6 justify-around mt-10">
        {media.length !== 0 ? (
          media.map((item: any) => (
            <Card key={item.id} {...item} userId={userId} />
          ))
        ) : (
          <h2>No Items in Store ...</h2>
        )}
      </div>
      <Link to="/home">
        <button>Home</button>
      </Link>
    </>
  );
}
