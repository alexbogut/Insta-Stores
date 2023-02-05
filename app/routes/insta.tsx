import { fetchToken, fetchData } from "~/helpers/instaAuth.server";
import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "~/components/card";

export const loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let code = url.searchParams.get("code");
  console.log(code);

  const res = await fetchToken(code);
  console.log(res);
  const data = await fetchData(res);
  console.log(data);
  return data;
};
export default function Store() {
  const { data } = useLoaderData();

  return (
    <>
      <Outlet />
      <div className="grid grid-cols-4 gap-4">
        {data.map((item: any) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </>
  );
}
