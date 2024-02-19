'use client'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import {
  UserDetails,
} from '@/utils/typesUtils'
import { Input } from '@/components/Input'
import { YesNoField } from '@/components/YesNoField'
import Link from 'next/link'
import { cusDispatch, cusSelector } from '@/redux_store/cusHooks'
import { commonActions } from "@/redux_store/common/commonSlice";
import { getLeadersOptions } from '@/redux_store/common/commonAPI'
import { submitLeaderForm } from '@/redux_store/APIFunctions'
import { leaderActions } from '@/redux_store/leader/leaderSlice'
import { tryCatch } from '@/config/try-catch'
import { ContactInfo } from '@/interfaces/leader'
import { ToastType } from '@/constants/common'
import { ProtectedRoutes } from '@/constants/routes'
export const ContactForm: FC = () => {
  const { leaderProfile } = cusSelector((state) => state.leader);
  const { leaderOptions } = cusSelector((state) => state.common);
  const dispatch = cusDispatch();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<UserDetails>({
    defaultValues: {
      bothAddressIsSame: 'yes',
    },
    mode: 'onTouched',
  });

  const bothAddressIsSame = watch('bothAddressIsSame');
  const pAddress = watch('pAddress');
  const pState = watch('pState');
  const pDistrict = watch('pDistrict');
  const pPincode = watch('pPincode');
  const cState = watch('cState');

  const formSubmitHandler = async(data: UserDetails) => {
    const resBody: ContactInfo = {
      permanent_address: data?.pAddress,
      permanent_state_id: data?.pState,
      permanent_district_id: data?.pDistrict,
      permanent_pincode: data?.pPincode,
      is_same_as_permanent: data?.bothAddressIsSame == "yes" ? true :false,
      present_address: data?.cAddress,
      present_state_id: data?.cState,
      present_district_id: data?.cDistrict,
      present_pincode: data?.cPincode,
      telephones: data?.telePhoneNos,
      mobile_nos: data?.mobileNos,
      fb_link: data?.fb_link,
      insta_link: data?.insta_link,
      twitter_link: data?.twitter_link,
    };

    tryCatch(
      async () => {
        const response = await submitLeaderForm({
          ...leaderProfile,
          'contact_info': resBody,
          political_info: {
            ...leaderProfile?.political_info?.activity_pictures,
            activity_pictures: leaderProfile?.political_info?.activity_pictures || []
          }
        });
    
        if (response?.success) {
          // Update only contact info in redux store
          dispatch(leaderActions.setLeaderProfile({
            contact_info: resBody
          }));
          dispatch(commonActions.showNotification({ type: ToastType.SUCCESS, message: response.message }))
        } else {
          dispatch(commonActions.showNotification({ type: ToastType.ERROR, message: response.message }))
        }
      }
    );
  }

  useEffect(() => {
    (async () => {
      const LeadersDropdown = await getLeadersOptions();
      dispatch(commonActions.setLeaderOptions(LeadersDropdown));
    })();
  }, [dispatch]);

  useEffect(() => {
    setValue('pAddress', leaderProfile?.contact_info?.permanent_address || '');
    setValue('pState', leaderProfile?.contact_info?.permanent_state_id || '');
    setValue('pDistrict', leaderProfile?.contact_info?.permanent_district_id || '');
    setValue('pPincode', leaderProfile?.contact_info?.permanent_pincode || '');
    setValue('bothAddressIsSame', leaderProfile?.contact_info?.is_same_as_permanent ?'yes':'no');
    setValue('cAddress', leaderProfile?.contact_info?.present_address || '');
    setValue('cState', leaderProfile?.contact_info?.present_state_id || '');
    setValue('cDistrict', leaderProfile?.contact_info?.present_district_id || '');
    setValue('cPincode', leaderProfile?.contact_info?.present_pincode || '');
    setValue('telePhoneNos', leaderProfile?.contact_info?.telephones || '');
    setValue('mobileNos', leaderProfile?.contact_info?.mobile_nos || '');
    setValue('fb_link', leaderProfile?.contact_info?.fb_link || '');
    setValue('insta_link', leaderProfile?.contact_info?.insta_link || '');
    setValue('twitter_link', leaderProfile?.contact_info?.twitter_link || '');
  }, [leaderProfile, setValue]);
  
  return (
    <>
      <form
        className='grid grid-cols-3 gap-x-4 gap-y-5'
        onSubmit={handleSubmit(formSubmitHandler)}>
        <h2 className='text-4xl font-semibold col-span-full mb-5'>
          Contact Information
        </h2>

        <h3 className='col-span-full text-xl font-semibold'>
          Permanent Address
        </h3>

        <label
          htmlFor={`pAddress`}
          className='col-span-full flex flex-col gap-2'>
          <span>
            Full Address <strong className='text-red-500'>*</strong>
          </span>
          <textarea
            {...register(`pAddress`, {
              required: 'Address is required',
            })}
            placeholder=''
            id={`pAddress`}
            className={`resize-none w-full h-full text-base py-2 px-3 rounded-md outline-none border ${
              errors.pAddress
                ? 'bg-red-100 text-red-500 border-red-400'
                : 'focus:border-gray-300 focus:bg-gray-100 border-gray-200 text-gray-700 bg-gray-50'
            }`}
            rows={4}></textarea>
          <ErrorMessage
            as={'span'}
            errors={errors}
            name='pAddress'
            className='text-sm text-red-500'
          />
        </label>

        <Input
          errors={errors}
          register={register}
          title='State'
          id='pState'
          type='select'
          required
          validations={{
            required: 'State is required',
          }}
          selectField={{
            title: 'Select State',
            options: leaderOptions?.states.map((el) => ({
              id: el.id,
              value: el.state,
            })),
          }}
        />
        <Input
          errors={errors}
          register={register}
          title='District'
          id='pDistrict'
          type='select'
          required
          validations={{
            required: 'District is required',
          }}
          selectField={{
            title: 'Select District',
            options: leaderOptions?.districts
              .filter((el) => (pState ? el.stateid === pState : el))
              .map((el) => ({ id: el.id, value: el.district })),
          }}
        />
        <Input
          errors={errors}
          register={register}
          title='Pincode'
          id='pPincode'
          type='text'
        />

        <YesNoField
          errors={errors}
          id='bothAddressIsSame'
          question='Present and Permanent Address is Same'
          register={register}
          fullWidth
          validations={{
            onChange(e) {
              const val = e.target.value

              // If both address is same then we will set the present Addresses values to permanent Address
              if (val === 'yes') {
                // below conditions will either set the permanent address values or empty strings.
                setValue('cAddress', pAddress || '')
                setValue('cState', pState || '')
                setValue('cDistrict', pDistrict || '')
                setValue('cPincode', pPincode || '')
              } else {
                setValue('cAddress', '')
                setValue('cDistrict', '')
                setValue('cPincode', '')
                setValue('cState', '')
              }
            },
          }}
        />

        {bothAddressIsSame && bothAddressIsSame === 'no' && (
          <>
            <h3 className='col-span-full text-xl font-semibold'>
              Present Address
            </h3>

            <label
              htmlFor={`cAddress`}
              className='col-span-full flex flex-col gap-2'>
              <span>
                Full Address <strong className='text-red-500'>*</strong>{' '}
              </span>
              <textarea
                {...register(`cAddress`, {
                  required: 'Address is required',
                })}
                placeholder=''
                id={`cAddress`}
                className={`resize-none w-full h-full text-base py-2 px-3 rounded-md outline-none border ${
                  errors.cAddress
                    ? 'bg-red-100 text-red-500 border-red-400'
                    : 'focus:border-gray-300 focus:bg-gray-100 border-gray-200 text-gray-700 bg-gray-50'
                }`}
                rows={4}></textarea>
              <ErrorMessage
                as={'span'}
                errors={errors}
                name='cAddress'
                className='text-sm text-red-500'
              />
            </label>

            <Input
              errors={errors}
              register={register}
              title='State'
              id='cState'
              type='select'
              required
              validations={{
                required: 'State is required',
              }}
              selectField={{
                title: 'Select State',
                options: leaderOptions?.states.map((el) => ({
                  id: el.id,
                  value: el.state,
                })),
              }}
            />
            <Input
              errors={errors}
              register={register}
              title='District'
              id='cDistrict'
              type='select'
              required
              validations={{
                required: 'District is required',
              }}
              selectField={{
                title: 'Select District',
                options: leaderOptions?.districts
                  .filter((el) => (cState ? el.stateid === cState : el))
                  .map((el) => ({ id: el.id, value: el.district })),
              }}
            />
            <Input
              errors={errors}
              register={register}
              title='Pincode'
              id='cPincode'
              type='text'
            />
          </>
        )}

        <div className='col-span-full mt-3' />

        <Input
          type='number'
          errors={errors}
          register={register}
          id='telePhoneNos'
          title="Telephone / Landline No's"
          required
          validations={{
            required: 'Telephone No is required',
          }}
          placeholder='use "," for multiple values'
        />

        <Input
          type='number'
          errors={errors}
          register={register}
          id='mobileNos'
          title={"Mobile No's"}
          required
          validations={{
            required: 'Mobile No is required',
          }}
          placeholder='use "," for multiple values'
        />

        <Input
          errors={errors}
          register={register}
          title='Facebook Account Link'
          id={'fb_link'}
          type='url'
          placeholder='www.facebook.com/user'
        />
        <Input
          errors={errors}
          register={register}
          title='Instagram Account Link'
          id={'insta_link'}
          type='url'
          placeholder='www.instagram.com/user'
        />
        <Input
          errors={errors}
          register={register}
          title='X / Twitter Account Link'
          id={'twitter_link'}
          type='url'
          placeholder='www.twitter.com/user'
        />

        <div className='flex justify-end col-span-full gap-2 mt-5'>
          <Link
            href={ProtectedRoutes.userProfile}
            className='rounded px-6 py-2 bg-orange-200 text-orange-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 font-[500] capitalize hover:bg-orange-500 hover:text-orange-50'>
            close
          </Link>
          <button
            className='rounded px-6 py-2 bg-orange-500 text-orange-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 font-[500] capitalize'
            type='submit'>
            Save
          </button>
        </div>
      </form>
    </>
  )
}
