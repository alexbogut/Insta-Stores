import { Modal } from "~/components/modal";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getUserById } from "~/helpers/user.server";
import { requireUserId } from "~/helpers/auth.server";
import { useState } from "react";
import { createMessage } from "~/helpers/message.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { userId, itemId } = params;
  if (typeof userId !== "string") {
    return redirect("/home");
  }
  const recipient = await getUserById(userId);
  return json({ recipient });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const message = form.get("message");
  const recipientId = form.get("recipientId");
  const userId = await requireUserId(request);

  if (typeof message !== "string" || typeof recipientId !== "string") {
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
  await createMessage(message, userId, recipientId);

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
  const { recipient } = useLoaderData();
  return (
    <Modal isOpen={true} className="w-1/2 p-10" userId={recipient.id}>
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
        {formError}
      </div>
      <form method="POST">
        <input type="hidden" value={recipient.id} name="recipientId" />
        <div className="text-center flex flex-col md:flex-row gap-y-2 md:gap-y-0">
          <div className="flex-1 flex flex-col gap-y-4">
            <textarea
              name="message"
              className="w-full rounded-xl h-40 p-4"
              value={formData.message}
              onChange={(e) => handleChange(e, "message")}
              placeholder={`Let ${recipient.profile.firstName} know you're interested!`}
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
