import { env } from "./env";
import type {
  CreateRoomRequest,
  CreateRoomResponse,
  GetRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  ReadyRoomRequest,
  RoomActionResponse,
  RoomErrorResponse,
} from "@imposter/types";

export class RoomApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const response = await fetch(`${env.roomServerUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.token ? { Authorization: `Bearer ${init.token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as RoomErrorResponse | null;
    throw new RoomApiError(
      payload?.error.code ?? "UNKNOWN",
      payload?.error.message ?? "Request failed.",
    );
  }

  return (await response.json()) as T;
}

export function createRoom(input: CreateRoomRequest) {
  return request<CreateRoomResponse>("/rooms", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function joinRoom(code: string, input: JoinRoomRequest) {
  return request<JoinRoomResponse>(`/rooms/${code}/join`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getRoom(code: string, token?: string) {
  return request<GetRoomResponse>(`/rooms/${code}`, {
    token,
  });
}

export function startRoom(code: string, token: string) {
  return request<RoomActionResponse>(`/rooms/${code}/start`, {
    method: "POST",
    token,
  });
}

export function setRoomReady(code: string, token: string, input: ReadyRoomRequest) {
  return request<RoomActionResponse>(`/rooms/${code}/ready`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}
