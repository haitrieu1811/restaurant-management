import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsonwebtoken, { DecodeOptions } from "jsonwebtoken";
import { TokenPayload } from "@/constants/type";

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
