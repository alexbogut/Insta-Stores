import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authInsta } from "~/helpers/auth.server";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  let INSTAGRAM_CLIENT_ID: any = process.env.INSTAGRAM_CLIENT_ID;
  let INSTAGRAM_REDIRECT_URI: any = process.env.INSTAGRAM_REDIRECT_URI;

  window.location.href = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
};
