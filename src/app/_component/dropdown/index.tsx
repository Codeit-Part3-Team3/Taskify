'use client';
import check from '@/public/icons/check.svg';
import { useInputField } from '@/src/app/_component/InputForm/InputStyle';
import { axiosInstance } from '@/src/app/_util/axiosInstance';
import Image from 'next/image';
import { MouseEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import circle from '@/public/icons/Ellipse 54.svg';
import { useRecoilState } from 'recoil';
import { dashboardIdState } from '@/src/app/_recoil/CardAtom';
import ArrowDown from '@/src/app/_component/Icons/ArrowDown';
interface Column {
  id: number;
  title: string;
  teamId: string;
  dashboardId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Dropdown({ column }: { column?: number }) {
  const [focus, setFocus] = useState(false); // 인풋 포커스 여부
  const [openDropdown, setOpenDropdown] = useState(false); // 드롭다운 개폐여부
  const [curretValue, setCurrentValue] = useState<string>(''); // 인풋에 대한 입력값 참조
  const [columnId, setColumnId] = useState<number | null>(Number(column) || null); // 담당자 ID (클릭 시 체크표시 렌더링 + REACT-HOOK-FORM 이용하신다길래 그대로 유지)
  const [dropdownList, setDropdownList] = useState<Column[] | null>(null);
  const [dashboardId] = useRecoilState(dashboardIdState);

  const { register } = useInputField('columnId', {});
  const { setValue } = useFormContext();

  // 드롭 다운 내 사용자 클릭을 받아서, 담당자로 지정
  const handleOnChangeDropdown = (e: MouseEvent<HTMLSpanElement>, id: number) => {
    const { innerText } = e.target as HTMLElement;
    setCurrentValue(innerText);
    setOpenDropdown(false);
    setColumnId(+id);
    setValue('columnId', +id);
  };

  // 각 종 동적 UI

  const handleOpenDropdown = () => {
    setFocus(!focus);
    setOpenDropdown(!openDropdown);
  };

  useEffect(() => {
    const getMember = async () => {
      const res = await axiosInstance.get(`columns?dashboardId=${dashboardId}`);
      const { data } = res.data;
      if (column) {
        const MemberForUpdate: Column[] = data?.filter((dropdown: Column) => {
          return dropdown.id === column;
        });
        const [newMember] = MemberForUpdate;
        const newColumn = newMember.title;
        setCurrentValue(newColumn);
      }
      setDropdownList(data);
    };

    getMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column]);

  return (
    <div className='relative flex w-full flex-col items-start gap-[0.625rem] dark:text-white8 md:w-[13.5625rem]'>
      <label className='md:text-[1.125rem]'>상태</label>
      <div className='flex w-full flex-col items-start gap-[0.125rem]'>
        <span className='relative h-[3rem] w-full'>
          <div
            className={
              'flex w-full items-center gap-[0.8rem] rounded-[0.375rem] border border-gray-300 px-[1rem] py-[0.625rem] outline-none md:h-[3rem] md:w-[13.5625rem] ' +
              (focus ? 'border-violet' : 'border-gray-300')
            }
          >
            {dropdownList?.filter((dropdown) => {
              dropdown.title === curretValue;
            }) ? (
              <div className='flex items-center rounded-full bg-[#F1EFFD] px-[0.5rem] py-[0.25rem]'>
                <div className='flex gap-[0.375rem]'>
                  <Image src={circle} alt='circle' width={6} height={6} />
                  <span className='text-[0.625rem] text-violet md:text-[0.75rem]'>{curretValue}</span>
                </div>
              </div>
            ) : (
              <span className='text-[1rem]'>{curretValue}</span>
            )}
          </div>

          <input className='hidden' value={Number(columnId) as number} id='columnId' {...register} />
          <div onClick={handleOpenDropdown} className='absolute right-[1rem] top-[0.625rem] h-[1.625rem] w-[1.625rem]'>
            <ArrowDown />
          </div>
        </span>

        {openDropdown ? (
          <div
            className={
              'absolute top-[100%] z-50 mt-[2px] flex w-full flex-col gap-[0.9375rem] rounded-[0.375rem] border border-gray-300 bg-white px-[1rem] py-[0.625rem] outline-none dark:bg-black90'
            }
          >
            {dropdownList?.map((column) => {
              return (
                <ColumnOption
                  key={column.id}
                  name={column.title}
                  columnId={columnId as number}
                  id={column.id}
                  onClick={handleOnChangeDropdown}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// 받아온 데이터에 있는 요소들을 표현한 컴포넌트
export const ColumnOption = ({
  onClick,
  name,
  id,
  columnId,
}: {
  onClick: (e: MouseEvent<HTMLSpanElement>, userId: number) => void;
  name: string;
  id: number;
  columnId: number;
}) => {
  const handleSelectDropdown = (e: MouseEvent<HTMLSpanElement>) => {
    onClick(e, id);
  };
  return (
    <>
      {name ? (
        <div className=' flex items-center gap-[0.375rem]' onClick={handleSelectDropdown}>
          {columnId === id ? (
            <Image src={check} alt='check' width={22} height={22} />
          ) : (
            <div className='w-[1.375rem]'></div>
          )}
          <div className='flex items-center rounded-full bg-[#F1EFFD] px-[0.5rem] py-[0.25rem]'>
            <div className='flex gap-[0.375rem]'>
              <Image src={circle} alt='circle' width={6} height={6} />
              <span className='text-[0.625rem] text-violet md:text-[0.75rem]' id={name}>
                {name}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
