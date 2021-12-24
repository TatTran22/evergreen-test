import Auth from '../components/Auth'
import Account from '../components/Account'
import React, { useState, useEffect, useContext, createContext } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AuthSession } from '@supabase/supabase-js'
import { Profile } from '../lib/constants'
import ProfileList from '../components/ProfileList'
import { Pane, Tablist, Button, Text, Heading, TextInput, Spinner, Tab, Paragraph, majorScale } from 'evergreen-ui'

import Layout from '../components/document/Layout'
import { row } from 'glamor/ous'

const IndexPage = () => {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tabs] = useState(['Thông tin tài khoản', 'Đổi mật khẩu', 'Cộng đồng'])

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
        .select('id, username, avatar_url, website, updated_at, active_status, last_active')
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
    <Layout title="Tài khoản">
      {!session ? (
        <Pane display="flex" justifyContent="center" alignItems="center" height="100%">
          <Auth />
        </Pane>
      ) : (
        <Pane position="relative" flexGrow={1} width="80%">
          <Pane display="flex" paddingX="3rem" paddingY="1rem" height="100%">
            <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
              {tabs.map((tab, index) => (
                <Tab
                  key={tab}
                  id={tab}
                  onSelect={() => setSelectedIndex(index)}
                  isSelected={index === selectedIndex}
                  aria-controls={`panel-${tab}`}
                  direction="vertical"
                  minWidth="120px"
                >
                  {tab}
                </Tab>
              ))}
            </Tablist>
            <Pane padding={16} background="tint1" flex="1">
              {tabs.map((tab, index) => (
                <Pane
                  key={tab}
                  id={`panel-${tab}`}
                  role="tabpanel"
                  aria-labelledby={tab}
                  aria-hidden={index !== selectedIndex}
                  display={index === selectedIndex ? 'block' : 'none'}
                >
                  <Pane display="flex" flexDirection="column" alignItems="center" width="400px">
                    <Heading is="h1" marginBottom="2rem" fontSize="2rem">
                      {tab}
                    </Heading>
                    {!index ? (
                      <Account key={session.user.id} session={session} />
                    ) : (
                      <Pane display="flex" flexDirection="column" gap="20" width="100%">
                        {index == 1 ? <Pane>Đang phát triển...</Pane> : <ProfileList profiles={profiles} />}
                      </Pane>
                    )}
                  </Pane>
                </Pane>
              ))}
            </Pane>
          </Pane>
        </Pane>
      )}
      {/* <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        position="relative"
      >
        <Pane display="flex" justifyContent="center" alignItems="center" height="100%" position="relative">
          {!session ? (
            <Auth />
          ) : (
            <Pane
              maxWidth="500px"
              minHeight="520px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Pane display="flex" flexDirection="column" alignItems="center">
                <Heading is="h1" marginBottom="2rem" fontSize="2rem">
                  Thông tin tài khoản
                </Heading>
                <Account key={session.user.id} session={session} />
              </Pane>
              <Pane>
                <Heading is="h1" marginBottom="2rem" fontSize="2rem">
                  Public Profiles
                </Heading>
                <ProfileList profiles={profiles} />
              </Pane>
            </Pane>
          )}
        </Pane>
      </Pane> */}
    </Layout>
  )
}

export default IndexPage
