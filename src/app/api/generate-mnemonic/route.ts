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

   const prompt = `Generate a SHORT, memorable mnemonic to remember the name "${name}".
${
  imageDescription
    ? `Appearance: ${imageDescription}`
    : ''
}

Keep it to ONE SHORT SENTENCE (under 15 words). Make it quirky and visual.
Example: "Sarah in a safari hat" or "Mike with a microphone"

Just the mnemonic, nothing else.`

    const message = await client.messages.create({
      model: 'claude-opus-4-1',
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
