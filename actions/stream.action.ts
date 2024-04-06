'use server'

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret= process.env.STREAM_SECRET_KEY;

export const tokenProvider = async ()=>{
    const user = await currentUser();
    if (!user) throw new Error("User is not authenticated");
    if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
    if (!apiSecret) throw new Error("Stream API secret is missing");

    const client = new StreamClient (STREAM_API_KEY,apiSecret);
}