import { NextRequest, NextResponse } from 'next/server'
import { fetchWrappedData } from '../../lib/github'

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')
  if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })

  try {
    const data = await fetchWrappedData(username.trim())
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
