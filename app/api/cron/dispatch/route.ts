import { NextRequest, NextResponse } from 'next/server'
import { runCompetitorScan } from '@/lib/jobs/competitor-scan'
import { runDigest } from '@/lib/jobs/digest'
import { runCtrCheck } from '@/lib/jobs/ctr-check'
import { runOutlierScan } from '@/lib/jobs/outlier-scan'

const JOBS: Record<string, () => Promise<any>> = {
  'competitor-scan': runCompetitorScan,
  'digest': runDigest,
  'ctr-check': runCtrCheck,
    'outlier-scan': runOutlierScan,
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const jobName = body.job as string

    if (!jobName || !JOBS[jobName]) {
      return NextResponse.json({ error: 'Unknown job' }, { status: 400 })
    }

    const result = await JOBS[jobName]()
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('CRON ERROR:', err?.message, err?.stack)
    return NextResponse.json({ error: 'Internal error', detail: err?.message }, { status: 500 })
  }
}
