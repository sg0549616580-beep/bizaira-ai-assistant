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

const QUALITY_SYSTEM_SUFFIX = `
Output requirements:
- Be specific, detailed, and professional
- Avoid generic filler phrases
- Each response must be immediately actionable and ready to use
- Match the exact tone, language, and context requested
- Never include meta-commentary, disclaimers, or explanations about the output
`;

router.post("/generate-text", async (req, res) => {
  try {
    const { prompt, systemPrompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const openai = getOpenAI();

    const enhancedSystem = systemPrompt
      ? `${systemPrompt}\n\n${QUALITY_SYSTEM_SUFFIX}`
      : `You are an expert AI assistant for small business owners. Provide precise, professional, high-quality output.\n\n${QUALITY_SYSTEM_SUFFIX}`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: enhancedSystem },
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 2000,
      temperature: 0.75,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "";
    res.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Text generation failed";
    res.status(500).json({ error: message });
  }
});

router.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const openai = getOpenAI();

    // Enhance the prompt for maximum quality
    const enhancedPrompt = `${prompt}. Ultra-high quality, professional photography, sharp details, perfect lighting, commercial grade.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid",
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
