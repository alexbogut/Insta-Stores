import {
  fetchToken,
  fetchData,
  saveMedia,
  saveUsername,
} from "~/helpers/instaAuth.server";
import { getUserId } from "~/helpers/auth.server";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let code = url.searchParams.get("code");

  const res = await fetchToken(code);
  const data = await fetchData(res);
  const username = data.data[0].username;
  let media = data.data;
  const userId = await getUserId(request);
  await saveUsername(userId, username);

  await saveMedia(userId, media);

  return redirect("/store");
};
