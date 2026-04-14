import { beforeEach, describe, expect, it } from "vitest";
import { createApp, resetRoomStore } from "../src/index";
import type {
  CreateRoomResponse,
  GetRoomResponse,
  JoinRoomResponse,
  RoomActionResponse,
  RoomErrorResponse,
} from "@imposter/types";

describe("room api", () => {
  beforeEach(() => {
    resetRoomStore();
  });

  it("creates, joins, fetches, and starts a room", async () => {
    const app = createApp();

    const createResponse = await app.request("/rooms", {
      method: "POST",
      body: JSON.stringify({ hostName: "Alex" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as CreateRoomResponse;

    const joinResponse = await app.request(`/rooms/${created.room.code}/join`, {
      method: "POST",
      body: JSON.stringify({ displayName: "Mina" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(joinResponse.status).toBe(201);

    const fetchResponse = await app.request(`/rooms/${created.room.code}`, {
      headers: { Authorization: `Bearer ${created.viewer.token}` },
    });
    expect(fetchResponse.status).toBe(200);
    const fetched = (await fetchResponse.json()) as GetRoomResponse;
    expect(fetched.room.players).toHaveLength(2);

    const startResponse = await app.request(`/rooms/${created.room.code}/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${created.viewer.token}` },
    });
    expect(startResponse.status).toBe(200);
    const started = (await startResponse.json()) as RoomActionResponse;
    expect(started.room.phase).toBe("answering");
    expect(started.room.activeRound?.promptText).toBeTruthy();
  });

  it("rejects non-host start attempts", async () => {
    const app = createApp();
    const createResponse = await app.request("/rooms", {
      method: "POST",
      body: JSON.stringify({ hostName: "Alex" }),
      headers: { "Content-Type": "application/json" },
    });
    const created = (await createResponse.json()) as CreateRoomResponse;

    const joinResponse = await app.request(`/rooms/${created.room.code}/join`, {
      method: "POST",
      body: JSON.stringify({ displayName: "Mina" }),
      headers: { "Content-Type": "application/json" },
    });
    const joined = (await joinResponse.json()) as JoinRoomResponse;

    const startResponse = await app.request(`/rooms/${created.room.code}/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${joined.viewer.token}` },
    });
    expect(startResponse.status).toBe(403);
    const payload = (await startResponse.json()) as RoomErrorResponse;
    expect(payload.error.code).toBe("HOST_ONLY");
  });

  it("rejects joins when the room is locked", async () => {
    const app = createApp();
    const createResponse = await app.request("/rooms", {
      method: "POST",
      body: JSON.stringify({ hostName: "Alex", settings: { roomLocked: true } }),
      headers: { "Content-Type": "application/json" },
    });
    const created = (await createResponse.json()) as CreateRoomResponse;

    const joinResponse = await app.request(`/rooms/${created.room.code}/join`, {
      method: "POST",
      body: JSON.stringify({ displayName: "Mina" }),
      headers: { "Content-Type": "application/json" },
    });

    expect(joinResponse.status).toBe(403);
    const payload = (await joinResponse.json()) as RoomErrorResponse;
    expect(payload.error.code).toBe("ROOM_LOCKED");
  });

  it("returns 404 for missing rooms", async () => {
    const app = createApp();
    const response = await app.request("/rooms/NOPE1");

    expect(response.status).toBe(404);
    const payload = (await response.json()) as RoomErrorResponse;
    expect(payload.error.code).toBe("ROOM_NOT_FOUND");
  });
});
