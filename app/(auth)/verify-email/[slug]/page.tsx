"use client";

import axios, { AxiosError } from "axios";
import React, { useState, useEffect } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const { slug } = React.use(params);
  // const { slug } = params;

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post("/api/verify-email", {
          token: slug,
        });
        setResult(res.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setResult({ success: false, message: error.response?.data.error });
          console.log(error);
        } else {
          setResult({ success: false, message: "Something went wrong" });
        }
      }
    };

    if (slug) {
      verifyEmail();
    }
  }, [slug]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {result
          ? result.message
            ? result.message
            : "Something went wrong try again"
          : "Verification in progress..."}
      </div>
    </div>
  );
}
