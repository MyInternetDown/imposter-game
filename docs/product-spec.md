# Product Spec

## Goal

Build a low-cost multiplayer party game platform with:

- guest join flow
- registered host accounts
- private room codes
- prompt pack creation
- live synchronized gameplay
- text chat
- microphone voice support

## MVP game mode

The first mode is a simultaneous-answer party round:

1. Host selects a prompt pack and reveal style.
2. All players receive the same prompt.
3. Everyone submits one answer.
4. Answers lock when the timer expires or host advances.
5. Answers reveal either all at once or one by one.
6. Players vote for a favorite answer except their own.
7. Scores update and the next round begins.

## User roles

- Guest: join, chat, play, use voice, temporary session only
- Registered: sign in, create rooms, manage question packs, host games

## MVP non-goals

- public matchmaking
- payments
- native apps
- many game modes
- full video UI

