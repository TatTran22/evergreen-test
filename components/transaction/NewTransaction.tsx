import { useState, useEffect } from 'react'
import { Pane, Button, Card, Heading, TextInput, Combobox } from 'evergreen-ui'
import WalletCard from '~/components/wallet/WalletCard'

interface TransactionType {
  id: string
  label: string
}

interface Wallet {
  id: string
  label: string
  balance: number
  type: string
}

const NewTransaction = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([])
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType>({ id: '', label: '' })
  const [selectedWallet, setSelectedWallet] = useState<Wallet>({ id: '', label: '', balance: 0, type: '' })
  const [amount, setAmount] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [walletList, setWalletList] = useState<string[]>([])

  const [wallets] = useState(['Tiền mặt', 'Ví điện tử', 'Ví thường'])

  const handleTransactionTypeChange = (selectedTransactionType: TransactionType) => {
    setSelectedTransactionType(selectedTransactionType)
    console.log('selectedTransactionType', selectedTransactionType)
  }

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value))
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    console.log('submited')
    setIsLoading(false)
  }

  useEffect(() => {
    setTransactionTypes([
      { id: '0', label: 'Khoản Chi' },
      { id: '1', label: 'Khoản Thu' },
      { id: '2', label: 'Đi Vay' },
      { id: '3', label: 'Cho Vay' },
      { id: '4', label: 'Trả Nợ' },
      { id: '5', label: 'Nhận Nợ' },
    ])

    setIsLoading(false)
  }, [])
  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
        <Pane padding={16} borderBottom="muted">
          <Heading size={600}>Giao Dịch Mới</Heading>
        </Pane>
        {/* <Pane display="flex" padding={8}>
            <Tablist>
              {type.map((tab, index) => (
                <Tab key={tab} isSelected={selectedIndex === index} onSelect={() => setSelectedIndex(index)}>
                  {tab}
                </Tab>
              ))}
            </Tablist>
          </Pane> */}
      </Pane>

      <Pane is="form" onSubmit={handleOnSubmit}>
        <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
          <Card
            backgroundColor="white"
            elevation={0}
            height={320}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-around"
          >
            <Pane
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="center"
              width="100%"
              padding={24}
            >
              <Pane display="flex" alignItems="center" justifyContent="space-between" marginTop={16}>
                <WalletCard name="Test" amount={99999999.999999} type="Tiền mặt" color="#DCF2EA" avatar="" />
              </Pane>
            </Pane>
            <Pane flex="1" display="flex" alignItems="center" justifyContent="space-between" width="100%" padding={24}>
              <Combobox
                openOnFocus
                items={transactionTypes}
                placeholder="Chọn loại giao dịch"
                onChange={handleTransactionTypeChange}
                selectedItem={selectedTransactionType}
                itemToString={(item) => (item ? item.label : '')}
                marginBottom={16}
                size="large"
              />
              <TextInput
                id="transaction-amount"
                placeholder="Nhập số tiền"
                size="large"
                marginBottom={16}
                value={amount}
                onChange={handleAmountChange}
                type={'number'}
              />
            </Pane>
            <Pane display="flex" alignItems="center" justifyContent="center" marginTop={16}>
              <Button appearance="primary" intent="success" height={40} margin={16} type="submit" isLoading={isLoading}>
                Thêm
              </Button>
            </Pane>
          </Card>
        </Pane>
      </Pane>
    </>
  )
}

export default NewTransaction
