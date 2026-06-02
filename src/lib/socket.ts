"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth/session";
import { io, type Socket } from "socket.io-client";
import { env } from "@/lib/env";

type Handler = (payload: unknown) => void;

/**
 * Single shared socket per browser tab, authenticated with the user's JWT.
 * Re-uses one connection across all components; subscribers register an
 * event handler and the hook unbinds it on unmount.
 */
let sharedSocket: Socket | null = null;
let sharedToken: string | null = null;

function ensureSocket(token: string): Socket {
  if (sharedSocket && sharedToken === token) return sharedSocket;
  if (sharedSocket) {
    sharedSocket.disconnect();
    sharedSocket = null;
  }
  const base = env.publicBackendApiUrl.replace(/\/$/, "");
  sharedSocket = io(base, {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
  });
  sharedToken = token;
  return sharedSocket;
}

export function useSocketEvent(event: string, handler: Handler): void {
  const { data: session } = useSession();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const token = session?.user?.token;
    if (!token) return;
    const socket = ensureSocket(token);
    const wrapped = (payload: unknown) => handlerRef.current(payload);
    socket.on(event, wrapped);
    return () => {
      socket.off(event, wrapped);
    };
  }, [event, session]);
}

export function getSharedSocket(): Socket | null {
  return sharedSocket;
}
