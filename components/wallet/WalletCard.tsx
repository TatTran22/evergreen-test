import React from 'react'
import { Pane, Card, Avatar, Heading, Badge } from 'evergreen-ui'

interface Props {
  name: string
  type: string
  avatar: string
  amount: number
  color: string
}

const WalletCard: React.FC<Props> = ({ name, type, amount, color }) => {
  return (
    <Card
      borderRadius="1rem"
      borderColor={color}
      borderWidth="2px"
      borderStyle="solid"
      display="flex"
      alignItems="center"
      // backgroundColor={color}
      position="relative"
      height={80}
      width={240}
    >
      <Pane display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="40%">
        <Heading is="h2" fontSize="0.8rem" fontWeight="500">
          {name}
        </Heading>
        <Heading is="h2" fontSize="0.8rem" fontWeight="500">
          {type}
        </Heading>
      </Pane>
      <Pane display="flex" flexDirection="column" alignItems="center" justifyContent="center" flex="1">
        <Heading is="h3" fontSize="1.1rem" fontWeight="600">
          {
            /* get balance from amount prop and format it to currency format (e.g. 1,000,000 VND) and if amount has more than 2 decimal places, it will be rounded to 2 decimal places */
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(amount)
          }
        </Heading>
      </Pane>
    </Card>
  )
}

export default WalletCard
