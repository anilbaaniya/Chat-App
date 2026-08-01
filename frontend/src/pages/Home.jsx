import Sidebar from "../ui/Sidebar";
import MessageContainer from "../ui/MessageContainer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../redux/conversation/conversationSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { conversations } = useSelector((state) => state.conversation);

  useEffect(() => {
    async function getConversation() {
      dispatch(fetchConversations());
    }
    getConversation();
  }, [dispatch]);

  // console.log(conversations);
  return (
    <div className="flex h-screen">
      <aside className="w-[30%] bg-stone-50 ">
        <Sidebar conversations={conversations} />
      </aside>

      <main className="w-[70%] ">
        <MessageContainer />
      </main>
    </div>
  );
}
