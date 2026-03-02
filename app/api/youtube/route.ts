import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  // Validate YouTube URL
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/\s]+)/)
  if (!ytMatch) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
  }

  const videoId = ytMatch[1]

  try {
    // Use YouTube's oEmbed to verify the video exists
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )

    if (!oembedRes.ok) {
      return NextResponse.json({ error: 'Video not found or unavailable' }, { status: 404 })
    }

    // Note: Direct YouTube audio extraction requires ytdl-core or similar
    // For demo purposes, we return a descriptive error
    // In production, use a self-hosted yt-dlp service or a licensed API
    return NextResponse.json(
      {
        error: 'YouTube audio extraction requires a backend service. Please upload an audio file directly, or use a tool like yt-dlp to download the audio first.',
        videoId,
        tip: 'Download the audio with: yt-dlp -x --audio-format mp3 "' + url + '"',
      },
      { status: 501 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to process YouTube URL' }, { status: 500 })
  }
}
