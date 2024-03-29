'use client'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { EmerginLeaderInfo } from './components/EmergingLeaderInfo'
import Link from 'next/link'
import { cusSelector, cusDispatch } from '@/redux_store/cusHooks'
import { tryCatch } from '@/config/try-catch'
import { submitLeaderForm } from '@/redux_store/APIFunctions'
import { leaderActions } from '@/redux_store/leader/leaderSlice'
import { commonActions } from '@/redux_store/common/commonSlice'
import { ToastType } from '@/constants/common'
import { UserDetails } from '@/utils/typesUtils'
import { ProtectedRoutes } from '@/constants/routes'
import { LeaderPoliticalInfo } from './components/LeaderPoliticalInfo'

const PoliticalInformationPage: FC = () => {
  const { leaderOptions } = cusSelector((state) => state.common);
  const { leaderProfile } = cusSelector((state) => state.leader);
  const dispatch = cusDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
  } = useForm<UserDetails>()

  const formSubmitHandler = async (data: UserDetails) => {
    const resBody: UserDetails = {
      ...data,
      done_any_political_activity: data.doneAnyPoliticalActivity === 'yes' ? true : false,
      is_participated_in_elections: data.participatedInElection === 'yes' ? true : false,
      does_family_supports: data.familySupportedForPolitics === 'yes' ? true : false,
      is_prepare_for_elections: data.isprepareforelections === 'yes' ? true : false,
      is_nominated: data.rajyaSabhaNominated === 'yes' ? true : false,
      is_hold_ministry: data?.hasMinistry === 'yes' ? true : false
    };

    tryCatch(
      async () => {
        const response = await submitLeaderForm({ ...leaderProfile, political_info: { ...resBody, } });
        if (response?.success) {
          dispatch(leaderActions.setLeaderProfile({ political_info: { ...resBody, } }));
          dispatch(commonActions.showNotification({ type: ToastType.SUCCESS, message: response.message }))
        } else {
          dispatch(commonActions.showNotification({ type: ToastType.ERROR, message: response.message }))
        }
      }
    );
  }

  return (
    <form
      className='grid grid-cols-2 gap-x-4 gap-y-5'
      onSubmit={handleSubmit(formSubmitHandler)}
    >
      <h2 className='text-4xl font-semibold col-span-full mb-5'>
        Political Information
      </h2>

      {leaderProfile?.leadertype == "emerging leader" ?
        <EmerginLeaderInfo
          assemblyConstituency={leaderOptions.assemblies}
          parliamentaryConstituency={leaderOptions.parliamentries}
          states={leaderOptions.states}
          designations={leaderOptions?.designations}
          parties={leaderOptions?.politicalparty}
          control={control}
          errors={errors}
          register={register}
          setValue={setValue}
          watch={watch}
          reset={reset}
        />
        :
        <LeaderPoliticalInfo
          watch={watch}
          reset={reset}
          setValue={setValue}
          register={register}
          assemblyConstituency={leaderOptions.assemblies}
          parliamentaryConstituency={leaderOptions.parliamentries}
          states={leaderOptions.states}
          designations={leaderOptions?.designations}
          parties={leaderOptions?.politicalparty}
          control={control}
          ministries={leaderOptions?.ministries}
          errors={errors}
        />

      }

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
  )
}

export default PoliticalInformationPage
