import { useState, useEffect } from "react";
import { useActionData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { FormField } from "~/components/form-field";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/helpers/validators.server";
import { login, register, getUser } from "~/helpers/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );

  switch (action) {
    case "login": {
      return await login({ email, password });
    }
    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
};

export default function Login() {
  const [action, setAction] = useState("login");
  const actionData = useActionData();
  useEffect(() => {
    if (actionData) {
      setAction(actionData?.form);
    }
  }, [actionData]);

  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formError, setFormError] = useState(actionData?.error || "");
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.lastName || "",
    lastName: actionData?.fields?.firstName || "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col">
        <button
          onClick={() =>
            setAction(action == "login" || action === "" ? "register" : "login")
          }
          className="absolute top-8 right-8 bg-amber-600 font-semibold  px-3 py-2 transition duration-300 ease-in-out hover:bg-orange-400 hover:-translate-y-1"
        >
          {action === "login" || action === "" ? "Sign Up" : "Sign In"}
        </button>
        <h2 className="text-[90px] font-title mb-11">
          Welcome to Insta Stores
        </h2>
        <p className="text-[28px] font-semibold">
          {action === "login" || action === ""
            ? "Log In To Begin Browsing!"
            : "Sign Up To Get Started!"}
        </p>

        <form
          method="POST"
          className=" bg-zinc-900 p-6 w-[450px] opacity-50 mt-2"
        >
          <div className="text-sm font-bold text-center tracking-wide text-orange-500 w-full">
            {formError}
          </div>
          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
            error={errors?.email}
          />
          <FormField
            htmlFor="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            error={errors?.password}
          />
          {action === "register" && (
            <>
              <FormField
                htmlFor="firstName"
                label="First Name"
                onChange={(e) => handleInputChange(e, "firstName")}
                value={formData.firstName}
                error={errors?.firstName}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                onChange={(e) => handleInputChange(e, "lastName")}
                value={formData.lastName}
                error={errors?.lastName}
              />
            </>
          )}
          <div className="w-full text-center">
            <button
              type="submit"
              name="_action"
              value={action}
              className=" mt-2 bg-amber-800 px-3 py-2  font-semibold transition duration-300 ease-in-out hover:bg-orange-500 hover:-translate-y-1 hover:opacity-100"
            >
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
