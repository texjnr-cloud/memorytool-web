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

const prompt = `Create a mnemonic for "${name}".

${
  imageDescription
    ? `They have: ${imageDescription}`
    : ''
}

STRICT RULES - FOLLOW EXACTLY:
1. Maximum 3 words only
2. Pick the SINGLE most distinctive feature
3. Use alliteration if possible (words starting with same sound)
4. Make it silly or exaggerated
5. Should take 1 second to say

EXAMPLES (follow this format exactly):
"Sally's shiny shoes"
"Mike's mighty mustache"
"Blake's bright blue"
"Red Rachel's ribbon"
"Big Ben's beard"

Your response must be exactly 2-3 words maximum.
Format: [Name]'s [adjective] [noun]

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
