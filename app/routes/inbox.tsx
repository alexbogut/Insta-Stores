import type { LoaderFunction } from "@remix-run/node";
import { getUserId } from "~/helpers/auth.server";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Mailcard } from "~/components/mailCard";
import { useState } from "react";
import { Layout } from "~/components/layout";
import { Mailitem } from "~/components/mailItem";
import { getRecievedMessages } from "~/helpers/message.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return redirect("/login");
  }
  let messages = await getRecievedMessages(userId);
  return json(messages);
};
export default function Inbox() {
  const messages = useLoaderData();
  const [text, setText] = useState(messages[0]?.text);
  const [product, setProduct] = useState(messages[0]?.product);
  const [header, setHeader] = useState(messages[0]?.author.profile);
  const [date, setDate] = useState(new Date(messages[0]?.createdAt));
  const [id, setId] = useState(messages[0]?.id);

  const clickHandler = (
    text: string,
    createdAt: string,
    product: {
      id: string;
      caption: string;
      imageURL: string;
      username: string;
      ownerID: string;
    },
    profile: {
      firstName: string;
      lasName: string;
    },
    id: string
  ) => {
    setText(text);
    setProduct(product);
    setHeader(profile);
    setDate(new Date(createdAt));
    setId(id);
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
            <div className="h-16 text-center pt-4 text-white font-bold transition duration-300 ease-in-out bg-slate-700 hover:bg-slate-700">
              Inbox
            </div>
            <Link to="/sent">
              <div className="h-16 text-center pt-4 text-white font-bold transition duration-300 ease-in-out hover:bg-slate-700">
                Sent
              </div>
            </Link>
            <div className="h-16 text-center pt-4 text-white font-bold transition duration-300 ease-in-out hover:bg-slate-700">
              Drafts
            </div>
            <div className="h-16 text-center pt-4 text-white font-bold transition duration-300 ease-in-out hover:bg-slate-700">
              Trash
            </div>
          </div>
          <div className="bg-blue-100 flex-initial w-[32rem] flex flex-col divide-y-2 overflow-auto">
            {messages.length === 0 ? (
              <div></div>
            ) : (
              messages.map((message: any) => (
                <Mailitem
                  key={message.id}
                  {...message}
                  clickHandler={clickHandler}
                />
              ))
            )}
          </div>
          {messages.length === 0 ? (
            <div>No Messages yet</div>
          ) : (
            <div className="bg-slate-50 flex-initial w-full flex flex-col">
              <div className="h-20 bg-slate-200 flex flex-none justify-between">
                <div className="flex flex-col justify-between ml-4">
                  <div className="mt-2 text-xl">Item# {product?.id}</div>
                  <div className="mb-2 font-light">
                    From: {header?.firstName}
                    {` ${header?.lastName}`}
                  </div>
                </div>
                <div className="flex flex-col justify-between mr-4">
                  <form action="/deleteMessage" method="POST">
                    <input type="hidden" value={id} name="id" />
                    <button type="submit" className="mt-2">
                      Delete
                    </button>
                  </form>
                  <div className="mb-2 font-light">{date.toDateString()}</div>
                </div>
              </div>
              <div className="p-7 flex justify-between ">
                <div className="flex flex-col justify-between w-96 flex-1">
                  <div className="max-w-[350px] ">{text}</div>
                  <Link className="self-end " to={`/reply/${id}`}>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5 mt-5 mr-4">
                      {`Reply ->`}
                    </button>
                  </Link>
                </div>

                <Mailcard {...product} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
