import { addMessages, getMessages } from './memory.ts'
import { showLoader } from './ui.ts'
import { runLLM } from './llm.ts'

export async function runAgent({ userMessage, tools }: { userMessage: string, tools: any[] }) {
  await addMessages([{ role: 'user', content: userMessage }])

  const loader = showLoader('Running agent...\n')

  const history = await getMessages()

  const response = await runLLM({ messages: history, tools })

  if (response.tool_calls) {
    console.log('Tool calls:', response.tool_calls)
  }
  
  await addMessages([response])
  loader.stop()

  return getMessages()
}
