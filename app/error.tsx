"use client"; // Error components must be Client Components

import { logger } from "@/utils/logger";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    error.digest && logger({ severity: "ERROR", message: error.message, payload: { digest: error.digest } });
  }, [error]);

  return (
    <div>
      <h2>エラーが発生しました。</h2>
      <button
        style={{
          padding: "4px",
          margin: "2px",
          cursor: "pointer",
          backgroundColor: "#FF5850",
          color: "white",
          borderRadius: "4px"
        }}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        再読み込み
      </button>
    </div>
  );
}
