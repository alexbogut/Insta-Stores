import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout, deleteAllUsers } from "~/helpers/auth.server";

export const action: ActionFunction = async ({ request }) => {
  await deleteAllUsers();
  return logout(request);
};

export const loader: LoaderFunction = async () => redirect("/");
