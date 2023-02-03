import { LoaderFunction, redirect } from "@remix-run/node";
import { requireUserId } from "~/helpers/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return redirect("/home");
};
