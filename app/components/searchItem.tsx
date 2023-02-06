import { Link } from "@remix-run/react";

interface Props {
  username: string;
  id: string;
  // onClick: (...args: any) => any;
}

export function SearchItem({ id, username }: Props) {
  return (
    // <div>
    //   <h2>{username}</h2>

    //   <button onClick={onClick()}>hello</button>
    // </div>
    <div className="bm-10">
      <Link className="text-xl font-semibold" to={`/seller/${id}`}>
        <button
          type="button"
          className="w-full inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-normal uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
        >
          {username}
        </button>
      </Link>
    </div>
  );
}
