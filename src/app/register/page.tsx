import { RegisterForm } from '@/components/login_register/RegisterForm'
import { LoginLayout } from '@/layouts/LoginLayout'
import { FC } from 'react'



const RegisterPage: FC = () => {
  return (
    <>
      <LoginLayout isleaderinfo={false}>
        <RegisterForm />
      </LoginLayout>
    </>
  )
}

export default RegisterPage
