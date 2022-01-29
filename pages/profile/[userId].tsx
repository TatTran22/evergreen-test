import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '~/components/document/Layout'
import { Pane, Tablist, Tab, Heading, toaster } from 'evergreen-ui'

interface Props {}

const ComponentPage: React.FC<Props> = () => {
  const router = useRouter()
  const { userId } = router.query
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    if (userId != null) {
      // fetchData(userId).then((author) => {
      //   if (componentMounted) {
      // setAuthor(author)
      //     setLoading(false)
      //   }
      // })
    }
    return () => {
      setLoading(false)
    }
  }, [userId])

  return (
    <Layout title={'ok'}>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        position="relative"
      >
        <Pane display="flex" justifyContent="center" alignItems="center" height="100%" position="relative">
          {userId}
        </Pane>
      </Pane>
    </Layout>
  )
}

export default ComponentPage
