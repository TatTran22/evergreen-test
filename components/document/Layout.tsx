import React, { ReactNode } from 'react'
import PageFooter from './PageFooter'
import Head from './Head'
import TopNav from '../TopNav'
import { majorScale, Pane } from 'evergreen-ui'

interface Props {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = '' }: Props) => (
  <Pane>
    <Head title={title} />
    <Pane width="100vw" minHeight="100vh" display="flex" flexDirection="column">
      <TopNav />
      <Pane
        background="tint2"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        position="relative"
        alignItems="center"
      >
        {children}
      </Pane>
      <PageFooter />
    </Pane>
  </Pane>
)

export default Layout
