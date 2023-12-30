'use client';
interface DefaultProfileProps {
  nickName: string | undefined;
  index?: number;
  colorCode?: string;
  profileImg: string;
}

export default function HeaderProfile({ nickName, index, colorCode, profileImg }: DefaultProfileProps) {
  const profileColors = ['bg-[#C4B1A2]', 'bg-[#9DD7ED]', 'bg-[#FDD446]', 'bg-[#FFC85A]'];
  let background = 'bg-[#C4B1A2]';

  if (index !== undefined) {
    background = profileColors[index % profileColors.length];
  }
  if (colorCode !== undefined) {
    background = `bg-[${colorCode}]`;
  }

  return (
    <>
      {profileImg?.length ? (
        <div
          className={`h-[2.375rem] w-[2.375rem] rounded-full`}
          style={{
            backgroundImage: `url(${profileImg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
      ) : (
        <div
          className={`flex h-[2.375rem] w-[2.375rem] items-center justify-center rounded-full ${background} font-mon  text-[1rem] font-semibold text-white`}
        >
          {nickName?.charAt(0)}
        </div>
      )}
    </>
  );
}