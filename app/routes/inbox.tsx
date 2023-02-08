import type { LoaderFunction } from "@remix-run/node";
import { requireMedia } from "~/helpers/instaAuth.server";
import { getUserId } from "~/helpers/auth.server";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { Card } from "~/components/card";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { Layout } from "~/components/layout";
import { Mailcontent } from "~/components/mailContent";
import { Mailitem } from "~/components/mailItem";
import { getMessages } from "~/helpers/message.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return redirect("/login");
  }
  let messages = await getMessages(userId);
  return json(messages);
};
export default function Store() {
  const messages = useLoaderData();
  const [text, setText] = useState(messages[0].text);

  const clickHandler = (text: string) => {
    setText(text);
  };
  return (
    <Layout>
      <Link className="flex" to={"/home"}>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5 mt-5">
          Home
        </button>
      </Link>
      <div className=" mt-11 flex justify-center">
        <h1 className="text-[50px] font-semibold">Your Messages</h1>
        <hr />
      </div>
      <div className="flex justify-around">
        <div className="flex drop-shadow-lg w-3/4 mt-11 bg-slate-400 h-[500px]">
          <div className="bg-black flex-initial w-64 flex flex-col">
            <div className="h-16 text-center pt-4 text-white font-bold transition duration-300 ease-in-out hover:bg-slate-700">
              Inbox
            </div>
            <div className="h-16 text-center pt-4 text-white font-bold transition duration-300 ease-in-out hover:bg-slate-700">
              Sent
            </div>
            <div className="h-16 text-center pt-4 text-white font-bold transition duration-300 ease-in-out hover:bg-slate-700">
              Drafts
            </div>
            <div className="h-16 text-center pt-4 text-white font-bold transition duration-300 ease-in-out hover:bg-slate-700">
              Trash
            </div>
          </div>
          <div className="bg-blue-100 flex-initial w-[32rem] flex flex-col divide-y-2 overflow-auto">
            {messages.map((message: any) => (
              <Mailitem
                key={message.id}
                {...message}
                clickHandler={clickHandler}
              />
            ))}
          </div>
          <div className="bg-slate-50 flex-initial w-full flex flex-col">
            <div className="h-20 bg-slate-200 flex justify-between">
              <div className="flex flex-col justify-between ml-4">
                <div className="mt-2 text-xl">Item Name</div>
                <div className="mb-2 font-light">Sender Name</div>
              </div>
              <div className="flex flex-col justify-between mr-4">
                <div className="mt-2">Delete</div>
                <div className="mb-2 font-light">date</div>
              </div>
            </div>
            <div className="p-7">{text}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
