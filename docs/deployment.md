# Deployment

## Recommended low-cost setup

- frontend: Vercel
- room server: Cloudflare Workers
- database/auth: Supabase
- voice: LiveKit Cloud

## Production checklist

1. Create Supabase project and apply SQL from `supabase/migrations`
2. Deploy `apps/room-server` with Wrangler
3. Deploy `apps/web` to Vercel
4. Set all values from `infrastructure/env.example`
5. Restrict secrets to server environments only
6. Configure the web app to call the deployed room server URL
7. Add CORS/origin allowlists for production origins

## Notes

- Websocket routing belongs on the room server deployment
- Voice token generation should happen server-side, never in the browser
- Durable Objects should back room instances in production

