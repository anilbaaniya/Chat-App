import Sidebar from "../ui/Sidebar";
import MessageContainer from "../ui/MessageContainer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchConversations } from "../redux/conversation/conversationSlice";

export default function Home() {
  const [conversations, setConversations] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getConversation() {
      const result = await dispatch(fetchConversations());
      // console.log(result);
      setConversations(result.payload.data);
    }
    getConversation();
  }, [dispatch]);

  console.log(conversations);
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
