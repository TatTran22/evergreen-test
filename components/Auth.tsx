import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Pane, Tablist, toaster, Button, Text, Heading, TextInput, Spinner, Alert, Paragraph } from 'evergreen-ui'
import Login from './Login'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSendEmail = async (email: string) => {
    try {
      setLoading(true)
      setMsg('')
      const { error, user } = await supabase.auth.signIn({ email })
      if (error) throw error
      setSendSuccess(true)
      setMsg('Kiểm tra email của bạn để lấy liên kết!')
      toaster.success('Kiểm tra email của bạn để lấy liên kết!', {
        id: 'forbidden-action',
      })
    } catch (error) {
      console.log(error.error_description || error.message)
      setMsg('Bạn cần nhập vào địa chỉ email.')
      toaster.warning('Bạn cần nhập vào địa chỉ email.', {
        id: 'forbidden-action',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pane>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Heading is="h1" size={800} marginBottom="1em">
          Đăng nhập
        </Heading>
      </Pane>
      <Pane marginY="1em" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Text marginBottom="1.5em">Đăng nhập với liên kết thần thánh</Text>
        <TextInput
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          width="300px"
          marginBottom="1.5em"
        />
        <Button
          appearance="primary"
          intent="success"
          marginBottom="1.5em"
          onClick={(e) => {
            e.preventDefault()
            handleSendEmail(email)
          }}
        >
          {loading ? <Spinner size={24} /> : <Pane>Gửi liên kết</Pane>}
        </Button>
      </Pane>
    </Pane>
  )
}
