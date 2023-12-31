'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Tag from '@/src/app/_component/Chip/Tag';
import { ToDoCardDetailProps } from '@/src/app/_component/modal/toDoCard/type';
import circle from '@/public/icons/Ellipse 54.svg';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { columnState, commentsStateAboutCardId } from '@/src/app/_recoil/CardAtom';
import formatTime from '@/src/app/_util/formatTime';
import { axiosInstance } from '@/src/app/_util/axiosInstance';
// 할 일 카드 상세 모달은 내용이 너무 많아서 일단 분리해 놓았습니다
import ProfileImage from '@/src/app/(afterLogin)/_component/ProfileImage';
import ProfileImageContainer from '@/src/app/(afterLogin)/_component/ProfileImage/ProfileImageContainer';
import { UserDataType } from '@/src/app/_constant/type';
import Kebab from '@/src/app/_component/Icons/Kebab';
import CloseIcon from '@/src/app/_component/Icons/CloseIcon';
interface DetailIconButtonProps {
  handleKebab: (e: React.MouseEvent<HTMLElement>) => void;
  onUpdate: (cardData: ToDoCardDetailProps) => void;
  isOpenPopOver: boolean;
  onClose: () => void;
  onDelete: (e: React.MouseEvent<HTMLDivElement>) => void;
  cardData: ToDoCardDetailProps;
}

export function DetailIconButton({
  handleKebab,
  isOpenPopOver,
  onUpdate,
  onDelete,
  onClose,
  cardData,
}: DetailIconButtonProps) {
  return (
    <div className='flex items-center gap-1 sm:right-[0.75rem] sm:top-[0.75rem] md:right-[1.75rem] md:top-[2rem] md:gap-[1.5rem]'>
      <span onClick={handleKebab} className=' relative h-[1.75rem] w-[1.75rem] '>
        <Kebab />
        {isOpenPopOver ? (
          <div
            className='absolute right-2 top-full z-10 h-[5.125rem] w-[5.8125rem] rounded-[0.375rem] border border-[#d9d9d9] bg-white p-[0.375rem] shadow-md dark:border-black60 dark:bg-black90'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <p
              onClick={() => onUpdate(cardData)}
              className='m-auto whitespace-nowrap rounded-[0.25rem] border border-white px-[1rem] py-[0.25rem] text-[0.875rem] hover:bg-violet8 hover:text-violet dark:border-0 dark:hover:bg-black80 dark:hover:text-white8'
            >
              수정하기
            </p>
            <p
              onClick={onDelete}
              className=' mt-[0.375rem] whitespace-nowrap rounded-[0.25rem] border border-white px-[1rem] py-[0.25rem] text-[0.875rem] hover:bg-violet8 hover:text-violet dark:border-0 dark:hover:bg-black80 dark:hover:text-white8'
            >
              삭제하기
            </p>
          </div>
        ) : null}
      </span>
      <span onClick={onClose} className=' relative h-[2.125rem] w-[2.125rem]'>
        <CloseIcon />
      </span>
    </div>
  );
}
// column 넣을려면 대쉬보드아이디를 내려줘야됨
export function DetailMainContent({
  tags,
  description,
  columnId,
}: {
  tags: string[];
  description: string;
  columnId: number;
}) {
  const columns = useRecoilValue(columnState);
  const newColumn = columns.find((column) => column.id === columnId);
  return (
    <>
      <div className='flex gap-[1.25rem]'>
        <div className=' flex items-start gap-[1.25rem] text-[0.625rem] md:text-[0.75rem]'>
          <span>
            {
              <div className='flex flex-shrink-0 items-center rounded-[6.25rem] bg-[#F1EFFD] px-[0.5rem] py-[0.25rem]'>
                <div className='flex gap-[0.375rem] overflow-hidden'>
                  <Image src={circle} alt='circle' width={6} height={6} priority />
                  <span className='whitespace-nowrap text-violet'>{newColumn?.title}</span>
                </div>
              </div>
            }
          </span>
          {tags.length !== 0 && <span className='h-5 w-0 border-[0.0625rem] border-gray30' />}
        </div>
        <div className='flex flex-wrap gap-[0.375rem]'>
          {tags.map((tag) => (
            <Tag content={tag} key={tag} />
          ))}
        </div>
      </div>
      <div className='flex flex-wrap py-4 text-[0.875rem]'>{description}</div>
    </>
  );
}

interface DetailAssignee {
  assignee: { profileImageUrl: string; nickname: string; id: number };
  dueDate: string;
}

