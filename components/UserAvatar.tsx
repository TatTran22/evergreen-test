import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DEFAULT_AVATARS_BUCKET } from '../lib/constants'
import { Pane, majorScale, Avatar, Button, Text, Heading } from 'evergreen-ui'

export default function UserAvatar({ url, size, name }: { url: string | null; size: number; name: string | null }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from(DEFAULT_AVATARS_BUCKET).download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  return <Avatar src={avatarUrl} name={name ?? 'Jesse Tran'} size={size} />
}
