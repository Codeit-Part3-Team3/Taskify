import calendarIcon from '@/public/icons/calendar_icon.svg';
import Tag from '@/src/app/_component/Chip/Tag';
import { MODALTYPE } from '@/src/app/_constant/modalType';
import useRenderModal from '@/src/app/_hook/useRenderModal';
import { openPopOverState } from '@/src/app/_recoil/CardAtom';
import { showToDoModalStateAboutCard } from '@/src/app/_recoil/CardAtom';
import Image from 'next/image';

import { useSetRecoilState } from 'recoil';

interface CardProps {
  title: string;
  tags: string[];
  dueDate: string;
  bgColor: string;
  imageUrl: string;
  nickname: string;
  profileImageUrl: string;
  id: number;
  columnId: number;
}

export default function Card({
  title,
  tags,
  dueDate,
  bgColor,
  imageUrl,
  nickname,
  profileImageUrl,
  id,
  columnId,
}: CardProps) {
  const [modalType, callModal] = useRenderModal();
  const setShow = useSetRecoilState(showToDoModalStateAboutCard(id));
  const setIsOpenPopOver = useSetRecoilState(openPopOverState);

  // 할 일 카드 상세 모달을 호출하기 위한 함수
  const handleRenderDetaildoModal = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpenPopOver(false);

    callModal({ name: '할 일 카드 상세', cardId: id, columnId });
    setShow(true);
  };

  return (
    <>
      <div
        id={MODALTYPE.TODO.DETAIL}
        onClick={handleRenderDetaildoModal}
        className='flex flex-grow-0 flex-col gap-[0.625rem] rounded-[0.375rem] border border-gray30 bg-white px-3 py-3 dark:border-black60 dark:bg-black90 md:flex-row lg:flex-col lg:items-stretch lg:p-5'
      >
        {imageUrl && (
          <div className='flex h-full w-full items-center overflow-hidden rounded md:h-[3.3125rem] md:w-[5.6725rem] lg:h-full lg:w-full'>
            <Image
              src={imageUrl}
              sizes='100vw'
              width={0}
              height={0}
              style={{ width: '100%', height: 'auto' }}
              alt={title}
              priority
            />
          </div>
        )}
        <div className='flex flex-1 flex-col gap-[0.625rem]'>
          <div className='text-[0.875rem] text-black80 dark:text-white8 md:text-[1rem]'>{title}</div>
          <div className='flex justify-between gap-4'>
            <div className='flex flex-1 flex-col flex-wrap gap-[0.375rem] md:flex-row md:items-center md:gap-4 lg:flex-col lg:items-stretch lg:gap-[0.625rem]'>
              {tags.length > 0 && (
                <div className='flex flex-wrap gap-[0.375rem]'>
                  {tags.map((tag, index) => (
                    <Tag content={tag} key={tag + index} />
                  ))}
                </div>
              )}

              <div className='flex flex-1 justify-between'>
                <div className='flex items-center gap-[0.375rem]'>
                  <div className='relative h-[0.875rem] w-[0.875rem] md:h-[1.125rem] md:w-[1.125rem]'>
                    <Image src={calendarIcon} fill alt='달력 아이콘' />
                  </div>
                  <span className='flex text-[0.625rem] text-gray50 md:translate-y-[0.0625rem] md:text-[0.75rem]'>
                    {dueDate}
                  </span>
                </div>
                {
                  <span
                    className={`relative flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full md:h-[1.5rem] md:w-[1.5rem] ${bgColor} overflow-hidden text-[0.625rem] font-semibold text-white md:text-[0.75rem]`}
                  >
                    {profileImageUrl ? (
                      <Image
                        src={profileImageUrl}
                        sizes='100vw'
                        width={0}
                        height={0}
                        style={{ width: '100%', height: '100%' }}
                        alt={nickname}
                      />
                    ) : (
                      nickname?.[0]
                    )}
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalType}
    </>
  );
}
