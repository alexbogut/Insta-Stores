import type { LoaderFunction } from "@remix-run/node";
import { requireMedia, getMedia } from "~/helpers/instaAuth.server";
import { getUserId } from "~/helpers/auth.server";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "~/components/card";
import { Link } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.sellerId;
  if (username === undefined) {
    return null;
  }
  const media = await getMedia(username);
  const res = JSON.parse(media);

  return res;
};
export default function Store() {
  const res = useLoaderData();

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {res.length !== 0 ? (
          res.map((item: any) => <Card key={item.id} {...item} />)
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
