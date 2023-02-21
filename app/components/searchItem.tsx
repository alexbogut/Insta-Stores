import { Link } from "@remix-run/react";

interface Props {
  username: string;
  id: string;
  // onClick: (...args: any) => any;
}

export function SearchItem({ id, username }: Props) {
  return (
    <div className="bm-10 mb-3">
      <Link
        className="text-xl text-blue-600 font-semibold"
        to={`/seller/${id}`}
      >
        <h2>{username}</h2>
      </Link>
      <hr />
    </div>
  );
}
