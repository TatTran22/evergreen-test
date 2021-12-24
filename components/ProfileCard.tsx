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
  TextInput,
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
    <Pane borderRadius="5px" display="flex" marginBottom="20px" padding="20px" alignItems="center">
      <UserAvatar url={profile.avatar_url} size={100} name={profile.username} />
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Text fontSize="1.3rem" fontWeight="500" marginBottom="5px" position="relative">
          <Pane position="absolute" left="-20px">
            <StatusIndicator color={profile.active_status ? 'success' : 'disabled'} dotSize={12} />
          </Pane>
          {profile.username}
        </Text>
        <Text fontSize="0.7em">{profile.active_status ? 'Đang hoạt động' : `Hoạt động lần cuối ${lastActive}`}</Text>

        <Link href={profile.website} passHref>
          <EvergreenLink target="_blank" fontSize="0.9rem" color={parentPath !== 'resources' ? 'neutral' : undefined}>
            {profile.website}
          </EvergreenLink>
        </Link>
        <Text>
          <Pane is="small">
            Cập nhật lần cuối{' '}
            {lastUpdated ? `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}` : 'Never'}
          </Pane>
        </Text>
      </Pane>
      <Pane />
    </Pane>
  )
}
