import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'Http-Referer': 'https://manvendrask.com',
    'X-Title': 'Learning AI'
  }
})

export const runLLM = async ({ userMessage }: { userMessage: string }) => {
  const { choices } = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    temperature: 0.1,
    messages: [{ role: 'user', content: userMessage }]
  })

  return choices[0].message.content
}
