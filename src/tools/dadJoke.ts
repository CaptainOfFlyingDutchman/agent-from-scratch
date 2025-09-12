import { z } from 'zod'
import type { ToolFn } from '../../types.ts'

export const dadJokeToolDefinition = {
  name: 'dad_joke',
  description: 'Get a dad joke',
  parameters: z.object({})
}

export type Args = z.infer<typeof dadJokeToolDefinition.parameters>

export const dadJokeTool: ToolFn<Args, string> = async ({ userMessage, toolArgs }) => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json'
    }
  })

  return (await response.json() as any).joke
}
