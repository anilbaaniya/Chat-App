import Heading from "../features/Sidebar/Heading";
import MessageList from "../features/Sidebar/MessageList";

export default function Sidebar({ conversations }) {
  console.log(conversations);

  // console.log(conversations);
  return (
    <div className="flex flex-col border-r-2 h-screen border-stone-200">
      <Heading />

      {!conversations || conversations.length === 0 ? (
        <div className="p-4 text-gray-500">No conversations yet</div>
      ) : (
        conversations.map((conversation) => (
          <MessageList key={conversation._id} conversation={conversation} />
        ))
      )}
    </div>
  );
}
