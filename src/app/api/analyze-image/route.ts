import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    console.log('=== ANALYZE IMAGE API CALLED ===')
    console.log('API Key env var:', process.env.ANTHROPIC_API_KEY ? 'EXISTS' : 'MISSING')
    console.log('API Key length:', process.env.ANTHROPIC_API_KEY?.length)
    
    const { imageBase64, mimeType } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
console.log('API Key exists:', !!apiKey)
console.log('API Key length:', apiKey?.length)
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType || 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: 'Briefly describe the person in this photo in 1-2 sentences, focusing on distinctive features (hair, facial features, style) that would help someone remember them.',
            },
          ],
        },
      ],
    })

    const description =
      message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ description })
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
