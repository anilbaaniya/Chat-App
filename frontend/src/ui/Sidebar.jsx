import Heading from "../features/Sidebar/Heading";
import MessageList from "../features/Sidebar/MessageList";

export default function Sidebar() {
  return (
    <div className="flex flex-col border-r-2 h-screen border-stone-200">
      <Heading />
      <MessageList />
      <MessageList />
      <MessageList />
    </div>
  );
}
