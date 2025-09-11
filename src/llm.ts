import { OpenAI } from 'openai'
import type { AIMessage } from '../types.ts'
import { zodFunction } from 'openai/helpers/zod'

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'Http-Referer': 'https://manvendrask.com',
    'X-Title': 'Learning AI'
  }
})

export const runLLM = async ({ messages, tools }: { messages: AIMessage[], tools: any[] }) => {
  const formattedTools = tools.map(zodFunction)

  const response = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    temperature: 0.1,
    messages,
    tools: formattedTools,
    tool_choice: 'auto',
    parallel_tool_calls: false
  })

  return response.choices[0].message
}
