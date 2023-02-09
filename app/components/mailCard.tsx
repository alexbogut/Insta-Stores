import React from "react";
import { Link } from "@remix-run/react";

interface Props {
  id: string;
  caption: string;
  imageURL: string;
  username: string;
  ownerId: string;
}

export function Mailcard(props: Props) {
  return (
    <Link
      className="flex flex-col justify-center max-h-[380px] max-w-[250px] rounded overflow-hidden shadow-lg text-center bg-gray-400"
      to={`/item/${props.ownerId}/${props.id}`}
    >
      <div className="mx-11 mt-4">
        <img
          className="max-h-56"
          src={props.imageURL}
          alt="Sunset in the mountains"
        />
      </div>

      <div className="px-6 py-4 ">
        <div className="font-bold text-base mb-2">The Coldest Sunset</div>
        <p className="text-white text-sm">{props.caption}</p>
      </div>
    </Link>
  );
}
