import React from 'react'
import { Pane } from 'evergreen-ui'
import Layout from '../components/document/Layout'
const IndexPage = () => {
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
