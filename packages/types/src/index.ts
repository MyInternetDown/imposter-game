export type RoomCode = string;

export type RevealStyle = "all_at_once" | "one_by_one";
export type RoomStatus = "lobby" | "in_game" | "finished";
export type VoiceProvider = "daily" | "livekit" | "disabled";
export type PlayerRole = "host" | "player";
export type PlayerConnectionStatus = "connected" | "reconnecting" | "disconnected";
export type GamePhase =
  | "lobby"
  | "prompt"
  | "answering"
  | "revealing"
  | "voting"
  | "results"
  | "ended";

export interface RoomSettings {
  maxPlayers: number;
  roundCount: number;
  answerDurationSeconds: number;
  revealStyle: RevealStyle;
  allowChat: boolean;
  allowVoice: boolean;
  roomLocked: boolean;
}

export interface PlayerState {
  id: string;
  displayName: string;
  ready: boolean;
  score: number;
  connectionStatus: PlayerConnectionStatus;
  role: PlayerRole;
}

export interface RoomViewer {
  playerId: string;
  token: string;
  isHost: boolean;
}

export interface PromptItem {
  id: string;
  text: string;
  sortOrder: number;
}

export interface QuestionPack {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  visibility: "private" | "unlisted";
  prompts: PromptItem[];
}

export interface RoundSubmission {
  playerId: string;
  answer: string;
}

export interface RoundVote {
  voterId: string;
  targetPlayerId: string;
}

export interface ActiveRoundState {
  roundNumber: number;
  promptId: string;
  promptText: string;
  submissions: RoundSubmission[];
  votes: RoundVote[];
  revealCursor: number;
}

export interface RoomState {
  code: RoomCode;
  createdAt: string;
  updatedAt: string;
  phase: GamePhase;
  players: PlayerState[];
  settings: RoomSettings;
  activeRound: ActiveRoundState | null;
}

export interface RoomSummary {
  code: RoomCode;
  status: RoomStatus;
  playerCount: number;
  selectedPackName: string | null;
  settings: RoomSettings;
}

export interface CreateRoomRequest {
  hostName: string;
  settings?: Partial<RoomSettings>;
}

export interface JoinRoomRequest {
  displayName: string;
}

export interface ReadyRoomRequest {
  ready: boolean;
}

export interface RoomActionResponse {
  room: RoomState;
  summary: RoomSummary;
  viewer?: RoomViewer;
}

export interface CreateRoomResponse extends RoomActionResponse {
  viewer: RoomViewer;
}

export interface JoinRoomResponse extends RoomActionResponse {
  viewer: RoomViewer;
}

export interface GetRoomResponse extends RoomActionResponse {}

export type RoomErrorCode =
  | "ROOM_NOT_FOUND"
  | "ROOM_LOCKED"
  | "ROOM_FULL"
  | "DUPLICATE_DISPLAY_NAME"
  | "UNAUTHORIZED"
  | "HOST_ONLY"
  | "INVALID_PHASE"
  | "NOT_ENOUGH_PLAYERS"
  | "INVALID_INPUT";

export interface RoomErrorResponse {
  error: {
    code: RoomErrorCode;
    message: string;
  };
}

export interface RoomEventMap {
  room_state: { room: RoomState };
  room_joined: { room: RoomState; playerId: string };
  player_joined: { roomCode: RoomCode; player: PlayerState };
  player_left: { roomCode: RoomCode; playerId: string };
  player_ready_changed: { roomCode: RoomCode; playerId: string; ready: boolean };
  game_started: { roomCode: RoomCode; round: ActiveRoundState };
  answer_submitted: { roomCode: RoomCode; playerId: string };
  reveal_state_changed: { roomCode: RoomCode; revealCursor: number };
  scores_updated: { roomCode: RoomCode; players: PlayerState[] };
  room_error: { message: string };
}
