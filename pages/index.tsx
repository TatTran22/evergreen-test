import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Button, Pane, Text, majorScale } from 'evergreen-ui';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Jesse Tran</title>
        <meta
          name='description'
          content='Ứng dụng quản lý tài chính của Jesse Tran.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Pane
        display='flex'
        alignItems='center'
        justifyContent='center'
        width='100%'
        height='100vh'
        marginX={majorScale(2)}
      >
        <Button>Click me!</Button>
        <Text>This is a clickable Button</Text>
      </Pane>
    </>
  );
};

export default Home;
