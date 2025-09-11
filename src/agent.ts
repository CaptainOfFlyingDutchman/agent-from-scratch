import { addMessages, getMessages, saveToolResponse } from './memory.ts'
import { logMessage, showLoader } from './ui.ts'
import { runLLM } from './llm.ts'
import { runTool } from './toolRunner.ts'

export async function runAgent({ userMessage, tools }: { userMessage: string, tools: any[] }) {
  await addMessages([{ role: 'user', content: userMessage }])

  const loader = showLoader('Running agent...\n')

  while (true) {
    const history = await getMessages()

    const response = await runLLM({ messages: history, tools })
    await addMessages([response])

    logMessage(response)
    if (response.content) {
      loader.stop()
      return
    }

    if (response.tool_calls) {
      const tool = response.tool_calls[0]

      loader.update(`Running tool: ${tool.function.name}\n`)
      const toolResponse = await runTool(tool, userMessage)

      if (typeof toolResponse === 'string') {
        await saveToolResponse(tool.id, toolResponse)
      }

      loader.update(`Tool done: ${tool.function.name}\n`)
    }
  }
}
