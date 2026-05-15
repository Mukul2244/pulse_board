import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import type { Analytics } from "@/types";



export function usePollSocket(pollId: string, initialAnalytics: Analytics | null) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [analytics, setAnalytics] = useState<Analytics | null>(initialAnalytics);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!pollId) return;

    function onConnect() {
      setIsConnected(true);
      socket.emit("poll:subscribe", pollId);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // if already connected, emit subscribe immediately
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

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
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("poll:updated");
      socket.off("poll:published");
    };
  }, [pollId]);

  return { isConnected, isPublished, analytics, setAnalytics };
}
