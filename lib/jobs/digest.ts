import { createClient } from '@/lib/supabase/server'
import { sendDigest } from '@/lib/email/digest'

export async function runDigest() {
  const supabase = createClient()

  // Получаем всех пользователей с конкурентами
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, email')

  if (usersError || !users || users.length === 0) {
    return { ok: true, job: 'digest', sent: 0, reason: 'no_users' }
  }

  let totalSent = 0

  for (const user of users) {
    if (!user.email) continue

    // Проверяем, не отправляли ли уже сегодня
    const today = new Date().toISOString().split('T')[0]
    const { data: existingLog } = await supabase
      .from('digest_log')
      .select('id')
      .eq('user_id', user.id)
      .eq('sent_date', today)
      .single()

    if (existingLog) {
      console.log('DIGEST: already sent today for user', user.id)
      continue
    }

    // Собираем новые видео конкурентов за последние 24ч
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: videos } = await supabase
      .from('competitor_videos')
      .select('*')
      .eq('digest_sent', false)
      .gte('created_at', yesterday)
      .order('outlier_multiplier', { ascending: false })
      .limit(5)

    if (!videos || videos.length === 0) {
      console.log('DIGEST: no new videos for user', user.id)
      continue
    }

    // Отправляем email
    const result = await sendDigest(user.email, videos)

    if (result.sent) {
      // Помечаем видео как отправленные
      await supabase
        .from('competitor_videos')
        .update({ digest_sent: true })
        .in('id', videos.map(v => v.id))

      // Логируем отправку
      await supabase.from('digest_log').insert({
        user_id: user.id,
        sent_date: today,
        video_count: videos.length
      })

      totalSent++
    }
  }

  return { ok: true, job: 'digest', sent: totalSent }
}
