import zxcvbn from 'zxcvbn'
import validator from 'validator'

type Validate = {
  isValid: boolean
  errorMessage: string
  suggestions?: string[]
}

export function validateUsername(username: string): Validate {
  if (validator.isEmpty(username)) {
    return {
      isValid: false,
      errorMessage: 'Tên đăng nhập không được để trống',
    }
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/

  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      errorMessage: 'Tên đăng nhập không hợp lệ',
      suggestions: ['Tên đăng nhập phải có ít nhất 3 ký tự, không chứa khoảng trắng và không chứa ký tự đặc biệt'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  }
}

export function validatePassword(password: string): Validate {
  if (typeof password !== 'string' || password.length < 8) {
    return {
      isValid: false,
      errorMessage: 'Mật khẩu không hợp lệ',
      suggestions: ['Mật khẩu phải có ít nhất 8 ký tự'],
    }
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      errorMessage: 'Mật khẩu không hợp lệ',
      suggestions: ['Mật khẩu phải có ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số và 1 ký tự đặc biệt'],
    }
  }

  const passwordStrength = zxcvbn(password)

  if (passwordStrength.score < 2) {
    return {
      isValid: false,
      errorMessage: 'Mật khẩu của bạn quá yếu',
      suggestions: passwordStrength.feedback.suggestions,
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  }
}

export function validateEmail(email: string): Validate {
  if (validator.isEmpty(email)) {
    return {
      isValid: false,
      errorMessage: 'Email không được để trống',
    }
  }

  if (!validator.isEmail(email)) {
    return {
      isValid: false,
      errorMessage: 'Email không hợp lệ',
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  }
}