export function DetailAssignee({ assignee, dueDate }: DetailAssignee) {
  return (
    <div className=' mb-4 h-fit rounded-[0.5rem] border border-gray30 p-[1rem] sm:flex sm:w-[100%] sm:items-center sm:justify-between md:flex md:w-[11.25rem] md:flex-col md:items-start md:justify-start md:gap-[1.25rem] lg:w-[12.5rem]'>
      <div className='flex flex-col gap-[0.375rem]'>
        <span className='text-[0.75rem] font-semibold leading-5'>담당자</span>
        <div className='flex items-center  gap-[0.3125rem]'>
          <ProfileImageContainer userId={assignee.id} size='large'>
            <ProfileImage profileImageUrl={assignee.profileImageUrl} nickname={assignee.nickname} />
          </ProfileImageContainer>
          <span>{assignee?.nickname}</span>
        </div>
      </div>
      <div className='flex flex-col gap-[0.375rem]'>
        <span className='text-[0.75rem] font-semibold leading-5'>마감일</span>
        <span>{dueDate}</span>
      </div>
    </div>
  );
}

export interface CommentType2 {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  cardId: number;
  author: {
    profileImageUrl: string;
    nickname: string;
    id: number;
  };
}
export function DetailCardComment({ data, cardId }: { data: CommentType2; cardId: number }) {
  // const userInfo = useRecoilValue(userInfoState);
  // const { id:  } = userInfo;
  const [userId, setUserId] = useState<number | null>(null);
  const [value, setValue] = useState(data ? data.content : '');
  const [isUpdate, setIsUpdate] = useState(false);
  const setComments = useSetRecoilState(commentsStateAboutCardId(cardId));

  const updateComments = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const res = await axiosInstance.put(`comments/${data.id}`, {
      content: value,
    });

    setComments((oldComments: CommentType2[]) => {
      if (oldComments) {
        return oldComments.map((comment) => (comment?.id === data?.id ? { ...res.data } : comment));
      }
      return null;
    });
    setIsUpdate(false);
  };

  const deleteComments = async () => {
    await axiosInstance.delete(`comments/${data.id}`);
    setComments((oldComments: CommentType2[]) =>
      oldComments ? oldComments.filter((comment) => comment?.id !== data?.id) : [],
    );
  };

  const handleRenderUpdateComment = () => {
    setIsUpdate(true);
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLElement>) => {
    e.stopPropagation();
    setValue((e.target as HTMLInputElement).value);
  };

  const userDataObject = localStorage.getItem('taskifyUserData');
  useEffect(() => {
    if (userDataObject) {
      const userData: UserDataType = JSON.parse(userDataObject);
      const loginId = userData.userInfo.id;
      setUserId(loginId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) return;

  return (
    <div className='mt-4 flex gap-[0.625rem] md:mt-5'>
      {!isUpdate && (
        <div className='flex flex-col items-start'>
          {data?.author?.profileImageUrl && (
            <ProfileImageContainer userId={data?.author.id} size='large'>
              <ProfileImage profileImageUrl={data?.author.profileImageUrl} nickname={data?.author.nickname} />
            </ProfileImageContainer>
          )}
        </div>
      )}
      <div className='flex w-full flex-col gap-[0.375rem]'>
        <div className='flex gap-[0.5rem]'>
          <span className='text-[0.875rem] font-semibold'>{data?.author?.nickname}</span>
          <span className='text-[0.75rem] text-[#9fa6b2]'>{formatTime(data && (data.createdAt as string))}</span>
        </div>
        {isUpdate ? (
          <div className='my-2 flex flex-col items-center gap-[0.375rem] md:w-[37.5rem] lg:w-[40.625rem]'>
            <input
              id='content2'
              type='text'
              className='w-full border-b-2 border-black focus:outline-none dark:border-white8 dark:bg-black90'
              placeholder='댓글을 입력해 주세요'
              defaultValue={data.content}
              onBlur={handleOnBlur}
            />
            <div className='flex w-full justify-end gap-2'>
              <button
                type='button'
                className='w-14 rounded-full px-2 py-1 hover:bg-gray20 dark:hover:bg-black60'
                onClick={() => {
                  setIsUpdate(false);
                }}
              >
                취소
              </button>
              <button className='w-14 rounded-full bg-violet px-2 py-1   text-white' onClick={updateComments}>
                수정
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className='text-[0.875rem]'>{data?.content}</p>
            <div className='flex gap-[0.75rem]'>
              {data?.author?.id === (userId as number) ? (
                <>
                  <span className='text-[0.75rem] text-[#9fa6b2] underline' onClick={handleRenderUpdateComment}>
                    수정
                  </span>
                  <span className='text-[0.75rem] text-[#9fa6b2] underline' onClick={deleteComments}>
                    삭제
                  </span>
                </>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 댓글 수정 누르면 해당 댓글 부분의 내용영역만 input 필드로 바꿔야될까 음... input 위치가 좀 애매하네요
