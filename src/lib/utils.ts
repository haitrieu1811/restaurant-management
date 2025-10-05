/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx";
import jsonwebtoken, { DecodeOptions } from "jsonwebtoken";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { TokenPayload } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import { EntityError } from "@/lib/http";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const jwtDecoded = (
  token: string,
  options?: DecodeOptions & { complete: true }
) => {
  const decoded = jsonwebtoken.decode(
    token,
    options
  ) as unknown as TokenPayload;
  return decoded;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

export const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLS = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLS = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;
