import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useSearch } from "@stream-io/video-react-sdk/dist/src/components/Search/hooks";
import { SendHorizontal, X } from "lucide-react";
import ChatMessage from "./ui/ChatMessage";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import * as io from "socket.io-client";

type data = {
  userId: string | undefined;
  meetingId: string;
  message: string;
  time: string;
};
const apibase = "http://13.233.161.21:8000";

const socket = io.connect(apibase);
const ChatApp = ({ closeChatApp }: { closeChatApp: () => void }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<data[]>([]);

  //   meeting id
  const { id }: { id: string } = useParams();

  //   user mail
  const { user } = useUser();
  const userMail = user?.emailAddresses[0].emailAddress;

  //   to get current  time
  const getCurrentTime = () => {
    const now = new Date();
    const newTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return newTime;
  };

  //function to send message
  const send = async () => {
    const sendData: data = {
      userId: userMail,
      meetingId: id,
      message: message,
      time: getCurrentTime(),
    };

    await axios
      .post(`${apibase}/chat`, sendData)
      .then(() => {
        socket.emit("send_message", { message: "Hello from client" });
      })
      .then(() => setMessageList([...messageList, sendData]));
  };

  useEffect(() => {
    socket.on("receive_message", () => {
      console.log("useEffect");
      axios
        // @ts-ignore
        .get(`${apibase}/chat/${id}`)
        .then((response) =>
          setMessageList((prev) => [...prev, ...response.data])
        );
    });
  }, [socket]);

  console.log("lkewmew72");
  return (
    <section className="size-full relative">
      <div
        onClick={closeChatApp}
        className="flex justify-end w-full cursor-pointer"
      >
        <X />
      </div>
      {/* messages */}
      <div className="flex w-full py-[20px] justify-end  flex-col h-[calc(100%-60px)]">
        <div className="w-full h-full overflow-y-auto">
          {messageList.map((item, i) => (
            <div key={i} className="mb-3">
              <ChatMessage
                userId={item.userId}
                time={item.time}
                message={item.message}
              />
            </div>
          ))}
        </div>
      </div>
      {/* input */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="relative">
          <div
            className="absolute top-[50%] right-[12px] translate-y-[-50%]"
            onClick={send}
          >
            <SendHorizontal color="#000000" />
          </div>
          <Input
            className="text-black w-full pr-[40px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div onClick={send}>send</div>
      </div>
    </section>
  );
};

export default ChatApp;
