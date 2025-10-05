/* eslint-disable @typescript-eslint/no-explicit-any */

import envConfig from "@/config";
import { isBrowser, normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";

const ENTITY_ERROR_STATUS = 422;

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string;
};

export class HttpError extends Error {
  status: number;
  payload: any;

  constructor({
    status,
    payload,
    message = "Lỗi HTTP!",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type EntityErrorPayload = {
  message: string;
  statusCode: number;
  errors: {
    field: string;
    message: string;
  }[];
};

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;

  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
  }) {
    super({
      message: "Lỗi thực thể",
      status,
      payload,
    });
    this.status = status;
    this.payload = payload;
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

  const payload: Response = await res.json();

  const data = {
    status: res.status,
    payload,
  };

  // Xử lý lỗi
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: typeof ENTITY_ERROR_STATUS;
          payload: EntityErrorPayload;
        }
      );
    } else {
      throw new HttpError(data);
    }
  }

  // Xử lý khi thành công
  if (isBrowser) {
    if (normalizePath(path) === "api/auth/login") {
      const { accessToken, refreshToken } = (payload as LoginResType).data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  return data;
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
