interface InputProps {
  size: 'large' | 'small' | 'free';
  onClick: () => void;
}
export default function Input({ size, onClick }: InputProps) {
  const sizes = {
    large: { width: 'w-[5.1875rem]', height: 'h-[2rem]', paddingY: 'py-[0.5625rem]' },
    small: { width: 'w-[84px]', height: 'h-[1.75rem]', paddingY: 'py-[0.4375rem]' },
    free: { width: 'w-full', height: 'h-full', paddingY: 'py-[0.4375rem]' },
  };
  const { width, height, paddingY } = sizes[size];
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[0.25rem] border border-gray30 bg-white px-[1.9375rem] text-center ${paddingY} ${height} ${width} text-[0.625rem] text-violet`}
      onClick={onClick}
    >
      입력
    </button>
  );
}
