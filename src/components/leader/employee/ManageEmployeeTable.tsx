import { cusDispatch, cusSelector } from '@/redux_store/cusHooks';
import { ErrorTableRow } from '@/utils/ErrorTableRow';
import { FC, useState } from 'react'

import { StatusBtn } from '@/utils/StatusBtn'
import { BiEdit } from 'react-icons/bi';
import { RiTableAltLine } from "react-icons/ri";
import { EmployeePermissionForm } from '../forms/EmployeePermission';
import { GetLeaderEmployeeTabAccess } from '@/redux_store/employee/employeeApi';
import { employeeSlice } from '@/redux_store/employee/employeeApiSlice';
import { sliceData } from '@/utils/TableWrapper';

interface ManageEmployeeTableProps {
  searchStr: string
  handleEdit: (value: any) => void
  changeActiveStatus: (value: any) => void
  curPageNo?: any
  filterDataCount?: any
}

export const ManageEmployeeTable: FC<ManageEmployeeTableProps> = ({ searchStr, handleEdit, changeActiveStatus, curPageNo, filterDataCount }) => {
  const [showAdd, setShowAdd] = useState(false)
  const { employees } = cusSelector((state) => state.employee);
  const dispatch = cusDispatch();
  const searchFilterFunction = (text: string) => {
    if (text) {
      const newData = employees?.filter(
        function (item: any) {
          const itemData = item?.["fullname"] ? item?.["fullname"].toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      )
      return sliceData(newData, curPageNo, filterDataCount)
    } else {
      return sliceData(employees, curPageNo, filterDataCount)
    };
  }


  return (
    <>
      <table className='w-full my-8 border'>
        <thead>
          <tr className='border-b border-gray-300'>
            <th className='font-semibold text-left py-2 pl-2 border'>S.No</th>
            <th className='font-semibold capitalize text-left py-2 pl-2 border'>
              Name
            </th>
            <th className='font-semibold capitalize text-left py-2 pl-2 border'>
              Phone No.
            </th>
            <th className='font-semibold capitalize text-left py-2 pl-2 border'>
              Location
            </th>
            <th className='font-semibold capitalize text-left py-2 pl-2 border'>
              Status
            </th>
            <th className='font-semibold capitalize text-left py-2 pl-2 border'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {searchFilterFunction(searchStr)?.length > 0 ? (
            searchFilterFunction(searchStr)?.map((el: any, i: number) => {
              return (
                <tr key={i} className={`bg-white py-2 border-b border-gray-300 transition-all`}>
                  <td className='border-r align-text-center text-center'>
                    {i + 1}.
                  </td>
                  <td className='capitalize text-left border-r px-2 align-text-center'>
                    {el.fullname}
                  </td>
                  <td className='capitalize text-left border-r px-2 align-text-center'>
                    {el.phoneno}
                  </td>
                  <td className='capitalize text-left border-r px-2 align-text-center'>
                    {el.location}
                  </td>
                  <td className='text-center border printHide'>
                    <StatusBtn
                      status={el.isactive ? '1' : '0'}
                      clickHandler={() => { changeActiveStatus(el?.id) }}
                      inProgress={false}
                    />
                  </td>
                  <td className='py-2 pl-2 border printHide'>
                    <button className='hover:scale-110 transition-all ease-out duration-200 active:scale-100' onClick={() => handleEdit(el)}>
                      <BiEdit className='text-2xl' />
                    </button>
                    <button className='hover:scale-110 transition-all ease-out duration-200 ml-2 active:scale-100' onClick={async () => {
                      const data = await GetLeaderEmployeeTabAccess(el?.id)
                      if (data) {
                        dispatch(employeeSlice.actions.setemployeaccess({ ...data, eid: el?.id }))
                        setShowAdd(true)
                      }
                    }}>
                      <RiTableAltLine className='text-2xl' />
                    </button>
                  </td>
                </tr>
              )
            })
          ) : (
            <ErrorTableRow colNo={6} />
          )}
        </tbody>
      </table>



      {showAdd && (
        <EmployeePermissionForm
          heading="Access Tabs"
          submitting={false}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  )
}
