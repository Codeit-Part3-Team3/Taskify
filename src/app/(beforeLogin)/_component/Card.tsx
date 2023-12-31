interface Props {
  value: {
    src: string;
    title: string;
    description: string;
  };
}

export default function Card({ value }: Props) {
  const { src, title, description } = value;
  return (
    <div className='w-[21.4375rem] sm:w-[23.625rem]'>
      <div
        className={`${src} flex h-[14.7454rem] items-center justify-center overflow-hidden rounded-t-lg bg-contain sm:h-[16.25rem]`}
      ></div>
      <div className='flex h-[7.0324rem] flex-col justify-center gap-[1.125rem] rounded-b-lg bg-gray10 px-8 dark:bg-black sm:h-[7.75rem]'>
        <h3 className='text-[1.125rem] font-bold'>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
