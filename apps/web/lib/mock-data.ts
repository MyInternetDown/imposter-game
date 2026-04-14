import {
  createRoomSummary,
  defaultRoomSettings,
  starterPromptPack,
} from "@imposter/shared";
import type { QuestionPack } from "@imposter/types";

export const mockPacks: QuestionPack[] = [
  starterPromptPack,
  {
    id: "pack-movie-night",
    ownerId: "user-demo",
    title: "Movie Night Chaos",
    description: "Loud, silly prompts for friend groups.",
    visibility: "private",
    prompts: [
      { id: "prompt-1", text: "Worst movie title for a first date?", sortOrder: 1 },
      { id: "prompt-2", text: "Pitch the cheapest superhero origin story.", sortOrder: 2 },
    ],
  },
];

export const mockRoom = createRoomSummary({
  code: "FJ7KQ",
  playerCount: 4,
  selectedPackName: starterPromptPack.title,
  settings: defaultRoomSettings,
});

