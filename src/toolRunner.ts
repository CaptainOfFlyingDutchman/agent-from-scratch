import type { OpenAI } from 'openai'
import { generateImageTool, generateImageToolDefinition } from './tools/generateImage.ts'
import { redditTool, redditToolDefinition } from './tools/reddit.ts'
import { dadJokeTool, dadJokeToolDefinition } from './tools/dadJoke.ts'

export async function runTool(toolCall: OpenAI.ChatCompletionMessageToolCall, userMessage: string) {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}')
  }

  switch (toolCall.function.name) {
    case generateImageToolDefinition.name:
      return generateImageTool(input)
    case redditToolDefinition.name:
      return redditTool(input)
    case dadJokeToolDefinition.name:
      return dadJokeTool(input)
    default:
      return new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}
