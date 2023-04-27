import { Card, H1, H4, Paragraph } from 'tamagui'

export const EmptyItem = () => (
  <Card width='100%' height='100%' elevate size='$3' mt='$4' bordered p='$4'>
    <Card.Header
      padded
      alignItems='center'
      justifyContent='center'
      height='100%'
    >
      <H1>🏜</H1>
      <H4>empty..</H4>
      <Paragraph theme='alt2'>💨💨💨💨💨</Paragraph>
    </Card.Header>
  </Card>
)
