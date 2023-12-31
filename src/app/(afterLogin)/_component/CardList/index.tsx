'use client';

import settingIcon from '@/public/icons/settings_icon.svg';
import Card from '@/src/app/(afterLogin)/_component/Card';
import AddTodo from '@/src/app/_component/Button/AddTodo';
import Number from '@/src/app/_component/Chip/Number';
import { axiosInstance } from '@/src/app/_util/axiosInstance';
import Image from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Colors } from '@/src/app/(afterLogin)/_constant/color';
import { FieldValues } from 'react-hook-form';
import useRenderModal from '@/src/app/_hook/useRenderModal';
import { useSetRecoilState } from 'recoil';
import { MODALTYPE } from '@/src/app/_constant/modalType';
import { CardInfo } from '@/src/app/(afterLogin)/_constant/type';
import useInfiniteScroll from '@/src/app/_hook/useInfiniteScroll';
import { isAxiosError } from 'axios';
import { DraggableStateSnapshot, DraggableProvided, Draggable } from 'react-beautiful-dnd';
import {
  cardStateAboutColumn,
  columnState,
  countAboutCardList,
  showColumnModalStateAboutId,
} from '@/src/app/_recoil/CardAtom';
interface CardListProps {
  id: number;
  title: string;
  boardId: string;
}

export function CardList({ id, title, boardId }: CardListProps) {
  const [cards, setCards] = useRecoilState<CardInfo[] | []>(cardStateAboutColumn(id));
  const [cardNumCount, setCardNumCount] = useRecoilState<number>(countAboutCardList(id));
  const setShow = useSetRecoilState(showColumnModalStateAboutId(id));
  const [cursorId, setCursorId] = useState('');
  const [modalType, callModal, setModalType] = useRenderModal();
  const setColumns = useSetRecoilState(columnState);
  const target = useRef<HTMLDivElement>(null);

  const getCard = useCallback(async () => {
    const query = cursorId ? `cursorId=${cursorId}&` : '';
    const { data } = await axiosInstance.get(`cards?${query}columnId=${id}`);
    setCards((prev) => [
      ...prev,
      ...(data.cards as CardInfo[]).sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()),
    ]);
    setCardNumCount(data.totalCount);
    setCursorId(data.cursorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorId]);
  // 할 일 카드 생성 모달 서브밋 함수
  const onSubmitForCreateToDo = async (form: FieldValues) => {
    let errorOccurred = false;
    try {
      const res = await axiosInstance.post('cards', { ...form, dashboardId: +boardId, columnId: +id });
      setCards((prev) => [...(prev || []), res.data]);
      setCardNumCount((prev) => (prev ? prev + 1 : 1));
    } catch (error) {
      errorOccurred = true;
      if (isAxiosError(error)) {
        const serverErrorMessage = error.response?.data.message;
        return callModal({ name: serverErrorMessage ? serverErrorMessage : error.message });
      }
    } finally {
      if (!errorOccurred) {
        setModalType(null);
      }
    }
  };

  // 할 일 카드 생성 모달 호출 함수
  const handleRenderCreateTodoModal = () => {
    callModal({ name: '할 일 생성', onSubmit: onSubmitForCreateToDo, columnId: id });
  };
  // 칼럼 수정을 위한 서브밋 함수
  const onSubmitForUpdateColumn = async (form: FieldValues) => {
    let errorOccurred = false;
    try {
      const res = await axiosInstance.put(`columns/${id}`, { ...form });
      setColumns((oldColumns) => oldColumns.map((column) => (column.id === id ? { ...res.data } : column)));
    } catch (error) {
      errorOccurred = true;
      if (isAxiosError(error)) {
        const serverErrorMessage = error.response?.data.message;
        return callModal({ name: serverErrorMessage ? serverErrorMessage : error.message });
      }
    } finally {
      if (!errorOccurred) {
        setModalType(null);
      }
    }
  };

  // 칼럼 수정 모달 호출을 위한 함수

  const handleRenderUpdateColumn = () => {
    callModal({
      name: '칼럼 관리',
      onSubmit: onSubmitForUpdateColumn,
      columnId: id,
    });
    setShow(true);
  };

  const onIntersect: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        getCard();
      }
    });
  };

  useInfiniteScroll({ target, onIntersect: onIntersect, size: cursorId });

  const getStyle = (style: DraggableProvided['draggableProps']['style'], snapshot: DraggableStateSnapshot) => {
    if (!snapshot.isDragging) return {};
    if (!snapshot.isDropAnimating) {
      return style;
    }

    return {
      ...style,
      transitionDuration: `0.001s`,
    };
  };

  useEffect(() => {
    return () => setCards([]);
  }, [setCards]);

  return (
    <div className='md:min-w-none hide-scrollbar relative flex flex-1 flex-col gap-[1.0625rem] bg-gray10 px-3 py-4 text-black dark:bg-black md:w-full md:gap-[1.5625rem] md:p-5 lg:h-full lg:min-w-[22.125rem] lg:flex-col lg:gap-0 lg:overflow-scroll lg:pt-0'>
      <div className='flex flex-col gap-4 bg-gray10 dark:bg-black md:gap-6 lg:sticky lg:top-0 lg:z-10 lg:pb-4 lg:pt-5'>
        <div className='flex items-center gap-2'>
          <span
            className={`flex h-2 w-2 items-center justify-center rounded-3xl bg-violet text-[0.75rem] text-white`}
          ></span>
          <div className='flex items-center gap-3 text-[1rem] font-bold dark:text-white8 md:text-[1.125rem]'>
            <h3>{title}</h3>
            <Number num={cardNumCount} />
          </div>
          <button
            id={MODALTYPE.COLUMN.UPDATE}
            className='relative ml-auto h-[1.375rem] w-[1.375rem] md:h-[1.5rem] md:w-[1.5rem]'
            onClick={handleRenderUpdateColumn}
          >
            <Image src={settingIcon.src} fill alt='설정 아이콘' />
          </button>
        </div>
        <div className='h-[2rem] md:h-[2.5rem]'>
          <AddTodo screen='mobile' id={MODALTYPE.TODO.CREATE} onClick={handleRenderCreateTodoModal} />
        </div>
      </div>
      <div className='flex flex-col justify-center gap-[0.625rem] md:gap-4'>
        {cards.map((card, index) => (
          <Draggable draggableId={card.id.toString()} index={index} key={card.id}>
            {({ innerRef, draggableProps, dragHandleProps }, snapshot) => (
              <div ref={innerRef} {...draggableProps} style={getStyle(draggableProps.style, snapshot)}>
                <div {...dragHandleProps}>
                  <Card
                    id={card.id}
                    title={card.title}
                    columnId={id}
                    tags={card.tags}
                    dueDate={card.dueDate}
                    imageUrl={card.imageUrl}
                    bgColor={Colors[card.id % 5]}
                    nickname={card.assignee?.nickname}
                    profileImageUrl={card.assignee?.profileImageUrl}
                  />
                </div>
              </div>
            )}
          </Draggable>
        ))}
      </div>
      {cursorId !== null && <div className='h-4 flex-shrink-0' ref={target}></div>}
      {modalType}
    </div>
  );
}
