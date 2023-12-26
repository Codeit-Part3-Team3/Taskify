'use client';
import useRenderModal from '@/src/app/_hook/useRenderModal';
import Image from 'next/image';
import { useState } from 'react';
import DropdownAndFilter from '../../dropdown/filter';
import InputForm from '../../InputForm';
import { DetailAssignee, DetailCardComment, DetailIconButton, DetailMainContent } from './DetailComponent';
import AddImageFile from '@/src/app/(afterLogin)/_component/AddImageFile';
import { axiosInstance } from '@/src/app/_util/axiosInstance';
import { FieldValues } from 'react-hook-form';
interface TodoProps {
  mainTitle: string;
}

// 할 일 카드 생성 모달 내용
export function CreateToDo({ mainTitle }: TodoProps) {
  return (
    <>
      <span className='font-Pretendard text-[1.5rem] font-bold'>{mainTitle}</span>
      <DropdownAndFilter />
      <InputForm.TextInput label='제목' placeholder='제목을 입력해주세요' id='title' isRequired={true} />
      <InputForm.TextInput label='설명' placeholder='설명을 입력해주세요' id='description' isRequired={true} />
      <InputForm.DateInput label='마감일' id='dueDate' placeholder='날짜 선택' />
      <InputForm.TagInput label='태그' id='tags' placeholder='입력 후 Enter' />
      <AddImageFile size='big' />
    </>
  );
}
// 할 일 카드 수정 모달 내용
export function UpdateToDo({ mainTitle, cardData }: { mainTitle: string; cardData: ToDoCardDetailProps }) {
  cardData;
  return (
    <>
      <span className='font-Pretendard text-[1.5rem] font-bold'>{mainTitle}</span>
      <DropdownAndFilter />
      <InputForm.TextInput
        label='제목'
        placeholder='제목을 입력해주세요'
        id='title'
        isRequired={true}
        initialValue='기본값'
      />
      <InputForm.TextInput
        label='설명'
        placeholder='설명을 입력해주세요'
        id='description'
        isRequired={true}
        initialValue='기본값'
      />
      <InputForm.DateInput label='마감일' id='dueDate' placeholder='날짜 입력' initialDate={new Date('2023-12-24')} />
      <InputForm.TagInput label='태그' id='tags' placeholder='입력 후 Enter' initialTags={['기본값']} />
      <InputForm.TagInput label='이미지' id='imageUrl' placeholder='아직 이미지인풋이 없네용' />
    </>
  );
}

// 할 일 카드 삭제 모달 내용
export function DeleteTodo({ mainTitle }: TodoProps) {
  return (
    <>
      <span className='flex items-center justify-center text-[1rem] font-medium text-black'>{mainTitle}</span>
    </>
  );
}

export const cardData = {
  id: 1,
  title: '일정 관리 Taskify 프로젝트',
  description: '안녕안녕안녕',
  tags: ['프론트엔드', '넥스트'],
  dueDate: '2022.12.31',
  assignee: {
    profileImageUrl: '/icons/circleProfile.svg',
    nickname: '미녀기',
    id: 0,
  },
  imageUrl: '/images/hero.png',
  columnId: 0,
  createdAt: '2023-12-21T04:12:30.578Z',
  updatedAt: '2023-12-21T04:12:30.578Z',
};

export interface ToDoCardDetailProps {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  imageUrl: string;
  assignee: { profileImageUrl: string; nickname: string; id: number };
}

// 할 일 카드 상세 모달 내용
export function DetailToDo({ cardData, onClose }: { cardData: ToDoCardDetailProps; onClose: () => void }) {
  const { title, description, tags, dueDate, assignee, imageUrl } = cardData;
  const [isOpenPopOver, setIsOpenPopOver] = useState(false);
  const [modalType, callModal] = useRenderModal();

  const handleSubmit = async (form: FieldValues) => {
    try {
      const res = await axiosInstance.put('cards/60', { ...form });

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const RenderUpdatedoModal = (e: React.MouseEvent<HTMLDivElement>, cardData: ToDoCardDetailProps) => {
    if (typeof callModal === 'function') {
      callModal({ name: (e.target as HTMLElement).id, onSubmit: handleSubmit, cardData });
    }
  };

  const RenderDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof callModal === 'function') {
      callModal({ name: (e.target as HTMLElement).id });
    }
  };

  const handleKebab = () => setIsOpenPopOver(true);

  const handleClick = () => {};
  return (
    <>
      {modalType ? (
        <>{modalType}</>
      ) : (
        <>
          <div className='fixed left-0 top-0 z-[1000] flex h-[100vh] w-[100vw] items-center justify-center bg-black bg-opacity-70'>
            <div
              className=' relative flex flex-col gap-[1rem] rounded-[0.5rem] border border-white bg-white sm:w-[20.4375rem]
              sm:px-[1.25rem] sm:py-[2.5rem] md:w-[42.5rem] md:px-[1.75rem] md:py-[2rem] lg:w-[45.625rem]'
            >
              <DetailIconButton
                handleKebab={handleKebab}
                onUpdate={RenderUpdatedoModal}
                onDelete={RenderDeleteModal}
                isOpenPopOver={isOpenPopOver}
                onClose={onClose}
                cardData={cardData}
              />
              <span className='flex text-[1.5rem] font-bold text-black'>{title}</span>
              <div className=' sm:flex  sm:flex-col-reverse md:flex md:flex-row md:justify-between'>
                <DetailMainContent tags={tags} description={description} />
                <DetailAssignee assignee={assignee} dueDate={dueDate} />
              </div>
              <div className=' flex flex-col gap-[1.5rem]  sm:w-[17.9375rem] md:w-[28.125rem]'>
                <div className='relative flex sm:h-[8.3125rem] sm:w-[17.9375rem] md:h-[16.375rem] md:w-[28.125rem]'>
                  {imageUrl && <Image src={imageUrl} fill alt='imageUrl' />}
                </div>
                <InputForm.CommentInput
                  id='comment'
                  label='댓글'
                  initialValue='기본값'
                  handleClick={handleClick}
                  placeholder='댓글을 입력해 주세요'
                />
                <DetailCardComment />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
