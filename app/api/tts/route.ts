import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Use server-side API key from environment
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Clean text for TTS (remove markdown, special characters)
    const cleanText = text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[-•]\s/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) {
      return NextResponse.json(
        { error: "No text to convert" },
        { status: 400 }
      );
    }

    // Call OpenAI TTS API
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "tts-1", // Using tts-1 model (faster) - can also use tts-1-hd for higher quality
        input: cleanText,
        voice: "nova", // Female voice - options: nova, shimmer (female), alloy (neutral), echo, fable, onyx (male)
        speed: 1.0, // Normal speed
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Failed to generate speech" } }));
      return NextResponse.json(
        { error: error.error?.message || "Failed to generate speech" },
        { status: response.status }
      );
    }

    // Get the audio blob
    const audioBlob = await response.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();

    // Return the audio as a response
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

