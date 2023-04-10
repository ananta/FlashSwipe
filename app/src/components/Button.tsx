import React from 'react';
import { ActivityIndicator } from 'react-native';
import { styled, Button as TamaButton, ButtonProps, Text } from 'tamagui';

interface IButton {
  isLoading?: boolean;
}

const ButtonText = styled(Text, {
  name: 'ButtonText',
  color: '$color',
});

export const Button: React.FC<ButtonProps & IButton> = ({
  children,
  isLoading,
  ...props
}) => {
  return (
    <TamaButton {...props}>
      {isLoading ? (
        <ActivityIndicator size='small' />
      ) : (
        <ButtonText>{children}</ButtonText>
      )}
    </TamaButton>
  );
};
