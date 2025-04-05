import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are an AI assistant for ChatDeFi, a DeFi yield aggregator with AI capabilities. 
    Help users understand DeFi concepts, ChatDeFi vaults, and how to maximize their yield. 
    You can provide information about crypto assets, yield strategies, and general DeFi knowledge.
    Be concise, helpful, and accurate.`,
  })

  return result.toDataStreamResponse()
}

