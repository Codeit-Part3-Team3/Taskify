'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Link from 'next/link';
import Crown from '@/src/app/_component/Icons/Crown';
import HeaderButton from '@/src/app/(afterLogin)/_component/Header/HeaderButton';
import add from '@/public/images/add_box_icon.svg';
import manage from '@/public/images/manage_icon.svg';
import ProfileCollection from '@/src/app/(afterLogin)/_component/ProfileImgCollection';
import HeaderDropdown from '@/src/app/(afterLogin)/_component/Header/HeaderDropdown';
import { userInfoState } from '@/src/app/_recoil/AuthAtom';
import HeaderProfile from '@/src/app/(afterLogin)/_component/Header/HeaderProfile';
import { UserDataType } from '@/src/app/_constant/type';
import { dropdownState } from '@/src/app/_recoil/Dropdown';
import { dashboardSelector, inviteListChange } from '@/src/app/_recoil/dashboardAtom';
import { inviteDashboardState } from '@/src/app/_recoil/ModalAtom/dashboard';
import InviteDashboard from '@/src/app/_component/modal/dashboard/invite';

export default function Header() {
  const pathname = usePathname();
  const isDisabledButtons = pathname === '/myboard' || pathname === '/mypage' || pathname === '/';
  const [folderName, setFolderName] = useState('');
  const [createdByMe, setCreatedByMe] = useState(false);
  const [userName, setUserName] = useState('');
  const [userProfileImg, setUserProfileImg] = useState<string | null>(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const userInfo = useRecoilValue(userInfoState);
  const [isActiveDropdown, setActiveDropdown] = useRecoilState(dropdownState);
  const setIsChange = useSetRecoilState(inviteListChange);

  const dashboardId = pathname.replace(/[^0-9]/g, '');
  const titleClass = !isDisabledButtons ? 'hidden lg:block' : '';
  const marginClass = isDisabledButtons ? 'ml-[5.6875rem]' : '';
  const selectDashboard = useRecoilValue(dashboardSelector(dashboardId));
  const [isOpenInviteDashboard, setIsOpenInviteDashBoard] = useRecoilState(inviteDashboardState);
  const getFolderName = (pathname: string) => {
    switch (pathname) {
      case '/myboard':
        setFolderName('내 대시보드');
        setCreatedByMe(false);
        break;
      case '/mypage':
        setFolderName('계정 관리');
        setCreatedByMe(false);
        break;
    }
  };

  useEffect(() => {
    if (selectDashboard) {
      setFolderName(selectDashboard.title);
      setCreatedByMe(selectDashboard.createdByMe);
    }
    getFolderName(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, selectDashboard]);

  // 하이드레이션 워닝을 방지하기 위한 코드
  useEffect(() => {
    const userDataObject = localStorage.getItem('taskifyUserData');
    if (userDataObject) {
      const userData: UserDataType = JSON.parse(userDataObject);
      const nickname = userData?.userInfo?.nickname;
      const profileImg = userData?.userInfo?.profileImageUrl;
      setUserName(nickname);
      setUserProfileImg(profileImg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const openInviteModal = () => setIsOpenInviteDashBoard(true);

  return (
    <div className='relative z-[11]'>
      <div className='fixed left-0 right-0 top-0 h-[4.375rem] border-b-[.0625rem] bg-white dark:border-black60 dark:bg-black90'>
        <div className=' flex h-full items-center justify-between'>
          {/* 헤더영역 왼쪽 */}
          <div className={`${marginClass} justify-end md:ml-[12.5rem] lg:ml-[21.25rem]`}>
            <div className='flex items-center gap-2'>
              <div className={`text-black30 text-xl font-bold ${titleClass} dark:text-white8`}>{folderName}</div>
              {createdByMe && <Crown className='hidden lg:block' />}
            </div>
          </div>
          {/* 헤더영역 오른쪽 */}
          <div className='flex'>
            {!isDisabledButtons && selectDashboard?.createdByMe && (
              <div className='flex gap-[.375rem] md:gap-4'>
                <Link href={`${pathname.includes('edit') ? pathname : pathname + '/edit'}`}>
                  <HeaderButton imageSrc={manage}>관리</HeaderButton>
                </Link>
                <HeaderButton imageSrc={add} onClick={openInviteModal}>
                  초대하기
                </HeaderButton>
              </div>
            )}
            {!isDisabledButtons && (
              <div
                className='ml-3 md:ml-6 lg:ml-8 '
                onMouseOver={() => setProfileDropdown(true)}
                onMouseLeave={() => setProfileDropdown(false)}
              >
                <ProfileCollection dashboardId={dashboardId} userId={userInfo.id} profileDropdown={profileDropdown} />
              </div>
            )}
            {!isDisabledButtons && (
              <div className=' mr-3 h-[2.375rem] w-0 rounded-md border-[.0625rem] stroke-gray30 stroke-1 md:mr-6 lg:mr-8'></div>
            )}
            <div
              className='relative mr-[.75rem] flex cursor-pointer items-center gap-3 md:mr-[2.5rem] lg:mr-[5rem]'
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown((prev) => !prev);
              }}
            >
              <HeaderProfile nickName={userName} profileImg={userProfileImg} />
              <div className='text-1 text-black30 hidden font-medium dark:text-white8 md:block'>{userName}</div>
            </div>
          </div>
        </div>
        {isActiveDropdown && (
          <HeaderDropdown
            isActive={isActiveDropdown}
            onClick={(e) => {
              e?.stopPropagation();
              setActiveDropdown(false);
            }}
          />
        )}
      </div>
      {isOpenInviteDashboard && <InviteDashboard dashboardId={dashboardId} setIsChange={setIsChange} />}
    </div>
  );
}
