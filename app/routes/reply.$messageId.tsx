import { Modal } from "~/components/modal";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/helpers/auth.server";
import { useState } from "react";
import { createMessage, getMessage } from "~/helpers/message.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { messageId } = params;

  if (typeof messageId !== "string") {
    return redirect("/home");
  }

  let message = await getMessage(messageId);

  return json(message);
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
  const message = useLoaderData();
  return (
    <Modal isOpen={true} className="w-1/3 p-10" URL={`/sent`}>
      <div className="flex justify-center ">
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-blue-200 mb-5 p-5">
          {message.text}
        </div>
      </div>
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
        {formError}
      </div>
      <form method="POST">
        <input type="hidden" value={message.authorId} name="recipientId" />
        <input
          type="hidden"
          value={JSON.stringify(message.product)}
          name="item"
        />
        <div className="text-center flex flex-col md:flex-row gap-y-2 md:gap-y-0">
          <div className="flex-1 flex flex-col gap-y-4">
            <textarea
              name="message"
              className="w-full rounded-xl h-40 p-4"
              value={formData.message}
              onChange={(e) => handleChange(e, "message")}
              placeholder={`Respond to ${message.author.profile.firstName}'s message.`}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="rouded-xl bg-yellow-300 font-semibold text-blue-600 w-80 h-12 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            {" "}
            Send Reply
          </button>
        </div>
      </form>
    </Modal>
  );
}
