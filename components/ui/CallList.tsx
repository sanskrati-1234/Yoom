"use client";
import Meeting from "@/app/(root)/meeting/[id]/page";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import MeetingCard from "./MeetingCard";
import { useToast } from "./use-toast";
import Loader from "../Loader";

const CallList = ({ type }: { type: "upcoming" | "ended" | "recordings" }) => {
  const { endedCalls, upcomingCalls, isloading, callRecordings } =
    useGetCalls();
  const router = useRouter();

  const { toast } = useToast();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No previous calls";
      case "recordings":
        return "No recordings available";
      case "upcoming":
        return "No upcoming calls";
      default:
        return "";
    }
  };

  const calls = getCalls();
  const noCallMessage = getNoCallsMessage();

  const [fetchRecordingLoader, setFetchRecordingLoader] = useState(false);

  useEffect(() => {
    const fetchRecordings = async () => {
      setFetchRecordingLoader(true);
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch {
        toast({ title: "Try again later" });
      } finally {
        setFetchRecordingLoader(false);
      }
    };
    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (type === "recordings" && fetchRecordingLoader) return <Loader />;

  if (isloading) return <Loader />;
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => {
          return (
            <MeetingCard
              key={(meeting as Call).id}
              icon={
                type === "ended"
                  ? "/icons/previous.svg"
                  : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                "No Description"
              }
              date={
                (meeting as Call).state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording).start_time?.toLocaleString()
              }
              isPreviousMeeting={type === "ended"}
              link={
                type === "recordings"
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                      (meeting as Call).id
                    }`
              }
              buttonIcon1={
                type === "recordings" ? "/icons/play.svg" : undefined
              }
              buttonText={type === "recordings" ? "Play" : "Start"}
              handleClick={
                type === "recordings"
                  ? () => router.push(`${(meeting as CallRecording).url}`)
                  : () => router.push(`/meeting/${(meeting as Call).id}`)
              }
            />
          );
        })
      ) : (
        <h1>{noCallMessage} </h1>
      )}
    </div>
  );
};

export default CallList;
