import React, { PropsWithChildren } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>
);
