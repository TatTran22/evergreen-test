import React, { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import '../styles/index.css'
import { useIdleTimer } from 'react-idle-timer'
import { supabase } from '../lib/supabaseClient'
import { toaster } from 'evergreen-ui'
import { UserContextProvider } from '../components/UserContext'

function MyApp({ Component, pageProps }: AppProps) {
  const [status, setStatus] = useState<boolean>(true)

  const handleOnIdle = async (event: Event) => {
    setStatus(false)
    console.log('user is idle', event)
    console.log('last active', await getLastActiveTime())
  }

  const handleOnActive = async (event: Event) => {
    setStatus(true)
    console.log('user is active', event)
    console.log('time remaining', await getRemainingTime())
  }

  const handleOnAction = (event: Event) => {
    // console.log('user did something', event)
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  async function updateStatus() {
    try {
      const user = supabase.auth.user()
      if (user === null) return

      const updates = {
        id: user!.id,
        active_status: status,
        last_active: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      toaster.warning(error.message, {
        id: 'forbidden-action',
      })
      console.log('error', error)
    }
  }

  // update status on page load and when status changes
  useEffect(() => {
    updateStatus()
  }, [status])

  // set status to false on page unload
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      setStatus(false)
    })

    return () => {
      window.removeEventListener('beforeunload', () => {
        setStatus(false)
      })
    }
  }, [])

  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  )
}

export default MyApp
