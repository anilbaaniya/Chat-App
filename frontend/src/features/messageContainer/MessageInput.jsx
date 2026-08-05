import { useRef } from "react";
import { IoAttach, IoSend, IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { CircularProgress } from "react-loader-spinner";

export default function MessageInput({
  text,
  handleInputChange,
  handleSendMessage,
  handleFileChange,
  selectedFile,
  setSelectedFile,
  sending,
}) {
  const fileInputRef = useRef(null);
  // console.log(selectedFile);

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      {/* Image Preview */}
      {selectedFile && (
        <div className="mb-3 relative inline-block">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="h-24 w-24 rounded-lg border object-cover"
          />

          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <IoClose size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-3 rounded-full border border-gray-300 px-4 py-2">
        <input
          ref={fileInputRef}
          type="file"
          // accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer text-gray-500 transition hover:text-indigo-500"
        >
          <IoAttach className="text-xl" />
        </button>

        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
          className="flex-1 bg-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />

        <button
          type="button"
          onClick={handleSendMessage}
          className="cursor-pointer rounded-full bg-indigo-500 p-2 text-white transition hover:bg-indigo-700"
        >
          {!sending ? (
            <IoSend />
          ) : (
            <CircularProgress
              height="20"
              width="20"
              color="#fff"
              ariaLabel="circular-progress-loading"
              wrapperStyle={{}}
              wrapperClass="wrapper-class"
              visible={true}
              strokeWidth={2}
              animationDuration={1}
            />
          )}
        </button>
      </div>
    </div>
  );
}
