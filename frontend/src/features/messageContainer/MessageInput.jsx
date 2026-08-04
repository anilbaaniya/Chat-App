import { useRef, useState } from "react";
import { IoAttach, IoSend } from "react-icons/io5";

export default function MessageInput({
  text,
  handleInputChange,
  handleSendMessage,
}) {
  // const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3 rounded-full border border-gray-300 px-4 py-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          // onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer text-gray-500 hover:text-blue-300"
        >
          <IoAttach className="text-xl" />
        </button>

        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none"
        />

        <button
          onClick={handleSendMessage}
          className="cursor-pointer rounded-full bg-indigo-500 p-2 text-white transition hover:bg-indigo-700"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}
