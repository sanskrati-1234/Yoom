import { cn } from "@/lib/utils";
import {
  PaginatedGridLayout,
  SpeakerLayout,
  CallParticipantsList,
  CallControls,
  CallStatsButton,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
type CallLayoutType = "speaker-left" | "speaker-right" | "grid";
const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowparticipants] = useState(false);
  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition={"right"} />;
      default:
        return <SpeakerLayout participantsBarPosition={"left"} />;
    }
  };
  return (
    <section className="relative h-screen w-full  overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn(
            "h-[calc(100vh-86px)]  ml-2 bg-dark-1 px-6 py-6 rounded-2xl",
            {
              hidden: !showParticipants,
            }
          )}
        >
          <CallParticipantsList onClose={() => setShowparticipants(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls />
        <DropdownMenu>
          <div className="flax items-center">
            <DropdownMenuTrigger
              className="cursor-pointer
            rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]
            "
            >
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => {
              return (
                <div key={index}>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setLayout(item.toLowerCase() as CallLayoutType);
                    }}
                  >
                    {item}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                </div>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowparticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default MeetingRoom;
