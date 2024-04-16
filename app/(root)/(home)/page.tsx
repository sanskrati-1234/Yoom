"use client";
import MeetingTypeListing from "@/components/ui/MeetingTypeListing";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const { upcomingCalls } = useGetCalls();
  console.log(upcomingCalls, "upcoming");

  const [upcomingTime, setUpcomingTime] = useState<string>("");
  useEffect(() => {
    if (!upcomingCalls[upcomingCalls.length - 1]) return;
    setUpcomingTime(
      (
        upcomingCalls[upcomingCalls.length - 1] as Call
      ).state?.startsAt?.toLocaleString() ||
        (
          upcomingCalls[upcomingCalls.length - 1] as unknown as CallRecording
        ).start_time?.toLocaleString()
    );
  }, [upcomingCalls]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateTime = () => {
      const now = new Date();
      const newTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const newDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
      }).format(now);
      setTime(newTime);
      setDate(newDate);
    };

    // Update time immediately and then every second
    updateTime();
    intervalId = setInterval(updateTime, 1000);

    return () => {
      clearInterval(intervalId); // Cleanup the interval on component unmount
    };
  }, []);

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[370px] rounded py-2 text-center text-base font-normal">
            Upcoming meeting : {upcomingTime}
          </h2>
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-extrabold lg:text-7xl ">{time}</h2>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">
              {" "}
              {date}
            </p>
          </div>
        </div>
      </div>
      <MeetingTypeListing />
    </section>
  );
}
