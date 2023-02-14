import { Modal } from "~/components/modal";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/helpers/auth.server";
import { useState } from "react";
import { createMessage } from "~/helpers/message.server";
import { getItem } from "~/helpers/item.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { itemId } = params;

  if (typeof itemId !== "string") {
    return redirect("/home");
  }
  if (itemId === "123456789") {
    return redirect("/inbox");
  }

  let itemjson = await getItem(itemId);
  let item = json(itemjson);
  return item;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const message = form.get("message");
  const recipientId = form.get("recipientId");
  const item = form.get("item");
  const userId = await requireUserId(request);

  if (
    typeof message !== "string" ||
    typeof recipientId !== "string" ||
    typeof item !== "string"
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (!message.length) {
    return json(
      { error: `Please provide a Message`, form: action },
      { status: 400 }
    );
  }
  if (!recipientId.length) {
    return json(
      { error: `Recipient not found...`, form: action },
      { status: 400 }
    );
  }
  await createMessage(message, userId, recipientId, item);

  return null;
};

export default function MessageModal() {
  const actionData = useActionData();
  const [formError] = useState(actionData?.error || "");
  const [formData, setFormData] = useState({
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: e.target.value }));
  };
  const item = useLoaderData();
  return (
    <Modal isOpen={true} className="w-1/3 p-10" URL={`/seller/${item.ownerId}`}>
      <div className="flex justify-center">
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <img
            className="w-full"
            src={item.imageURL}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
            <p className="text-gray-700 text-base">{item.caption}</p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #winter
            </span>
          </div>
        </div>
      </div>
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
        {formError}
      </div>
      <form method="POST">
        <input type="hidden" value={item.ownerId} name="recipientId" />
        <input type="hidden" value={JSON.stringify(item)} name="item" />
        <div className="text-center flex flex-col md:flex-row gap-y-2 md:gap-y-0">
          <div className="flex-1 flex flex-col gap-y-4">
            <textarea
              name="message"
              className="w-full rounded-xl h-40 p-4"
              value={formData.message}
              onChange={(e) => handleChange(e, "message")}
              placeholder={`Let ${item.username} know you're interested!`}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="rouded-xl bg-yellow-300 font-semibold text-blue-600 w-80 h-12 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            {" "}
            Send
          </button>
        </div>
      </form>
    </Modal>
  );
}
