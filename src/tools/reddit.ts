import { z } from 'zod'
import type { ToolFn } from '../../types.ts'

export const redditToolDefinition = {
  name: 'reddit',
  description: 'Get a random reddit post',
  parameters: z.object({})
}

export type Args = z.infer<typeof redditToolDefinition.parameters>

export const redditTool: ToolFn<Args, string> = async ({ userMessage, toolArgs }) => {
  const response = await fetch('https://www.reddit.com/r/nba.json')

  const { data } = (await response.json() as any)

  const relevantInfo = data.children.map((child: any) => {
    return {
      title: child.data.title,
      link: child.data.url,
      subreddit: child.data.subreddit_name_prefixed,
      author: child.data.author,
      upvotes: child.data.ups
    }
  })

  return JSON.stringify(relevantInfo, null, 2)
}
