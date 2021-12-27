import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Profile, animals } from '../lib/constants'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Pane, Link as EvergreenLink, Text, Heading, Card, StatusIndicator } from 'evergreen-ui'

export default function ProfileCard({ profile }: { profile: Profile }) {
  const [isActive, setIsActive] = useState<boolean>(profile.active_status)
  const lastActive = formatDistance(new Date(profile.last_active), new Date(), { addSuffix: true, locale: vi })
  const router = useRouter()
  const { pathname } = router
  const parentPath = pathname.split('/')[1]
  const randomAnimal1 = animals[Math.floor(Math.random() * animals.length)]
  const randomAnimal2 = animals[Math.floor(Math.random() * animals.length)]

  const name = `${profile.first_name ? profile.first_name : randomAnimal1} ${
    profile.last_name ? profile.last_name : randomAnimal2
  }`

  useEffect(() => {
    const lastActiveDate = new Date(profile.last_active).getTime()
    const fiveMinutesAgo = new Date(Date.now() - 1000 * 60 * 5).getTime()
    setIsActive(lastActiveDate > fiveMinutesAgo)
  }, [profile.last_active])

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
            <StatusIndicator color={isActive ? 'success' : 'disabled'} dotSize={22} position="relative" />
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
        <Text fontSize="0.9rem" fontWeight="500">
          {profile.username ? profile.username : ''}
        </Text>
        {profile.website && (
          <Pane>
            <Link href={profile.website} passHref>
              <EvergreenLink
                target="_blank"
                fontSize="0.9rem"
                color={parentPath !== 'resources' ? 'neutral' : undefined}
              >
                {profile.website}
              </EvergreenLink>
            </Link>
          </Pane>
        )}
        <Text>
          <Pane is="small">Hoạt động gần nhất {lastActive}</Pane>
        </Text>
      </Pane>
    </Card>
  )
}
