import type { OpenAI } from 'openai'

function getWeather(input: any) {
  return `hot, 90deg celsius`
}

export async function runTool(toolCall: OpenAI.ChatCompletionMessageToolCall, userMessage: string) {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}')
  }

  switch (toolCall.function.name) {
    case 'get_weather':
      return getWeather(input)
    default:
      return new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}
