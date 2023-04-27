import { Label, Separator, SizeTokens, Switch, XStack } from 'tamagui'

interface ISwitchWithLabel {
  size: SizeTokens
  label: string
  checked?: boolean
  onCheckChange: () => void
}

export const SwitchWithLabel: React.FC<ISwitchWithLabel> = ({
  size,
  label,
  checked,
  onCheckChange,
}) => {
  const id = `switch-${size.toString().slice(1)}`
  return (
    <XStack
      width={'100%'}
      justifyContent='space-between'
      alignItems='center'
      space='$4'
      paddingHorizontal='$4'
      paddingVertical='$2'
    >
      <Label
        paddingRight='$0'
        minWidth={90}
        justifyContent='flex-end'
        size={size}
        htmlFor={id}
      >
        {label}
      </Label>
      <Separator minHeight={20} vertical />
      <Switch
        id={id}
        size={size}
        onCheckedChange={onCheckChange}
        checked={checked}
      >
        <Switch.Thumb animation='quick' theme={'dark'} />
      </Switch>
    </XStack>
  )
}
