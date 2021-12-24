import { useState, useEffect, ChangeEvent } from 'react'
import { supabase } from '../lib/supabaseClient'
import UploadButton from '../components/UploadButton'
import UserAvatar from './UserAvatar'
import { AuthSession } from '@supabase/supabase-js'
import { DEFAULT_AVATARS_BUCKET, Profile } from '../lib/constants'
import {
  Pane,
  majorScale,
  Link as EvergreenLink,
  Button,
  Text,
  Heading,
  TextInput,
  TextInputField,
  Spinner,
  Alert,
} from 'evergreen-ui'

export default function Account({ session }: { session: AuthSession }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.log('Error logging out:', error.message)
  }

  async function uploadAvatar(event: FileList) {
    try {
      setUploading(true)
      if (!event || event.length == 0) {
        throw 'You must select an image to upload.'
      }

      const user = supabase.auth.user()
      const file = event[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${session?.user.id}${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from(DEFAULT_AVATARS_BUCKET).upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { error: updateError } = await supabase.from('profiles').upsert({
        id: user!.id,
        avatar_url: filePath,
      })

      if (updateError) {
        throw updateError
      }

      setAvatar(null)
      setAvatar(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  function setProfile(profile: Profile) {
    setAvatar(profile.avatar_url)
    setUsername(profile.username)
    setWebsite(profile.website)
  }

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user!.id)
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
    } catch (error) {
      console.log('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user!.id,
        username,
        website,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pane display="flex" flexDirection="column" gap="20" width="100%">
      <Pane>
        <Pane display="flex" alignItems="center" marginBottom="20px">
          <Pane marginRight="20px">
            <UserAvatar url={avatar} size={60} name={username} />
          </Pane>
          <UploadButton onUpload={uploadAvatar} loading={uploading} />
        </Pane>
      </Pane>
      <Pane>
        <TextInputField label="Email" id="email" type="text" value={session.user.email} disabled />
      </Pane>
      <Pane>
        <TextInputField
          label="Tên"
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Pane>
      <Pane>
        <TextInputField
          label="Website"
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </Pane>

      <Pane display="flex" justifyContent="center">
        <Button intent="success" onClick={() => updateProfile()} disabled={loading}>
          {loading ? 'Đang tải ...' : 'Cập nhật'}
        </Button>
        <Button intent="minimal" onClick={() => signOut()}>
          Sign Out
        </Button>
      </Pane>

      <Pane></Pane>
    </Pane>
  )
}
