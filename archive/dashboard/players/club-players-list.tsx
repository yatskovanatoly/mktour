'use client';

import Empty from '@/components/empty';
import { useClubPlayers } from '@/components/hooks/query-hooks/use-club-players';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import SkeletonList from '@/components/skeleton-list';
import { Card } from '@/components/ui/card';
import { User } from 'lucia';
import { FC } from 'react';

const ClubPlayersList: FC<{ userId: string }> = ({ userId }) => {
  const user = useUser(userId);
  if (!user.data) return <></>;
  return <ClubPlayersListContent user={user.data} />;
};

const ClubPlayersListContent: FC<{ user: User }> = ({ user }) => {
  const players = useClubPlayers(user.selected_club);

  if (players.status === 'pending' || players.status === 'error')
    return <SkeletonList length={4} />;
  if (players.data?.length < 1) return <Empty />;

  return (
    <div className="flex flex-col gap-2">
      {players.data.map(({ nickname, rating, last_seen, id }) => {
        const lastSeen = getFormmatedLastSeen(last_seen);
        const realname = 'Real Name';
        return (
          <Card
            key={id}
            className="flex items-center justify-between truncate p-4"
          >
            <div className="flex flex-col truncate">
              <span>{nickname}</span>
              <span className="text-xs">{realname && `(${realname})`}</span>
              <span className="text-muted-foreground text-xs">
                last seen: {lastSeen}
              </span>
            </div>
            <div className="text-2xl">{rating}</div>
          </Card>
        );
      })}
    </div>
  );
};

// FIXME !!! that's what INTL is for ffs !!!
const getFormmatedLastSeen = (num: number | null) => {
  if (!num || num < 1) {
    return `today`;
  }
  if (num >= 1) {
    return `${num} day${num > 1 && 's'} ago`;
  }
};

export default ClubPlayersList;
