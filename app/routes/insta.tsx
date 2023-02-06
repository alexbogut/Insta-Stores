import {
  fetchToken,
  fetchData,
  saveMedia,
  saveUsername,
} from "~/helpers/instaAuth.server";
import { getUserId } from "~/helpers/auth.server";
import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "~/components/card";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let code = url.searchParams.get("code");

  const res = await fetchToken(code);
  console.log("TOKEN:", res);
  const data = await fetchData(res);
  const username = data.data[0].username;
  console.log("Data from Insta:", data);
  let media = data.data;
  const userId = await getUserId(request);
  await saveUsername(userId, username);
  console.log("User:", userId);
  const item = await saveMedia(userId, media);
  console.log("ITEM:", item);
  return redirect("/store");
};
// export default function Store() {
//   const { data } = useLoaderData();

//   return (
//     <>
//       <Outlet />
//       <div className="grid grid-cols-4 gap-4">
//         {data.map((item: any) => (
//           <Card key={item.id} {...item} />
//         ))}
//       </div>
//     </>
//   );
// }
