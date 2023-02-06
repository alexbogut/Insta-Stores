import { Link } from "@remix-run/react";

interface Props {
  username: string;
  // onClick: (...args: any) => any;
}

export function SearchItem({ username }: Props) {
  return (
    // <div>
    //   <h2>{username}</h2>

    //   <button onClick={onClick()}>hello</button>
    // </div>
    <div>
      <Link to={`/seller/${username}`}>{username}</Link>
    </div>
  );
}
