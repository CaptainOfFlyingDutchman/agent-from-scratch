import type { AIMessage } from '../types.ts'
import { v4 as uuidv4 } from 'uuid'
import { JSONFilePreset } from 'lowdb/node'

export type MessageWithMetadata = AIMessage & {
  id: string,
  createdAt: string
}

type Data = {
  messages: MessageWithMetadata[]
}

export function addMetadata(message: AIMessage): MessageWithMetadata {
  return {
    ...message,
    id: uuidv4(),
    createdAt: new Date().toString()
  }
}

export function removeMetadata(message: MessageWithMetadata): AIMessage {
  const { id, createdAt, ...rest } = message

  return rest
}

export async function getDb() {
  return await JSONFilePreset<Data>('db.json', {
    messages: []
  })
}

export async function addMessages(messages: AIMessage[]) {
  let db = await getDb()
  db.data.messages.push(...messages.map(addMetadata))
  await db.write()
}

export async function getMessages() {
  let db = await getDb()

  return db.data.messages.map(removeMetadata)
}
