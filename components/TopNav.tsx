import { useState } from 'react'
import { Pane, majorScale, Link as EvergreenLink, Button, UserIcon, Dialog } from 'evergreen-ui'
import Link from 'next/link'
import { useRouter } from 'next/router'

import 'react-github-button/assets/style.css'

interface Props {}

const TopNav: React.FC<Props> = () => {
  const router = useRouter()
  const { pathname } = router
  const parentPath = pathname.split('/')[1]
  const [isShown, setIsShown] = useState(false)

  return (
    <Pane
      is="nav"
      width="100%"
      position="sticky"
      top={0}
      backgroundColor="white"
      zIndex={10}
      height={majorScale(8)}
      flexShrink={0}
      display="flex"
      alignItems="center"
      borderBottom="muted"
      paddingX={majorScale(5)}
      background="blueTint"
    >
      <Pane display="flex" alignItems="center" width={236}>
        <Link href="/">
          <Pane is="img" width={100} height={32} src="/wallet.svg" cursor="pointer" />
        </Link>
      </Pane>
      <Pane flex={1}>
        <Link href="/resources" passHref>
          <EvergreenLink color={parentPath !== 'resources' ? 'neutral' : undefined} marginRight={majorScale(3)}>
            Resources
          </EvergreenLink>
        </Link>
      </Pane>
      <Pane display="flex" alignItems="center" justifyContent="flex-end" width={236}>
        <Link href="/account" passHref>
          <EvergreenLink color={parentPath !== 'resources' ? 'neutral' : undefined} marginRight={majorScale(3)}>
            <Button intent="success">Tài khoản</Button>
          </EvergreenLink>
        </Link>
      </Pane>
    </Pane>
  )
}

export default TopNav
