import { Router } from "express";
import OpenAI from "openai";

const router = Router();

function getOpenAI(): OpenAI {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "dummy";
  if (baseURL) {
    return new OpenAI({ apiKey, baseURL });
  }
  const directKey = process.env.OPENAI_API_KEY;
  if (directKey) {
    return new OpenAI({ apiKey: directKey });
  }
  throw new Error("No OpenAI credentials configured");
}

router.post("/generate-text", async (req, res) => {
  try {
    const { prompt, systemPrompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const openai = getOpenAI();
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 1500,
    });

    const text = completion.choices[0]?.message?.content || "";
    res.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Text generation failed";
    res.status(500).json({ error: message });
  }
});

router.post("/generate-image", async (req, res) => {
  try {
    const { prompt, editImage } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const openai = getOpenAI();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      res.status(500).json({ error: "No image URL returned" });
      return;
    }

    res.json({ imageUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Image generation failed";
    res.status(500).json({ error: message });
  }
});

export default router;
