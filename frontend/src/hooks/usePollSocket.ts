import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import type { Analytics } from "@/types";



export function usePollSocket(pollId: string, initialAnalytics: Analytics) {
  const [analytics, setAnalytics] = useState<Analytics>(initialAnalytics);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!pollId) return;

    socket.emit("poll:subscribe", pollId);

    // new response submitted → update analytics
    socket.on("poll:updated", (data: Analytics) => {
      setAnalytics(data);
    });

    // creator published poll
    socket.on("poll:published", () => {
      setIsPublished(true);
    });

    return () => {
      socket.emit("poll:unsubscribe", pollId);
      socket.off("poll:updated");
      socket.off("poll:published");
    };
  }, [pollId]);

  return { analytics, isPublished };
}