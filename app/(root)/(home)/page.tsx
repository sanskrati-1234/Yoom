"use client";
import MeetingTypeListing from "@/components/ui/MeetingTypeListing";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

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
          <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
            Upcoming meeting :12:12
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl ">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeListing />
    </section>
  );
}
