import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { deleteMessage } from "~/helpers/message.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const id = form.get("id");
  if (typeof id !== "string") {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }
  await deleteMessage(id);
  return redirect("/inbox");
};

export const loader: LoaderFunction = async () => redirect("/inbox");
