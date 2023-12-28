'use client';
import dropdown from '@/public/icons/arrow_drop_down_icon.svg';
import check from '@/public/icons/check.svg';
import { useInputField } from '@/src/app/_component/InputForm/InputStyle';
import { axiosInstance } from '@/src/app/_util/axiosInstance';
import Image from 'next/image';
import { ChangeEvent, FocusEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface Admin {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  userId: number;
}

export default function DropdownAndFilter({
  assignee,
}: {
  assignee?: { profileImageUrl: string; nickname: string; id: number };
}) {
  const [focus, setFocus] = useState(false); // 인풋 포커스 여부
  const [openDropdown, setOpenDropdown] = useState(false); // 드롭다운 개폐여부
  const [curretValue, setCurrentValue] = useState<string>(assignee?.nickname || ''); // 인풋에 대한 입력값 참조
  const [assignId, setAssignId] = useState((Number(assignee?.id) as number) || null); // 담당자 ID (클릭 시 체크표시 렌더링 + REACT-HOOK-FORM 이용하신다길래 그대로 유지)
  const [isSelectionComplete, setIsSelectionComplete] = useState(false); // 인풋에 이름 입력 다하거나 OR 드롭다운 내부에 있는 이름 클릭하면 TRUE가됨+ 인풋이 DIV로 바뀜 (IMG와 이름 가져오기 위해)
  const [dropdownList, setDropdownList] = useState<Admin[] | null>(null);

  const { register } = useInputField('assigneeUserId', {});
  const { setValue } = useFormContext();

  const inputRef = useRef<HTMLInputElement>(null);

  // input 태그의 사용자 입력을 받고, 받아온 데이터의 요소들과 입력 값이 일치하는 경우 해당 요소 담당자로 지정
  const handleOnChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setOpenDropdown(true);
    setCurrentValue(e.target.value);
    if (!dropdownList) return;
    dropdownList.filter((admin) => {
      if (admin.nickname === e.currentTarget.value) {
        setIsSelectionComplete(true);
        setAssignId(admin.userId);
        setValue('assigneeUserId', +admin.userId);
        setOpenDropdown(false);
      }
    });
    if (e.target.value === '') {
      setOpenDropdown(false);
    }
  };

  // 드롭 다운 내 사용자 클릭을 받아서, 담당자로 지정
  const handleOnChangeDropdown = (e: MouseEvent<HTMLSpanElement>, id: number) => {
    const { innerText } = e.target as HTMLElement;
    console.log(e.target);
    setCurrentValue(innerText);
    setOpenDropdown(false);
    setAssignId(id);
    setIsSelectionComplete(true);
    setValue('assigneeUserId', +id);
  };

  // 사용자 입력 받을 시 Dropdown filter 기능

  const SearchAdminName = (dropdownList as Admin[])?.filter((admin) => {
    if (!dropdownList) return;
    if (dropdownList.length > 0) {
      if (admin.nickname.includes(curretValue)) {
        return true;
      }
    } else {
      return dropdownList;
    }
  });

  // 각 종 동적 UI
  const handleRenderInputBox = () => setIsSelectionComplete(false);
  const handleInputFocus = () => setFocus(true);
  const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setFocus(false);
    setOpenDropdown(false);
  };
  const handleOpenDropdown = () => {
    setFocus(!focus);
    setOpenDropdown(!openDropdown);
  };

  // const idToNickname = () => {
  //   if (assignee === null) return;

  //   const idForUpdate = dropdownList?.filter((dropdown) => dropdown.id === assignee);
  //   if (idForUpdate) setCurrentValue(idForUpdate[0]?.nickname);
  // };
  // 담당자 지정 후 수정을 위해 DIV박스 누르면 INPUT으로 바꾸고, 인풋창에 바로 포커스 (이렇게 안하면 두 번 클릭해야 포커스가 됨)
  useEffect(() => {
    const getMember = async () => {
      const res = await axiosInstance.get('members?dashboardId=14');
      const { members } = res.data;
      setDropdownList(members);
    };

    getMember();
    // idToNickname();
  }, []);

  useEffect(() => {
    if (!isSelectionComplete && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isSelectionComplete]);

  return (
    <div className='flex w-[13.5625rem] flex-col items-start gap-[0.625rem]'>
      <label className='text-[1.125rem] text-black'>담당자</label>
      <div className='flex flex-col items-start gap-[0.125rem]'>
        <span className='relative'>
          {isSelectionComplete ? (
            <div
              onClick={handleRenderInputBox}
              className={
                'flex w-[13.5625rem] items-center gap-[0.8rem] rounded-[0.375rem] border border-gray-300 px-[1rem]  py-[0.625rem]  outline-none ' +
                (focus ? 'border-violet' : 'border-gray-300')
              }
            >
              {assignee ? <Image src={assignee.profileImageUrl} alt='circleLogo' width={26} height={26} /> : null}
              <span className='text-[1rem]'>{curretValue}</span>
            </div>
          ) : (
            <input
              placeholder='이름을 입력해주세요'
              ref={inputRef}
              value={curretValue}
              onChange={handleOnChangeInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className={
                'flex h-[3rem] w-[13.5625rem] items-center gap-[0.8rem] rounded-[0.375rem] border border-gray-300  px-[1rem]  py-[0.625rem]  outline-none ' +
                (focus ? 'border-violet' : 'border-gray-300')
              }
            />
          )}
          <input className='hidden' value={Number(assignId) as number} id='assigneeUserId' {...register} />
          <div onClick={handleOpenDropdown} className='absolute right-[1rem] top-[0.625rem] h-[1.625rem] w-[1.625rem]'>
            <Image fill src={dropdown} alt='dropdown' />
          </div>
        </span>

        {openDropdown && SearchAdminName?.length ? (
          <div
            className={
              '  z-50 flex w-full flex-col gap-[0.9375rem] rounded-[0.375rem] border border-gray-300 px-[1rem] py-[0.625rem] outline-none'
            }
          >
            {SearchAdminName?.map((admin) => {
              return (
                <AdminOption
                  key={admin.id}
                  name={admin.nickname}
                  assignId={assignId as number}
                  userId={admin.userId}
                  onClick={handleOnChangeDropdown}
                  profile={admin.profileImageUrl}
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
export const AdminOption = ({
  onClick,
  name,
  userId,
  assignId,
  profile,
}: {
  onClick: (e: MouseEvent<HTMLSpanElement>, userId: number) => void;
  name: string;
  userId: number;
  assignId: number;
  profile: string | null;
}) => {
  const handleSelectDropdown = (e: MouseEvent<HTMLSpanElement>) => {
    onClick(e, userId as number);
  };
  return (
    <>
      {name ? (
        <div className='  flex items-center gap-[0.375rem]'>
          {assignId === userId ? (
            <Image src={check} alt='check' width={22} height={22} />
          ) : (
            <div className='w-[1.375rem]'></div>
          )}
          <div className='flex  gap-[0.5rem]'>
            {profile ? <Image src={profile} alt='circleLogo' width={26} height={26} /> : null}
            <span onClick={handleSelectDropdown} className='text-[1rem]' id={name}>
              {name}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};
