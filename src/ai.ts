import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'Http-Referer': 'https://manvendrask.com',
    'X-Title': 'Learning AI'
  }
})
