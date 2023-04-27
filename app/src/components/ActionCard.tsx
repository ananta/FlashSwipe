import { ReactNode } from 'react'
import { Card, CardProps, Paragraph, H2 } from 'tamagui'

interface ActionCardProps extends CardProps {
  title: string
  subTitle?: string
  children?: ReactNode
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subTitle,
  children,
  ...props
}) => {
  return (
    <Card theme='dark' elevate size='$3' bordered {...props}>
      <Card.Header padded>
        <H2>{title}</H2>
        <Paragraph theme='alt2'>{subTitle}</Paragraph>
      </Card.Header>
      <Card.Footer padded display='inline-flex' justifyContent='flex-end'>
        {children}
      </Card.Footer>
    </Card>
  )
}
