import { turboPascal } from '@/app/fonts';
import TypeIcon from '@/components/ui/type-icon';
import { RedisTournamentInfo } from '@/lib/actions';

type TournamentInfoProps = {
  data: RedisTournamentInfo;
};

export default async function TournamentInfo({ data }: TournamentInfoProps) {
  const a = 1
  return (
    <div className="p">
      <h1
        className={`${turboPascal.className} col-span-4 text-left text-3xl font-black uppercase`}
      >
        {data.title}
      </h1>
      <p className="font-light">
        {new Date(data.date).toDateString().slice(3, 15)}
      </p>
      <div></div>
      <div className="">
      <span className="flex flex-row gap-2 text-text items-center">
          <TypeIcon type={data.type} size={2} />
          {data.format}
        </span> 
        {data.user ? (
          <p className='text-sm'>created by: {data.user}</p>
        ) : (
          <p className="text-destructive">not signed in</p>
        )}
      </div>
    </div>
  );
}
