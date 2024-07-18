"use client";

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
      <p>
        ページを再読み込みしてください。
        <br />
        このエラーが続く場合は、お問い合わせください。
      </p>
    </div>
  );
}
