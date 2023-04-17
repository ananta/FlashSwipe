import { Card, CardProps, Paragraph, H2 } from 'tamagui'

interface ActionCardProps extends CardProps {
  title: string
  subTitle?: string
}

export const ActionCard = ({ title, subTitle, ...props }: ActionCardProps) => {
  return (
    <Card theme='dark' elevate size='$3' bordered {...props}>
      <Card.Header padded>
        <H2>{title}</H2>
        <Paragraph theme='alt2'>{subTitle}</Paragraph>
      </Card.Header>
      <Card.Footer padded display='inline-flex' justifyContent='flex-end'>
        {props.children}
      </Card.Footer>
    </Card>
  )
}
