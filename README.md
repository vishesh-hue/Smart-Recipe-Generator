## Vision Provider (Gemini free tier preferred)

Set up **Google Gemini API (free tier)**:

1. Go to Google AI Studio → create an API key.
2. Add it to your env as `GEMINI_API_KEY`.
3. (Optional fallback) Keep `HF_TOKEN` set if you want BLIP as backup.

The app will use Gemini first, then fall back to Hugging Face if Gemini fails or is not configured.

Smart Recipe Generator v1.2 — expanded recipe database (~80). Use HF_TOKEN for photo detection.
