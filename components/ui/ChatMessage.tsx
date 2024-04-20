import React from "react";
type msgPropType = {
  userId: string | undefined;
  message: string;
  time: string;
};

const ChatMessage = ({ userId, time, message }: msgPropType) => {
  return (
    <div>
      <div className="flex justify-start gap-4 items-center mb-[4px]">
        <div
          className="text-[18px] font-[500] text cursor-pointer"
          title={userId}
        >
          {userId?.slice(0, 16)}...{" "}
        </div>
        <div className="text-[12px] font-[400]">{time}</div>
      </div>
      <div className="text-[13px] font-[400]">{message}</div>
    </div>
  );
};

export default ChatMessage;
