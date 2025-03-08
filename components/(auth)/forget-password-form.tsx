"use client";

import React, { useState, useEffect } from "react";
import { ZodError } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { emailSchema, passwordSchema } from "@/lib/zod";
import axios, { AxiosError } from "axios";
import formatTime from "@/utils/formatTime";

const ForgetPasswordForm = () => {
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repass, setRepass] = useState("");
  const [otp, setOtp] = useState("");

  const [clickedOTP, setClickedOTP] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    if (stage === 1) {
      try {
        emailSchema.parse(email);
      } catch (error) {
        if (error instanceof ZodError) {
          setError(error.errors[0].message);
          toast({ title: error.errors[0].message, variant: "destructive" });
        }
        setLoading(false);
      }

      try {
        const response = await axios.post("/api/user", { email });
        if (!response.data.success) {
          setError(response.data.message);
          toast({ title: response.data.message, variant: "destructive" });
          setLoading(false);
          return;
        }

        setUser(response.data.user);
        toast({
          title: `${response.data.user.name} ✅. Proceeding to next step`,
        });
        setStage(2);
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data.error || "Error checking user"
            : "Error checking user";
        setError(message);
        toast({ title: message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    } else if (stage === 2) {
      try {
        passwordSchema.parse(password);
      } catch (error) {
        if (error instanceof ZodError) {
          setError(error.errors[0].message);
          toast({ title: error.errors[0].message, variant: "destructive" });
        } else {
          setError("Something went wrong");
          toast({ title: "Something went wrong", variant: "destructive" });
        }
        setLoading(false);
      }

      if (password !== repass) {
        setError("Passwords do not match");
        toast({ title: "Passwords do not match", variant: "destructive" });
        setLoading(false);
        return;
      }
      setLoading(false);
      setStage(3);
    }
  };

  const handleSendOtp = async () => {
    if (timeLeft > 0) return;
    setLoadingOTP(true);
    setError(null);

    try {
      setClickedOTP(true);
      const res = await axios.post("/api/send-otp", { id: user?.id });
      if (!res.data.success) throw new Error(res.data.message);

      setClickedOTP(false);
      setTimeLeft(300); // 5 minutes countdown
      toast({ title: "OTP sent to your email" });
    } catch (error) {
      console.log(error);
      setError("Error sending OTP");
      toast({ title: "Error sending OTP", variant: "destructive" });
    } finally {
      setClickedOTP(false);
      setLoadingOTP(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/password-forget", {
        email,
        password,
        repass,
        otp,
      });

      if (!response.data.success) throw new Error(response.data.message);

      toast({ title: response.data.message });
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (error) {
      console.log(error);
      setError("Error resetting password");
      toast({ title: "Error resetting password", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Forget Password</CardTitle>
      </CardHeader>
      <CardContent>
        {stage === 1 && (
          <>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <Button
              onClick={handleNext}
              className="mt-4 w-full"
              disabled={loading}
            >
              {loading ? "Checking..." : "Next"}
            </Button>
          </>
        )}
        {stage === 2 && (
          <>
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
            <Label>Confirm Password</Label>
            <Input
              value={repass}
              onChange={(e) => setRepass(e.target.value)}
              type="password"
              required
            />
            <Button
              onClick={handleNext}
              className="mt-4 w-full"
              disabled={loading}
            >
              {loading ? "Validating..." : "Next"}
            </Button>
          </>
        )}
        {stage === 3 && (
          <>
            <Label>Check your email for OTP</Label>
            <div className="flex items-center space-x-5">
              <Button
                onClick={handleSendOtp}
                className="w-fit"
                disabled={loadingOTP || timeLeft > 0}
              >
                {clickedOTP && timeLeft === 0
                  ? "Sending..."
                  : loadingOTP || timeLeft > 0
                    ? `${formatTime(timeLeft)}s`
                    : "Send OTP"}
              </Button>
              <InputOTP
                maxLength={4}
                className="w-auto"
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              onClick={handleSubmit}
              className="mt-4 w-full"
              disabled={loading || otp.length !== 4}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </>
        )}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default ForgetPasswordForm;
