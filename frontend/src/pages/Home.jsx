import Sidebar from "../ui/Sidebar";
import MessageContainer from "../ui/MessageContainer";
export default function Home() {
  return (
    <div className="flex h-screen">
      <aside className="w-[30%] bg-stone-50 ">
        <Sidebar />
      </aside>

      <main className="w-[70%] ">
        <MessageContainer />
      </main>
    </div>
  );
}
