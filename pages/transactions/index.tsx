import { useEffect, useState } from 'react'
import Layout from '~/components/document/Layout'
import NewTransaction from '~/components/transaction/NewTransaction'
import { Pane, Button, SideSheet } from 'evergreen-ui'
import { CategoryClone } from '~/data/category'

interface Props {}

const ComponentsPage: React.FC<Props> = () => {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    console.log(CategoryClone)
  }, [])
  return (
    <Layout title="Giao Dịch">
      <SideSheet
        isShown={isShown}
        onCloseComplete={() => setIsShown(false)}
        containerProps={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
        }}
      >
        <NewTransaction />
      </SideSheet>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        position="relative"
      >
        <Pane>
          <Button onClick={() => setIsShown(true)}>Thêm Giao Dịch</Button>
        </Pane>
      </Pane>
    </Layout>
  )
}

export default ComponentsPage
