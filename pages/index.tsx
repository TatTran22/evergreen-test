import Auth from '../components/Auth'
import Account from '../components/Account'
import React, { useState, useEffect, useContext, createContext } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AuthSession } from '@supabase/supabase-js'
import { Profile } from '../lib/constants'
import ProfileList from '../components/ProfileList'
import { Pane, majorScale, Link as EvergreenLink, Button, Text, Heading, Alert, TextInput } from 'evergreen-ui'

import Layout from '../components/document/Layout'
import { row } from 'glamor/ous'

const IndexPage = () => {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    getPublicProfiles()
  }, [])

  async function getPublicProfiles() {
    try {
      const { data, error } = await supabase
        .from<Profile>('profiles')
        .select('id, username, avatar_url, website, updated_at')
        .order('updated_at', { ascending: false })

      if (error || !data) {
        throw error || new Error('No data')
      }
      console.log('Public profiles:', data)
      setProfiles(data)
    } catch (error) {
      console.log('error', error.message)
    }
  }
  return (
    <Layout title="Trang chủ">
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        position="relative"
      >
        <Pane display="flex" justifyContent="center" alignItems="center" height="100%" position="relative"></Pane>
      </Pane>
    </Layout>
  )
}

export default IndexPage
