import { FC, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import { motion as m } from 'framer-motion'
import { DownloadExcelButton } from './ExcelConverter'
import { FaFileExcel } from 'react-icons/fa'
import { GenerateId } from './utility'

interface TableWrapperProps {
  heading: string
  children: JSX.Element
  addBtnClickFn: () => void
  addBtnTitle: string
  totalCount: number
  subTotalCount?: number // applicable to some components like parliamentary constituency and assembly constituency
  filterDataCount: number
  changeFilterFn: (val: number) => void
  changePageNo: (val: number) => void
  curPageNo: number
  curDataCount: number
  searchFilterFn: (str: string) => void
  addedFilters?: JSX.Element[]
  searchFilters?: JSX.Element[]
  moreBtns?: JSX.Element[]
  jsonDataToDownload?: unknown[]
  conditionalData?: { jsx: JSX.Element }
  fixedBtnsAtTopRight?: JSX.Element[]
}

const SortFilterKey = GenerateId()

export const TableWrapper: FC<TableWrapperProps> = ({
  children,
  heading,
  addBtnClickFn,
  addBtnTitle,
  totalCount,
  filterDataCount,
  changeFilterFn,
  changePageNo,
  curPageNo,
  addedFilters,
  searchFilterFn,
  moreBtns,
  searchFilters,
  subTotalCount,
  jsonDataToDownload,
  conditionalData,
  fixedBtnsAtTopRight,
}) => {
  const searchRef = useRef<HTMLInputElement>(null)
  const paginationBtnsJSX: JSX.Element[] = []

  let totalPages = subTotalCount
    ? Math.ceil(subTotalCount / filterDataCount)
    : Math.ceil(totalCount / filterDataCount)

  if (!subTotalCount)
    totalPages = totalCount <= filterDataCount ? 0 : totalPages
  // if filter data count is greater than total data count no pagination will appear
  else totalPages = subTotalCount <= filterDataCount ? 0 : totalPages

  for (let i = 0; i < totalPages; i++) {
    paginationBtnsJSX.push(
      <button
        key={i}
        value={i + 1}
        onClick={(e) => changePageNo(+(e.target as HTMLButtonElement).value)}
        className={`py-2 px-4 text-gray-800 border-l border-r border-gray-200 ${
          curPageNo === i + 1 ? 'bg-cyan-400 border-none text-white' : ''
        }`}>
        {i + 1}
      </button>
    )
  }

  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeIn' }}
      id='box'
      className='w-[95%] m-auto relative my-7 border bg-white border-gray-300 shadow-md rounded-md py-5 px-6 max-lg:w-[98%] max-lg:my-5'>
      <div className='flex justify-between mt-4 w-full'>
        <h2 className='text-3xl font-semibold capitalize '>{heading}</h2>
        {jsonDataToDownload && (
          <DownloadExcelButton
            jsonData={jsonDataToDownload}
            className='data_download relative hover:text-cyan-500 transition-all'>
            <FaFileExcel className='text-4xl' />
            <span className='absolute top-[-100%] w-max right-0 capitalize px-4 py-1 rounded bg-cyan-500 text-cyan-50 hidden'>
              download in excel
            </span>
          </DownloadExcelButton>
        )}
        {fixedBtnsAtTopRight && (
          <div
            id='hideFixedBtn'
            className='fixed z-[200] top-[120px] right-[63px] flex items-center gap-3 bg-white p-3 shadow-md rounded'>
            {fixedBtnsAtTopRight}
          </div>
        )}
      </div>

      {/* FILTER BOX */}
      <div id='filterBox' className='flex justify-between mt-10 items-end'>
        <section className='flex flex-col gap-3'>
          {conditionalData && conditionalData.jsx}

          <h2 className='text-lg font-semibold'>Filters</h2>
          <div className='flex items-center gap-3'>
            <label htmlFor='filter' className='flex items-center gap-2'>
              <span>Sort by</span>
              <select
                id='filter'
                key={SortFilterKey}
                value={filterDataCount}
                className='py-1 px-3 text-md outline-none border border-gray-300 text-gray-900 bg-white rounded-md cursor-pointer'
                onChange={(e) => changeFilterFn(+e.target.value.toLowerCase())}>
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value={totalCount && totalCount.toString()}>All</option>
              </select>
            </label>

            {/* EXTRA FILTERS that are not common */}
            {addedFilters}
          </div>
        </section>

        <section className='flex flex-col gap-5'>
          {/* CTA'S */}
          <div className='flex items-center justify-end gap-3'>
            {moreBtns}
            {/* ADD OR EDIT Button */}
            {addBtnTitle && (
              <button
                type='button'
                className='px-5 py-2 bg-cyan-400 text-white rounded-md text-sm capitalize transition-all outline-none hover:bg-cyan-600'
                onClick={addBtnClickFn}>
                {addBtnTitle}
              </button>
            )}
          </div>

          {/* FILTERS */}
          <div className='flex items-center gap-3 justify-end'>
            {/* SEARCH FILTER */}
            {searchFilters}
            <label className='relative'>
              <input
                type='search'
                ref={searchRef}
                onChange={(e) => searchFilterFn(e.target.value.toLowerCase())}
                className='py-1 px-3 text-md border border-gray-300 text-gray-900 bg-white rounded-md outline-none focus:bg-gray-50 focus:border-gray-400 transition-all placeholder:capitalize'
                placeholder={`Search ${heading.split(' ').at(-1)}`}
              />

              <button className='absolute top-[8px] right-2'>
                <FiSearch className='stroke-gray-400' />
              </button>
            </label>
          </div>
        </section>
      </div>

      {/* CONTENT */}
      {children}

      {/* Bottom nav */}
      <section className='flex justify-between items-start mt-10'>
        <p className='text-gray-500'>{totalCount} entries found</p>

        {/* PAGINATION */}
        {totalPages > 0 && (
          <>
            <nav className='flex items-center overflow-hidden border-gray-300 border rounded-md'>
              {curPageNo !== 1 && (
                <button
                  onClick={() => {
                    changePageNo(curPageNo - 1)
                  }}
                  className='py-2 px-3 hover:bg-slate-100 transition'>
                  Previous
                </button>
              )}
              {curPageNo > filterDataCount && (
                <button
                  onClick={() => {
                    changePageNo(curPageNo - filterDataCount)
                  }}
                  className={`py-2 px-4 border-l border-r border-gray-200 hover:bg-cyan-500 hover:text-cyan-50`}>
                  - {filterDataCount}
                </button>
              )}
              <button
                className={`py-2 px-4 border-l border-r border-gray-200 bg-cyan-500 text-cyan-50`}>
                {curPageNo}
              </button>
              {curPageNo < totalPages - filterDataCount && (
                <button
                  onClick={() => {
                    changePageNo(curPageNo + filterDataCount)
                  }}
                  className={`py-2 px-4 border-l border-r border-gray-200 hover:bg-cyan-500 hover:text-cyan-50`}>
                  + {filterDataCount}
                </button>
              )}
              {curPageNo !== totalPages && (
                <button
                  onClick={() => {
                    changePageNo(curPageNo + 1)
                  }}
                  className='py-2 px-3 hover:bg-slate-100 transition-all'>
                  Next
                </button>
              )}
            </nav>
          </>
        )}
      </section>
    </m.section>
  )
}
