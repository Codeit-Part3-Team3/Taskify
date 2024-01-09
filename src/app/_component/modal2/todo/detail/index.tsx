'use client';
import Image from 'next/image';
import ModalOutside from '../../_component/modalOutside';
import { DetailIconButton } from '../../../modal/toDoCard/detail/DetailComponent';
import { DetailMainContent } from '../../../modal/toDoCard/detail/DetailComponent';
import { DetailAssignee } from '../../../modal/toDoCard/detail/DetailComponent';
import CommentInput from '../../../InputForm/CommentInput';
import { DetailCardComment } from '../../../modal/toDoCard/detail/DetailComponent';
import { SkeletonUIAboutComments } from '../../../modal/toDoCard/SkeletonForComments';
import ModalPortal from '../../_component/modalPortal';
import { useRef } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { openPopOverState } from '@/src/app/_recoil/CardAtom';
import { commentsStateAboutCardId } from '@/src/app/_recoil/CardAtom';
import { axiosInstance } from '@/src/app/_util/axiosInstance';
import { CommentType2 } from '../../../modal/toDoCard/detail/DetailComponent';
import useObserver from '@/src/app/_hook/useObserver';
import { ToDoCardDetailProps } from '../../../modal/toDoCard/type';
import { useParams } from 'next/navigation';
import { detailTodoAboutCardId } from '@/src/app/_recoil/ModalAtom/todoAtom';
import InputForm from '../../../InputForm';
import { FieldValues } from 'react-hook-form';

export default function DetailToDo2({ cardId, columnId }: { cardId: number; columnId: number }) {
  const [nowCursorId, setNowCursorId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [observerLoading, setObserverLoading] = useState(false);
  const [cardData, setCardData] = useState<ToDoCardDetailProps | null>(null);

  const setIsOpenPopOver = useSetRecoilState(openPopOverState);
  const [comments, setComments] = useRecoilState(commentsStateAboutCardId(cardId));
  const setIsOpenDetailTodoModal = useSetRecoilState(detailTodoAboutCardId(cardId));

  const target = useRef(null);

  const getComments = useCallback(async () => {
    if (nowCursorId === null) return;
    try {
      setIsLoading(true);
      const cursorQuery = nowCursorId ? `cursorId=${nowCursorId}&` : '';
      const res = await axiosInstance.get(`comments?${cursorQuery}cardId=${cardId}`);
      const { comments } = res.data;
      const { cursorId } = res.data;
      setComments((oldComments: CommentType2[]) => [...(oldComments || []), ...comments]);
      setNowCursorId(cursorId);
      setIsLoading(false);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowCursorId, cardId]);

  const params = useParams();

  const handleClose = () => setIsOpenDetailTodoModal(false);

  const onSubmitCreateComment = async (form: FieldValues) => {
    try {
      const res = await axiosInstance.post('comments', {
        ...form,
        columnId,
        cardId,
        dashboardId: Number(params.dashboardId),
      });
      setComments((prev: CommentType2[]) => [, ...(prev ? prev : []), res.data]);
    } catch (error) {
    } finally {
    }
  };

  const handleKebab = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpenPopOver((prev) => !prev);
  };

  const handleKebabClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpenPopOver(false);
  };

  const arriveAtIntersection: IntersectionObserverCallback = (entries) => {
    if (entries[0].isIntersecting && !observerLoading) {
      setObserverLoading(true);
      getComments().then(() => {
        setObserverLoading(false);
      });
    }
  };
  const handleRenderCard = async () => {
    try {
      const res = await axiosInstance.get(`cards/${cardId}`);

      const newData = res.data;
      setCardData(newData);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    handleRenderCard();
    return () => {
      setNowCursorId('');
      setComments([]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useObserver({
    target,
    callback: arriveAtIntersection,
    id: nowCursorId,
  });

  if (!cardData) return;
  return (
    <>
      <ModalPortal>
        <ModalOutside closeModal={handleClose}>
          <div
            className='hide-scrollbar relative flex max-h-[80%] flex-col gap-4 overflow-scroll rounded-lg border bg-white sm:w-[20.4375rem] sm:px-[1.25rem] sm:pb-[2.5rem] md:w-[42.5rem] md:gap-6 md:px-[1.75rem] md:pb-[2rem] lg:w-[45.625rem]'
            onClick={handleKebabClose}
          >
            <div className='sticky top-0 z-[2] flex w-full justify-between bg-white sm:pt-[2.5rem] md:pt-[2rem]'>
              <span className='flex text-[1.5rem] font-bold text-black'>{cardData.title}</span>
              <DetailIconButton handleKebab={handleKebab} cardId={cardId} />
            </div>
            <div className='flex flex-col-reverse justify-between md:flex-row'>
              <div className='md:w-[26.25rem] lg:w-[28.125rem]'>
                <DetailMainContent columnId={columnId} tags={cardData.tags} description={cardData.description} />
                <div className='mb-[1.1875rem] flex sm:w-[17.9375rem] md:mb-6 md:w-full'>
                  {cardData.imageUrl && (
                    <Image
                      sizes='100vw'
                      width={100}
                      height={100}
                      style={{ width: '100%', height: 'auto' }}
                      src={cardData.imageUrl}
                      alt='imageUrl'
                      priority
                    />
                  )}
                </div>
                <InputForm onSubmit={onSubmitCreateComment}>
                  <CommentInput id='content' placeholder='댓글을 입력해주세요' label='댓글'></CommentInput>
                </InputForm>
                {isLoading ? (
                  <SkeletonUIAboutComments />
                ) : comments && Array.isArray(comments) ? (
                  [...comments].map((comment, index) => (
                    <DetailCardComment key={comment?.id || `comment-${index}`} data={comment} cardId={cardId} />
                  ))
                ) : null}

                {nowCursorId === null ? null : <div ref={target}></div>}
              </div>
              <DetailAssignee assignee={cardData.assignee} dueDate={cardData.dueDate} />
            </div>
          </div>
        </ModalOutside>
      </ModalPortal>
    </>
  );
}