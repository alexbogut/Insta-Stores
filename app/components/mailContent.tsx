interface Props {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
  recipientId: string;
}

export function Mailcontent(props: Props) {
  const date = new Date(props.createdAt);
  return (
    <div className="bg-slate-50 flex-initial w-full flex flex-col">
      <div className="h-20 bg-slate-200 flex justify-between">
        <div className="flex flex-col justify-between ml-4">
          <div className="mt-2 text-xl">Item Name</div>
          <div className="mb-2 font-light">Sender Name</div>
        </div>
        <div className="flex flex-col justify-between mr-4">
          <div className="mt-2">Delete</div>
          <div className="mb-2 font-light">{date.toDateString()}</div>
        </div>
      </div>
      <div className="p-7 flex justify-between">
        <div>{props.text}</div>
      </div>
    </div>
  );
}
