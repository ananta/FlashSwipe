import React from 'react'
import { Swipeable } from 'react-native-gesture-handler'
import { Card, CardProps, H5, Paragraph, XStack, YStack } from 'tamagui'

type DeckProp = {
  title: string
  subTitle: string
  renderRightActions?: (
    progressAnimatedValue: any,
    dragAnimatedValue: any,
    swipeable: Swipeable
  ) => React.ReactNode
}

type ListCardProp = CardProps & DeckProp

export function ListCard({
  title,
  subTitle,
  renderRightActions,
  ...props
}: ListCardProp) {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Card theme='dark' elevate size='$3' bordered {...props}>
        <XStack justifyContent='space-between'>
          <YStack>
            <Card.Header padded>
              {/* @ts-ignore */}
              <H5 numberOfLines={2}>{title}</H5>
              {/* @ts-ignore */}
              <Paragraph numberOfLines={1} theme='alt2'>
                {subTitle}
              </Paragraph>
            </Card.Header>
            <Card.Footer padded>
              <XStack f={1} />
            </Card.Footer>
          </YStack>
          <YStack justifyContent='center'></YStack>
        </XStack>
      </Card>
    </Swipeable>
  )
}

export function ListCardActionContainer({ children, ...props }: CardProps) {
  return (
    <Card theme='red' marginVertical='$2' elevate size='$3' bordered {...props}>
      <XStack justifyContent='space-between'>
        <YStack>
          <Card.Header padded>{children}</Card.Header>
        </YStack>
      </XStack>
    </Card>
  )
}
