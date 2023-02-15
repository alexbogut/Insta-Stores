import { SearchItem } from "~/components/searchItem";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import { searchStores } from "~/helpers/instaAuth.server";
import { getUser } from "~/helpers/auth.server";
// import type { User, Profile } from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? null : redirect("/login");
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const query = form.get("query");
  if (typeof query !== "string") {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }
  const search = await searchStores(query);
  console.log(search);
  return search;
};

export default function Home() {
  const actionData = useActionData();
  const [formData, setFormData] = useState({
    query: "",
  });
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex-initial w-100 ml-5 mt-4">
          <form action="/logout" method="POST">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Logout
            </button>
          </form>
        </div>
        <div className="flex-initial w-100 mr-5 mt-4">
          <Link to="/inbox">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-5">
              My Inbox
            </button>
          </Link>
          <Link to="/store">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              My Store
            </button>
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        <h2 className="text-xl font-semibold">
          Search for other Insta users store's or click Search to explore.
        </h2>
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-1/2">
          <form method="POST">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="query"
                id="default-search"
                name="query"
                value={formData.query}
                onChange={(e) => handleInputChange(e, "query")}
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Users, Stores..."
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {!actionData ? null : (
        <div className="flex justify-center mt-10">
          <div className="flex-initial">
            <h2 className="text-xl font-semibold ">Search Results ...</h2>
            <br />
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center">
        {!actionData
          ? null
          : actionData.map((store: any) => (
              <SearchItem key={store.id} {...store} />
            ))}
      </div>
    </>
  );
}
