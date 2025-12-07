import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { name, imageDescription } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const client = new Anthropic({ apiKey })

    const prompt = `Generate a creative and memorable mnemonic phrase or story to help remember the name "${name}".
${
  imageDescription
    ? `The person looks like: ${imageDescription}`
    : ''
}

Create a short, vivid mnemonic (1-2 sentences) that combines the person's appearance with their name in a memorable way. Make it quirky and fun so it sticks in memory.

Just respond with the mnemonic phrase, nothing else.`

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const mnemonic =
      message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ mnemonic })
  } catch (error) {
    console.error('Error generating mnemonic:', error)
    return NextResponse.json(
      { error: 'Failed to generate mnemonic' },
      { status: 500 }
    )
  }
}
