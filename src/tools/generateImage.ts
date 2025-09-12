import { z } from 'zod'
import type { ToolFn } from '../../types.ts'
import { openai } from '../ai.ts'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'node:path'
import * as fs from 'node:fs'

export const generateImageToolDefinition = {
  name: 'generate_image',
  description: 'Generate an image',
  parameters: z.object({
    prompt: z.string().describe('prompt for the image. Be sure to consider the user\'s original message when making the prompt. If you are unsure, then ask the user to provide more details.')
  })
}

export type Args = z.infer<typeof generateImageToolDefinition.parameters>

export const generateImageTool: ToolFn<Args, string> = async ({ userMessage, toolArgs }) => {
  const response = await openai.chat.completions.create({
    model: 'google/gemini-2.5-flash-image-preview',  // use the image-capable model
    messages: [
      {
        role: 'user',
        content: `Generate an image of this prompt ${toolArgs.prompt} with a size of 4K resolution if possible`
      }
    ],
    // @ts-ignore
    modalities: ['image', 'text']
  })

  const msg = response.choices[0].message as any


  if (!msg.images || msg.images.length === 0) {
    throw new Error('No image returned from the model')
  }

  const img = msg.images[0].image_url.url

  const base64Data = img.replace(/^data:image\/\w+;base64,/, '')

  const buffer = Buffer.from(base64Data, 'base64')

  const fileName = `${uuidv4()}.png`
  const filePath = path.join(process.cwd(), 'generated_images', fileName)

  fs.mkdirSync(path.dirname(filePath), { recursive: true })

  fs.writeFileSync(filePath, buffer)

  return filePath

  // const assistantMessage = response.choices[0].message as any
  // console.log('assistantMessage', assistantMessage)
  //
  // if (assistantMessage.images && assistantMessage.images.length > 0) {
  //   // return the URL or base64 of the first image
  //   const img = assistantMessage.images[0]
  //   // it might be `img.image_url.url` or `img.b64_json` depending on the response format
  //   if (img.image_url && img.image_url.url) {
  //     return img.image_url.url
  //   } else if ((img as any).b64_json) {
  //     return (img as any).b64_json
  //   } else {
  //     throw new Error('Image present but no url or base64 data found')
  //   }
  // }
}
