import type { AIMessage } from '../types.ts'
import { zodFunction } from 'openai/helpers/zod'
import { openai } from './ai.ts'

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
