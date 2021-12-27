import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Profile } from '../lib/constants'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  Pane,
  majorScale,
  Link as EvergreenLink,
  Button,
  Text,
  Heading,
  Card,
  Nudge,
  Position,
  StatusIndicator,
} from 'evergreen-ui'

export default function ProfileCard({ profile }: { profile: Profile }) {
  const lastUpdated = profile.updated_at ? new Date(profile.updated_at) : null
  const lastActive = formatDistance(new Date(profile.last_active), new Date(), { addSuffix: true, locale: vi })
  const router = useRouter()
  const { pathname } = router
  const parentPath = pathname.split('/')[1]

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
        <UserAvatar url={profile.avatar_url} size={88} name={profile.username} />
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
          {profile.username}
        </Heading>
        {/* <Text fontSize="0.7em">{profile.active_status ? 'Đang hoạt động' : `Hoạt động lần cuối ${lastActive}`}</Text> */}
        <Pane>
          <Link href={profile.website} passHref>
            <EvergreenLink target="_blank" fontSize="0.9rem" color={parentPath !== 'resources' ? 'neutral' : undefined}>
              {profile.website}
            </EvergreenLink>
          </Link>
        </Pane>
        <Text>
          <Pane is="small">Hoạt động gần nhất {lastActive}</Pane>
        </Text>
      </Pane>
    </Card>
  )
}
