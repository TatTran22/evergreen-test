import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import UploadButton from '../components/UploadButton'
import UserAvatar from './UserAvatar'
import { AuthSession } from '@supabase/supabase-js'
import { DEFAULT_AVATARS_BUCKET, Profile } from '../lib/constants'
import { validateUsername } from '../lib/validateInput'
import { Pane, Button, TextInputField, toaster } from 'evergreen-ui'

export default function Account({ session }: { session: AuthSession }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [website, setWebsite] = useState<string | null>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleEmailBlur = () => {
    toaster.warning('Địa chỉ email không thể thay đổi.', {
      id: 'email-cannot-change',
    })

    setEmail(session.user.email)
  }

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value)
  }

  const handleUsernameBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const validateResult = validateUsername(value)

    if (!validateResult.isValid) {
      toaster.warning(validateResult.errorMessage, {
        id: 'username-invalid',
        description: validateResult.suggestions && validateResult.suggestions.join('\n'),
      })
    }
  }

  useEffect(() => {
    getProfile()
  }, [session])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toaster.warning('Đăng xuất không thành công', {
        id: 'sign-out-error',
      })
      console.log('Error logging out:', error.message)
    }
    toaster.success('Đăng xuất thành công!', {
      id: 'sign-out-success',
    })
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
      console.log('Error uploading avatar:', error)
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  function setProfile(profile: Profile) {
    setEmail(session.user.email)
    setAvatar(profile.avatar_url)
    setUsername(profile.username)
    setFirstName(profile.first_name)
    setLastName(profile.last_name)
    setWebsite(profile.website)
  }

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, first_name, last_name, website, avatar_url`)
        .eq('id', user!.id)
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
    } catch (error) {
      console.log('Error getting profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      if (!user) {
        throw new Error('Người dùng không tồn tại')
      }

      if (!validateUsername(username)) {
        throw new Error('Tên người dùng không hợp lệ')
      }

      const updates = {
        id: user!.id,
        username,
        first_name: firstName,
        last_name: lastName,
        website,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
      toaster.success('Cập nhật thành công!', {
        id: 'profile-update-success',
      })
    } catch (error: any) {
      console.log('Error updating profile:', error)
      if (error.message.includes('profiles_username_key')) {
        toaster.danger('Tên người dùng đã được sử dụng.', {
          id: 'profile-update-fail',
          description: 'Vui lòng chọn tên khác.',
        })
        if (usernameInputRef.current) usernameInputRef.current.focus()
      }
      toaster.danger('Cập nhật thất bại!', {
        id: 'profile-update-fail',
        description: error.message || error.description || '',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pane display="flex" flexDirection="column" gap="20" width="100%">
      <Pane>
        <Pane display="flex" alignItems="center" marginBottom="20px">
          <Pane marginRight="20px">
            <UserAvatar url={avatar} size={60} name={firstName + ' ' + lastName} />
          </Pane>
          <UploadButton onUpload={uploadAvatar} loading={uploading} />
        </Pane>
      </Pane>
      <Pane>
        <TextInputField
          label="Email"
          id="account-email"
          type="text"
          placeholder="Email"
          value={email || ''}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          disabled
        />
      </Pane>
      <Pane>
        <TextInputField
          label="Username"
          id="account-username"
          type="text"
          placeholder="Username"
          value={username || ''}
          ref={usernameInputRef}
          onChange={handleUsernameChange}
          onBlur={handleUsernameBlur}
          hint="Tên đăng nhập phải có ít nhất 3 ký tự, không chứa ký tự đặc biệt và không chứa khoảng trắng"
        />
      </Pane>
      <Pane display="flex" justifyContent="space-between">
        <TextInputField
          label="Tên"
          id="account-first-name"
          type="text"
          placeholder="Tên"
          value={firstName || ''}
          onChange={handleFirstNameChange}
          width="40%"
        />
        <TextInputField
          label="Họ"
          id="account-last-name"
          type="text"
          placeholder="Họ"
          value={lastName || ''}
          onChange={handleLastNameChange}
          width="40%"
        />
      </Pane>
      <Pane>
        <TextInputField
          label="Website"
          id="account-website"
          type="website"
          placeholder="Website"
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
