"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markAllRead } from "@/lib/api/notifications";

export function MarkAllReadButton({ token }: { token: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() =>
        start(async () => {
          await markAllRead(token);
          router.refresh();
        })
      }
      disabled={pending}
    >
      {pending ? "Marking…" : "Mark all read"}
    </button>
  );
}

export default MarkAllReadButton;
