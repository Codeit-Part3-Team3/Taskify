'use client';
import close from '@/public/icons/close_icon.svg';
import CloseIcon from '@/src/app/_component/Icons/CloseIcon';
import Kebab from '@/src/app/_component/Icons/Kebab';
import {
  deleteTodoAboutCardId,
  detailTodoAboutCardId,
  openPopOverState,
  updateTodoAboutCardId,
} from '@/src/app/_recoil/ModalAtom/todo';
import { useRecoilState, useSetRecoilState } from 'recoil';

interface DetailIconButtonProps {
  handleKebab: (e: React.MouseEvent<HTMLElement>) => void;
  cardId: number;
}

export default function IconButton({ handleKebab, cardId }: DetailIconButtonProps) {
  const setIsOpenUpdateTodoModal = useSetRecoilState(updateTodoAboutCardId(cardId));
  const setIsOpenDeleteTodoModal = useSetRecoilState(deleteTodoAboutCardId(cardId));
  const setIsDetailTodoModal = useSetRecoilState(detailTodoAboutCardId(cardId));
  const [isOpenPopOver, setIsOpenPopOver] = useRecoilState(openPopOverState);

  const openUpdateTodoModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsDetailTodoModal(false);
    setIsOpenUpdateTodoModal(true);
    setIsOpenPopOver(false);
  };

  const openDeleteTodoModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsDetailTodoModal(false);
    setIsOpenDeleteTodoModal(true);
    setIsOpenPopOver(false);
  };

  const CloseModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsDetailTodoModal(false);
  };

  return (
    <div className='flex items-center gap-1 sm:right-[0.75rem] sm:top-[0.75rem] md:right-[1.75rem] md:top-[2rem] md:gap-[1.5rem]'>
      <span onClick={handleKebab} className='relative h-[1.75rem] w-[1.75rem] '>
        <Kebab />
        {isOpenPopOver ? (
          <div className='absolute right-2 top-full z-10 h-[5.125rem] w-[5.8125rem] rounded-[0.375rem] border border-[#d9d9d9] bg-white p-[0.375rem] shadow-md dark:bg-black90'>
            <p
              onClick={openUpdateTodoModal}
              className='m-auto whitespace-nowrap rounded-[0.25rem] border border-white px-[1rem] py-[0.25rem] text-[0.875rem] hover:bg-violet8 hover:text-violet dark:border-black90 dark:hover:bg-black80 dark:hover:text-white8'
            >
              수정하기
            </p>
            <p
              onClick={openDeleteTodoModal}
              className='mt-[0.375rem] whitespace-nowrap rounded-[0.25rem] border border-white px-[1rem] py-[0.25rem] text-[0.875rem] hover:bg-violet8 hover:text-violet dark:border-black90 dark:hover:bg-black80 dark:hover:text-white8'
            >
              삭제하기
            </p>
          </div>
        ) : null}
      </span>
      <span onClick={CloseModal} className='relative h-[2.125rem] w-[2.125rem]'>
        {close && <CloseIcon />}
      </span>
    </div>
  );
}
