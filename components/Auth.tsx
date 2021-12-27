import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import zxcvbn from 'zxcvbn'
import validator from 'validator'
import { Pane, toaster, Button, Text, Heading, TextInputField, Checkbox } from 'evergreen-ui'
import fi from 'date-fns/esm/locale/fi/index.js'

export default function Auth() {
  const [loading, setLoading] = useState<boolean>(false)
  const [isSignInWithLink, setIsSignInWithLink] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value)
  }

  const handleFirstNameOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    if (value.length === 0) {
      toaster.warning('Vui lòng điền vào tên của bạn.', {
        id: 'first-name-required',
      })
    }
    if (value !== firstName) setFirstName(value)
  }

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value)
  }

  const handleLastNameOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()

    if (value.length === 0) {
      toaster.warning('Vui lòng điền vào họ của bạn.', {
        id: 'last-name-required',
      })
    }
    if (value !== lastName) setLastName(value)
  }

  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setEmail(value)
  }

  const handEmailOnBlur = () => {
    if (!validator.isEmail(email)) {
      toaster.warning('Vui lòng nhập địa chỉ email hợp lệ', {
        id: 'invalid-email',
      })
    }
  }

  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value
    setPassword(password)
  }

  const handlePasswordOnBlur = () => {
    if (!isSignUp) return

    const zxcvbnResult = zxcvbn(password)
    if (zxcvbnResult.feedback.warning) {
      toaster.warning(zxcvbnResult.feedback.warning)
    }
    if (zxcvbnResult.feedback.suggestions.length > 0) {
      zxcvbnResult.feedback.suggestions.forEach((element) => {
        toaster.notify(element)
      })
    }
  }

  const handleConfirmPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setConfirmPassword(e.currentTarget.value)
  }

  const handleConfirmPasswordOnBlur = () => {
    if (confirmPassword !== password) {
      toaster.warning('Mật khẩu nhập lại không khớp', {
        id: 'password-mismatch',
      })
    }
  }

  const handleSignUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      if (email === '' || password === '' || confirmPassword === '') {
        throw new Error('Email và mật khẩu không được để trống')
      }
      if (password !== confirmPassword) {
        toaster.warning('Mật khẩu nhập lại không khớp', {
          id: 'password-mismatch',
        })
        return
      }

      const { user, session, error } = await supabase.auth.signUp(
        { email, password },
        {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        }
      )
      if (error) throw error
      toaster.success('Đăng ký thành công!', {
        id: 'forbidden-action',
      })
      console.log(user)
    } catch (error: any) {
      console.log(error.error_description || error.message)
      toaster.warning(error.message, {
        id: 'forbidden-action',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      if (email === '' || password === '') {
        throw new Error('Bạn cần nhập vào địa chỉ email và mật khẩu.')
      }
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
      toaster.success('', {
        id: 'forbidden-action',
      })
    } catch (error: any) {
      toaster.warning(error_description || error.message, {
        id: 'forbidden-action',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (email: string) => {
    try {
      setLoading(true)
      if (email === '') {
        throw new Error('Bạn cần nhập vào địa chỉ email.')
      }

      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      toaster.success('Kiểm tra email của bạn để lấy liên kết!', {
        id: 'send-email',
      })
    } catch (error: any) {
      toaster.warning(error_description || error.message, {
        id: 'send-email',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pane>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Heading is="h1" size={800} marginBottom="1em">
          Tài khoản
        </Heading>
      </Pane>
      <Pane width="100%">
        <Pane display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="360px">
          <Heading size={600} marginY="1rem">
            {isSignUp
              ? 'Đăng ký tài khoản'
              : isSignInWithLink
              ? 'Liên kết sẽ được gửi đến hộp thư của bạn'
              : 'Đăng nhập với tài khoản của bạn'}
          </Heading>
          {isSignUp ? (
            <Pane display="flex" flexDirection="row" alignItems="" justifyContent="space-between" width="100%">
              <TextInputField
                label="Họ"
                placeholder="Nhập họ"
                value={lastName}
                onChange={handleLastNameChange}
                onBlur={handleLastNameOnBlur}
              />
              <TextInputField
                label="Tên"
                placeholder="Nhập tên"
                value={firstName}
                onChange={handleFirstNameChange}
                onBlur={handleFirstNameOnBlur}
              />
            </Pane>
          ) : null}

          <TextInputField
            label="Email"
            placeholder="Email"
            width="100%"
            value={email}
            type="email"
            onChange={handleEmailChange}
            onBlur={handEmailOnBlur}
          />
          {!isSignInWithLink && (
            <Pane width="100%" position="relative">
              <TextInputField
                label="Mật khẩu"
                placeholder="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordOnBlur}
                position="relative"
                width="100%"
              />
              {isSignUp && (
                <TextInputField
                  label="Nhập lại mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordOnBlur}
                  position="relative"
                  width="100%"
                  marginTop="1rem"
                />
              )}
            </Pane>
          )}
          <Checkbox
            label="Hiển thị mật khẩu."
            checked={showPassword}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setShowPassword(e.currentTarget.checked)}
          />
          <Pane marginY="1rem">
            {isSignUp ? (
              <Button
                appearance="primary"
                intent="success"
                onClick={() => handleSignUp(email, password)}
                isLoading={loading}
              >
                Đăng ký
              </Button>
            ) : isSignInWithLink ? (
              <Button
                appearance="primary"
                intent="success"
                marginY="1.5em"
                onClick={(e) => {
                  e.preventDefault()
                  handleSendEmail(email)
                }}
                isLoading={loading}
              >
                Gửi liên kết
              </Button>
            ) : (
              <Button appearance="primary" onClick={() => handleSignIn(email, password)} isLoading={loading}>
                Đăng nhập
              </Button>
            )}
          </Pane>
          <Pane marginTop="1rem" display="flex" flexDirection="column" alignItems="center">
            {!isSignUp && (
              <Button color="#5C85FF" appearance="minimal" onClick={() => setIsSignInWithLink(!isSignInWithLink)}>
                {!isSignInWithLink ? 'Đăng nhập bằng liên kết' : 'Đăng nhập bằng email'}
              </Button>
            )}
            <Text>{isSignUp ? 'Bạn đã có tài khoản?' : 'Bạn chưa có tài khoản?'}</Text>
            <Button
              intent="success"
              appearance="minimal"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setIsSignInWithLink(false)
              }}
            >
              {isSignUp ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  )
}
