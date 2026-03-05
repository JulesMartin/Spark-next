import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  revalidatePath('/')
  revalidatePath('/interviews/[slug]', 'page')
  revalidatePath('/blog/[slug]', 'page')
  return NextResponse.json({ revalidated: true })
}
