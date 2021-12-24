import React, { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import '../styles/index.css'
import { useIdleTimer } from 'react-idle-timer'
import { supabase } from '../lib/supabaseClient'
import { Pane, Tablist, toaster, Button, Text, Heading, TextInput, Spinner, Alert, Paragraph } from 'evergreen-ui'

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

  const handleOnAction = (event) => {
    // console.log('user did something', event)
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  async function updateStatus() {
    try {
      const user = supabase.auth.user()

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
    } catch (error) {
      toaster.warning(error.message, {
        id: 'forbidden-action',
      })
    }
  }

  useEffect(() => {
    updateStatus()
  }, [status])
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
