import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DEFAULT_AVATARS_BUCKET } from '../lib/constants'
import { Avatar, toaster } from 'evergreen-ui'

export default function UserAvatar({ url, size, name }: { url: string | null; size: number; name: string | null }) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from(DEFAULT_AVATARS_BUCKET).download(path)
      if (error) {
        throw error
      }
      if (!data) {
        throw 'Không tìm thấy ảnh'
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error: any) {
      toaster.warning(error.message, {
        id: 'image-download-error',
      })
    }
  }

  return <Avatar src={avatarUrl} name={name} size={size} />
}
