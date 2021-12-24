import React, { useCallback } from 'react'
import { openConsentManager } from '@segment/consent-manager'
import { majorScale, Pane, Text, Link } from 'evergreen-ui'
import GitHubButton from 'react-github-button'

interface Props {}

const PageFooter: React.FC<Props> = () => {
  const dataCollectionHandler = useCallback((e) => {
    e.preventDefault()
    openConsentManager()
  }, [])

  return (
    <Pane
      is="footer"
      width="100%"
      height={majorScale(8)}
      borderTop="muted"
      paddingX={majorScale(5)}
      paddingY={majorScale(3)}
      marginTop={majorScale(5)}
      display="flex"
      justifyContent="space-between"
    >
      <Pane display="flex" alignItems="center">
        <Pane is="img" width={80} src="/segment-logo.svg" marginRight={majorScale(5)} />
        <Text size={300} color="muted">
          © {new Date().getFullYear()}, Tat Tran.
        </Text>
      </Pane>
      <Pane>
        <GitHubButton type="stargazers" namespace="tattran22" repo="prime" />
      </Pane>
    </Pane>
  )
}

export default PageFooter
