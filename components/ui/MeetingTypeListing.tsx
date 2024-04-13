"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Textarea } from "./textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./input";

const MeetingTypeListing = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);
  const { toast } = useToast();
  //const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!user || !client) return;
    try {
      if (!values.dateTime) {
        toast({
          title: "Please select date and time",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create call");
      const startAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      await call.getOrCreate({
        data: {
          starts_at: startAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: "Meeting created",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Cannot schedule meeting",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <>
      <div className="meeting-list-wrapper">
        <HomeCard
          img="/icons/add-meeting.svg"
          title="New Meeting"
          description="Start an instant meeting"
          handleClick={() => setMeetingState("isInstantMeeting")}
          className="bg-orange-1 flex-1"
        />
        <HomeCard
          img="/icons/join-meeting.svg"
          title="Join Meeting"
          description="via invitation link"
          className="bg-blue-1 flex-1"
          handleClick={() => setMeetingState("isJoiningMeeting")}
        />
        <HomeCard
          img="/icons/schedule.svg"
          title="Schedule Meeting"
          description="Plan your meeting"
          className="bg-purple-1 flex-1"
          handleClick={() => setMeetingState("isScheduleMeeting")}
        />
        <HomeCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="Meeting Recordings"
          className="bg-yellow-1 flex-1"
          handleClick={() => router.push("/recordings")}
        />
      </div>
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 ocus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => {
                setValues({ ...values, dateTime: date! });
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d,yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" });
          }}
          buttonText="Copy Meeting link"
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </>
  );
};

export default MeetingTypeListing;
