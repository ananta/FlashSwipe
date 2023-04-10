import React, { useEffect } from 'react'
import { Input, YStack, Label, Text, SizableText } from 'tamagui'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'

import { LogoItem } from 'components/Logo'
import { Layout } from 'components/Layout'
import { NavProps } from 'types/NavTypes'
import { Button } from 'components/Button'
import { useStore } from 'store'
import { IUserCredentials, IUserProfile } from 'store/authSlice'

const RegisterScreen: React.FC<NavProps> = ({ navigation }) => {
  const { register, isLoading, isSuccess } = useStore((state) => state)
  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
    setFocus,
  } = useForm<IUserProfile & IUserCredentials>({
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      password: '',
    },
  })

  const handleRegister: SubmitHandler<IUserCredentials & IUserProfile> = (
    newUser
  ) => register(newUser)

  useEffect(() => {
    if (!isLoading && isSuccess) {
      resetForm()
    }
  }, [isSuccess, isLoading])

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
            <>
              <Label>First Name</Label>
              <Input
                borderWidth={2}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                autoCapitalize='none'
                returnKeyType='next'
                returnKeyLabel='next'
                onSubmitEditing={() => setFocus('last_name')}
              />
              {errors.first_name && (
                <SizableText size='$3' theme='alt1' color='red'>
                  This is required
                </SizableText>
              )}
            </>
          )}
          name='first_name'
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <Label>Last Name</Label>
              <Input
                ref={ref}
                borderWidth={2}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize='none'
                returnKeyType='next'
                returnKeyLabel='next'
                onSubmitEditing={() => setFocus('username')}
              />
              {errors.last_name && (
                <SizableText size='$3' theme='alt1' color='red'>
                  This is required
                </SizableText>
              )}
            </>
          )}
          name='last_name'
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <Label>Username</Label>
              <Input
                ref={ref}
                borderWidth={2}
                onBlur={onBlur}
                onChangeText={onChange}
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
            </>
          )}
          name='username'
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <Label>Password</Label>
              <Input
                ref={ref}
                borderWidth={2}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize='none'
                returnKeyType='done'
                returnKeyLabel='done'
                onSubmitEditing={handleSubmit(handleRegister)}
              />
              {errors.password && (
                <SizableText size='$3' theme='alt1' color='red'>
                  This is required
                </SizableText>
              )}
            </>
          )}
          name='password'
        />
        <Button
          theme='purple'
          mt='$2'
          onPress={handleSubmit(handleRegister)}
          isLoading={isLoading}
        >
          Register
        </Button>

        <Label>
          Already have an Account?{' '}
          <Text color={'skyblue'} onPress={() => navigation.navigate('Login')}>
            Login here
          </Text>
        </Label>
      </YStack>
    </Layout>
  )
}

export default RegisterScreen
