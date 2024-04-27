import { useState } from "react";
import send from "../../assets/images/battleship/send.jpg";
import DOMPurify from "isomorphic-dompurify";
import { toast } from "react-hot-toast";

function MessageBox({ sendMessage }) {
  const [message, setMessage] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    const clean = DOMPurify.sanitize(message);
    sendMessage(clean);
    setMessage("");
    toast.success("Message delivered!");
  };

  return (
    <div className="absolute z-[100000] bottom-5 right-5 rounded-2xl bg-white outline p-2 flex flex-col">
      <p className="py-4 px-6 flex flex-row items-center gap-3">
        Message Panel <div className="h-3 w-3 bg-red-600 rounded-full"></div>
        <div className="h-3 w-3 bg-green-600 rounded-full"></div>
      </p>
      <form className="flex flex-row items-center" onSubmit={handleSubmit}>
        <input
          className="p-3 rounded-md outline outline-black outline-1 focus:outline-2 resize-none"
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button disabled={message === ""} type="submit">
          <img src={send} alt="send" className="h-12 w-12 m-2" />
        </button>
      </form>
    </div>
  );
}

export default MessageBox;
