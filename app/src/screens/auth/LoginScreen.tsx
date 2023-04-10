import React, { Fragment } from 'react'
import { Input, YStack, Label, Text, SizableText } from 'tamagui'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { useStore } from 'store'
import { Button } from 'components/Button'
import { LogoItem } from 'components/Logo'
import { Layout } from 'components/Layout'
import { NavProps } from 'types/NavTypes'
import { IUserCredentials } from 'store/authSlice'

const LoginScreen: React.FC<NavProps> = ({ navigation }) => {
  const { login, isLoading } = useStore((state) => state)
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<IUserCredentials>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const handleLogin: SubmitHandler<IUserCredentials> = (credentials) =>
    login(credentials)

  return (
    <Layout>
      <YStack p='$3' space='$2'>
        <LogoItem />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Fragment>
              <Label>Username</Label>
              <Input
                ref={ref}
                borderWidth={2}
                onBlur={onBlur}
                onChangeText={onChange}
                disabled={isLoading}
                value={value}
                autoCapitalize='none'
                returnKeyType='next'
                returnKeyLabel='next'
                onSubmitEditing={() => setFocus('password')}
              />
              {errors.username && (
                <SizableText size='$3' theme='alt1' color='red'>
                  This is required
                </SizableText>
              )}
            </Fragment>
          )}
          name='username'
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Fragment>
              <Label>Password</Label>
              <Input
                ref={ref}
                borderWidth={2}
                onBlur={onBlur}
                onChangeText={onChange}
                disabled={isLoading}
                value={value}
                autoCapitalize='none'
                returnKeyType='done'
                onSubmitEditing={handleSubmit(handleLogin)}
              />
              {errors.password && (
                <SizableText size='$3' theme='alt1' color='red'>
                  This is required
                </SizableText>
              )}
            </Fragment>
          )}
          name='password'
        />
        <Label>
          Forgot Password ? {` `}
          <Text color={'skyblue'} onPress={() => navigation.navigate('Login')}>
            Reset Here
          </Text>
        </Label>
        <Button
          theme='purple'
          mt='$2'
          onPress={handleSubmit(handleLogin)}
          isLoading={isLoading}
        >
          Sign in
        </Button>
        <Button theme='alt2' onPress={() => navigation.navigate('Register')}>
          Register
        </Button>
      </YStack>
    </Layout>
  )
}

export default LoginScreen
