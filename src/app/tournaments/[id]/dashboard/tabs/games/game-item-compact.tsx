import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentSetGameResult from '@/components/hooks/mutation-hooks/use-tournament-set-game-result';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import useOutsideClick from '@/components/hooks/use-outside-click';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Result as ResultModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLongPress } from 'use-long-press';

const GameItemCompact: FC<GameProps> = ({
  id,
  result,
  playerLeft,
  playerRight,
}) => {
  const draw = result === '1/2-1/2';
  const leftWin = result === '1-0';
  const rightWin = result === '0-1';
  const [scaled, setScaled] = useState(false);
  const { overlayed, setOverlayed, sendJsonMessage, tournamentId } =
    useContext(DashboardContext);
  const { data } = useTournamentInfo(tournamentId!);
  const queryClient = useQueryClient();
  const mutation = useTournamentSetGameResult(queryClient, {
    tournamentId,
    sendJsonMessage,
  });
  const ref = useRef<any>(null); // FIXME any

  data?.tournament.started_at;

  const handleCardState = useCallback(
    (state: boolean) => {
      setOverlayed(state);
      setScaled(state);
    },
    [setOverlayed],
  );

  const bind = useLongPress(() => handleCardState(true), {
    cancelOnMovement: 1,
    cancelOutsideElement: true,
    threshold: 200,
    onCancel: () => {
      handleCardState(false);
    },
    filterEvents: () => {
      if (scaled || overlayed) return false;
      return true;
    },
  });

  const handleMutate = (newResult: ResultModel) => {
    if (overlayed && scaled && !mutation.isPending) {
      mutation.mutate({
        gameId: id,
        whiteId: playerLeft.white_id!,
        blackId: playerRight.black_id!,
        result: newResult,
        prevResult: result,
      });
    }
  };

  const resultProps: ResultProps = {
    isPending: mutation.isPending,
    result,
    scaled,
    handleMutate,
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      handleCardState(false);
    }
  }, [handleCardState, mutation.isSuccess]);

  useOutsideClick(
    () => {
      if (scaled) {
        handleCardState(false);
      }
    },
    ref,
    { capture: false, touch: 'touchstart' },
  );

  if (window)
    window.oncontextmenu = function () {
      return false;
    }; // dev-line

  return (
    <Card
      className={`grid w-full select-none grid-cols-[1fr_auto_1fr] items-center border p-2 text-sm transition-all duration-300 md:max-w-[250px] ${scaled && 'z-50 -translate-y-5 scale-105'}`}
      ref={ref}
      {...bind()}
    >
      <PlayerButton
        result={result}
        handleMutate={() => handleMutate('1-0')}
        scaled={scaled}
        nickname={playerLeft.white_nickname}
        muted={draw || rightWin}
        position={{ justify: 'justify-self-start', text: 'text-left' }}
      />
      <Button
        variant="ghost"
        className={`${!scaled && 'pointer-events-none'} mx-4 flex h-fit flex-grow select-none gap-2 justify-self-center rounded-sm p-1 px-2 ${scaled && draw && 'underline underline-offset-4'}`}
      >
        <Result {...resultProps} />
      </Button>
      <PlayerButton
        result={result}
        handleMutate={() => handleMutate('0-1')}
        scaled={scaled}
        nickname={playerRight.black_nickname}
        muted={draw || leftWin}
        position={{ justify: 'justify-self-end', text: 'text-right' }}
      />
    </Card>
  );
};

const PlayerButton: FC<PlayerButtonProps> = ({
  handleMutate,
  result,
  nickname,
  scaled,
  muted,
  position,
}) => {
  return (
    <Button
      variant="ghost"
      className={`${!scaled && 'pointer-events-none'} line-clamp-2 h-fit max-w-full select-none text-ellipsis hyphens-auto break-words rounded-sm p-1 px-2 ${muted ? 'text-muted-foreground' : scaled && result && 'underline underline-offset-4'} ${position.justify}`}
      onClick={handleMutate}
    >
      <small className={`line-clamp-2 ${position.text}`}>{nickname}</small>
    </Button>
  );
};

const Result: FC<ResultProps> = ({
  isPending,
  result,
  scaled,
  handleMutate,
}) => {
  const t = useTranslations('Tournament.Results');
  if (isPending) return <Loader2 className="size-5 animate-spin p-0" />;
  if (scaled)
    return (
      <div
        className={`select-none ${result && result !== '1/2-1/2' && 'text-muted-foreground'}`}
        onClick={() => handleMutate('1/2-1/2')}
      >
        <small className="select-none">{t('draw')}</small>
      </div>
    );
  return <div className="select-none">{result ? t(result) : '|'}</div>; // FIXME styling
};

type PlayerButtonProps = {
  handleMutate: () => void;
  nickname: string | null;
  result: ResultModel | null;
  scaled: boolean;
  muted: boolean;
  position: {
    justify: 'justify-self-start' | 'justify-self-end';
    text: 'text-left' | 'text-right';
  };
};

type ResultProps = {
  isPending: boolean;
  result: ResultModel | null;
  scaled: boolean;
  handleMutate: (_result: ResultModel) => void;
};

export type GameProps = {
  id: string;
  result: ResultModel | null;
  playerLeft: Record<'white_id' | 'white_nickname', string | null>;
  playerRight: Record<'black_id' | 'black_nickname', string | null>;
};

export default GameItemCompact;
