/* eslint-disable @typescript-eslint/no-explicit-any */

import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string;
};

class HttpError extends Error {
  status: number;
  data: any;

  constructor({
    status,
    data,
    message = "Lỗi HTTP!",
  }: {
    status: number;
    data: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const request = async <Response>(
  path: string,
  method: "GET" | "PUT" | "POST" | "DELETE",
  options?: CustomOptions
) => {
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_URL
      : options.baseUrl;
  const fullUrl = `${baseUrl}/${normalizePath(path)}`;

  const baseHeaders: {
    [k: string]: string;
  } =
    options?.body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  const body = options?.body ? JSON.stringify(options.body) : undefined;

  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
  });

  const data: Response = await res.json();

  const payload = {
    status: res.status,
    data,
  };

  // Xử lý lỗi
  if (!res.ok) {
    throw new HttpError(payload);
  }

  return payload;
  // Xử lý khi response thành công
};

const http = {
  get<Response>(path: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>(path, "GET", options);
  },

  post<Response>(
    path: string,
    body: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>(path, "POST", {
      ...options,
      body,
    });
  },

  put<Response>(
    path: string,
    body: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>(path, "PUT", {
      ...options,
      body,
    });
  },

  delete<Response>(
    path: string,
    body: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>(path, "DELETE", {
      ...options,
      body,
    });
  },
};

export default http;
