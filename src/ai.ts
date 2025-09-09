import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'
import dotenv from 'dotenv'

dotenv.config()

const openRouter = createOpenRouter({
  apiKey: process.env.AI_KEY,
})

export async function runLLM(userMessage: string) {
  const { text } = await generateText({
    model: openRouter.chat('openai/gpt-4o-mini'),
    temperature: 0.1,
    messages: [{ role: 'user', content: userMessage }],
  })

  return text
}
