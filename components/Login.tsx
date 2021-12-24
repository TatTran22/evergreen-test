import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Pane, majorScale, Link as EvergreenLink, Button, Text, Heading, TextInputField } from 'evergreen-ui'

function Login() {
  const [loading, setLoading] = useState(false)
  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { user, session, error } = await supabase.auth.signIn({
        email: 'example@email.com',
        password: 'example-password',
      })
      if (error) throw error
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pane>
      <TextInputField label="Email" type="email" />
      <TextInputField label="Password" type="password" />
      <Button appearance="primary" intent="none">
        Đăng Nhập
      </Button>
    </Pane>
  )
}

export default Login
