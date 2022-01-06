import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Profile } from '../lib/constants'
import UserAvatar from './UserAvatar'
import { formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Pane, Text, Heading, Card, StatusIndicator } from 'evergreen-ui'

export default function ProfileCard({ profile }: { profile: Profile }) {
  const [lastActive, setLastActive] = useState<string>('')

  let name = '?'
  if (profile.first_name.length > 0 || profile.first_name.length > 0) {
    name = `${profile.first_name ? profile.first_name : ''} ${profile.last_name ? profile.last_name : ''}`
  }
  useEffect(() => {
    setLastActive(formatDistance(new Date(profile.last_active), new Date(), { addSuffix: true, locale: vi }))
  }, [profile.active_status])

  return (
    <Card
      borderRadius="1rem"
      display="flex"
      marginBottom="20px"
      padding="20px"
      alignItems="center"
      backgroundColor="#EBF0FF"
      position="relative"
      height="100%"
    >
      <Pane position="relative">
        <UserAvatar url={profile.avatar_url} size={88} name={name} />
        <Pane position="absolute" right="0" bottom="0">
          <Pane position="relative" display="flex" justifyContent="center" alignItems="center">
            <StatusIndicator color="white" dotSize={30} position="absolute" />
            <StatusIndicator color={profile.active_status ? 'success' : 'disabled'} dotSize={22} position="relative" />
          </Pane>
        </Pane>
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginLeft="1rem"
        justifyContent="space-around"
        flexGrow={1}
      >
        <Heading is="h2" fontSize="1.3rem" fontWeight="500" marginBottom="1rem">
          {name}
        </Heading>
        <Text>
          {profile.active_status ? (
            <Pane is="small">Đang hoạt động</Pane>
          ) : (
            <Pane is="small">Hoạt động gần nhất {lastActive}</Pane>
          )}
        </Text>
      </Pane>
    </Card>
  )
}
