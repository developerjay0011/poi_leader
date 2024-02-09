import { CommonBox } from '@/utils/CommonBox'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { BsGenderFemale, BsGenderMale, BsStars } from 'react-icons/bs'
import { FaFacebook, FaInstagram, FaRedhat } from 'react-icons/fa'
import { RiUserHeartLine } from 'react-icons/ri'
import { AiOutlineUser } from 'react-icons/ai'
import { IoMdShare } from 'react-icons/io'
import { BiLocationPlus } from 'react-icons/bi'

interface GeneralInfoBoxProps {}

export const GeneralInfoBox: FC<GeneralInfoBoxProps> = () => {
  const socialNetworks: JSX.Element[] = [
    <Link
      target='_blank'
      href={'https://www.facebook.com'}
      className=' text-sky-950 text-[1.6rem]'
      key={Math.random()}>
      <FaFacebook />
    </Link>,
    <Link
      target='_blank'
      href={'https://www.instagram.com'}
      className=' text-sky-950 text-[1.6rem]'
      key={Math.random()}>
      <FaInstagram />
    </Link>,
  ]

  return (
    <>
      <CommonBox title='Political Info'>
        <div className='grid grid-cols-2 py-5 gap-y-5 max-[550px]:grid-cols-1'>
          <GeneralInfo Icon={BiLocationPlus} heading='Place of birth'>
            <p className='text-[14px] pl-7 text-justify'>
              Supaul in a Gandhavariya Rajput Family in Bihar
            </p>
          </GeneralInfo>

          <GeneralInfo Icon={AiOutlineUser} heading="Father's name">
            <p className='text-[14px] pl-7 text-justify'>
              Haldhar Prasad Singh
            </p>
          </GeneralInfo>

          <GeneralInfo Icon={AiOutlineUser} heading="Mother's name">
            <p className='text-[14px] pl-7 text-justify'>Chandrakala Devi</p>
          </GeneralInfo>

          <GeneralInfo Icon={FaRedhat} heading='education'>
            <p className='text-[14px] pl-7 text-justify'>B.A Pass</p>
          </GeneralInfo>

          <GeneralInfo Icon={RiUserHeartLine} heading='Marital Status'>
            <div className='text-[14px] pl-7 text-justify flex flex-col'>
              <p>Married</p>
              <p>Shiela Singh</p>
              <p className='text-[13px]'>(27 February 1975)</p>
            </div>
          </GeneralInfo>

          <div className=''>
            <GeneralInfo Icon={BsGenderMale} heading='no of sons'>
              <p className='text-[14px] pl-7 text-justify'>1</p>
            </GeneralInfo>

            <GeneralInfo Icon={BsGenderFemale} heading='no of daughters'>
              <p className='text-[14px] pl-7 text-justify'>1</p>
            </GeneralInfo>
          </div>

          <GeneralInfo Icon={BsStars} heading='work and experience'>
            <p className='text-[14px] pl-7 text-justify'>5 years</p>
          </GeneralInfo>

          <GeneralInfo Icon={IoMdShare} heading='social networks'>
            <div className='flex gap-3 mt-2 items-center pl-6'>
              {socialNetworks}
            </div>
          </GeneralInfo>
        </div>
      </CommonBox>
    </>
  )
}

const GeneralInfo: FC<{
  Icon: JSX.ElementType
  heading: string
  children: ReactNode
}> = ({ Icon, children, heading }) => {
  return (
    <>
      <article className='flex flex-col gap-1'>
        <h5 className='flex items-center gap-3'>
          <Icon className='text-[1rem]' />

          <span className='font-[500] capitalize text-[15px]'>{heading}</span>
        </h5>

        {children}
      </article>
    </>
  )
}