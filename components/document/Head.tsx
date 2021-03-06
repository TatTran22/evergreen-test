import React from 'react'
import Head from 'next/head'

interface Props {
  title?: string
}

const absolutePath = (path?: string) => {
  return `https://evergreen.segment.com${path || ''}`
}

const description = 'Đây là một dự án cá nhân nhằm mục đích quản lý chi tiêu của bản thân.'

const DocumentHead: React.FC<Props> = ({ title }) => {
  return (
    <Head>
      <title>{title ? title : 'Jesse Tran'}</title>
      <meta property="og:title" content="Evergreen" />
      <meta name="viewport" content="width=device-width, initial-scale=0.65, maximum-scale=5.0, minimum-scale=0.65" />
      <meta property="og:url" content={absolutePath()} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absolutePath('/og-image.png')} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:site" content="@segment" />
      <meta name="twitter:creator" content="@segment" />
      <meta name="description" content={description} />
      <meta property="twitter:image" content={absolutePath('/twitter-og.png')} />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
    </Head>
  )
}

export default DocumentHead
