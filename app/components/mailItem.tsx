interface Props {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
  recipientId: string;
  clickHandler: (...args: any) => any;
}

export function Mailitem(props: Props) {
  const date = new Date(props.createdAt);

  return (
    <div
      onClick={() => props.clickHandler(props.text)}
      className="flex justify-between transition duration-300 ease-in-out hover:bg-blue-300"
    >
      <div className="flex flex-col ml-1">
        <div>Item Name</div>
        <div>Sender Name</div>
      </div>
      <div className="mt-6 mr-2">{date.toDateString()}</div>
    </div>
  );
}
