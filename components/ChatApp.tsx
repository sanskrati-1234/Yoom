import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useSearch } from "@stream-io/video-react-sdk/dist/src/components/Search/hooks";
import { X } from "lucide-react";
import ChatMessage from "./ui/ChatMessage";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type data = {
  userId: string | undefined;
  meetingId: string;
  message: string;
  time: string;
};
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

  const send = async () => {
    const sendData: data = {
      userId: userMail,
      meetingId: id,
      message: message,
      time: getCurrentTime(),
    };
    setMessageList([...messageList, sendData]);
  };
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
        <Input
          className="text-black w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div onClick={send}>send</div>
      </div>
    </section>
  );
};

export default ChatApp;
