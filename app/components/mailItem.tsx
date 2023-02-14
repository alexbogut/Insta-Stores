import { useState } from "react";

interface Props {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
  recipientId: string;
  product: {
    id: string;
    caption: string;
    imageURL: string;
    username: string;
    ownerID: string;
  };
  author: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  clickHandler: (...args: any) => any;
}

export function Mailitem(props: Props) {
  const date = new Date(props.createdAt);
  const [color, setColor] = useState("");
  return (
    <div
      onClick={() => {
        props.clickHandler(
          props.text,
          props.createdAt,
          props.product,
          props.author.profile,
          props.id
        );
        setColor("bg-blue-300");
      }}
      className={`flex flex-col transition duration-300 ease-in-out ${color} hover:bg-blue-300`}
    >
      <div className="ml-1">Item# {props.product.id}</div>
      <div className="flex justify-between ml-1 mt-2">
        <div>
          {`${props.author.profile.firstName} `}
          {props.author.profile.lastName}
        </div>
        <div className="mr-2">{date.toDateString()}</div>
      </div>
    </div>
  );
}
