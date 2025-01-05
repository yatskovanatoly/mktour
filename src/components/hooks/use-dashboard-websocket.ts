import { SOCKET_URL } from '@/lib/config/urls';
import { handleSocketMessage } from '@/lib/handle-socket-message';
import { QueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast } from 'sonner';

export const useDashboardWebsocket = (
  session: string,
  id: string,
  queryClient: QueryClient,
  setRoundInView: Dispatch<SetStateAction<number>>,
) => {
  const t = useTranslations('Toasts');
  const protocols = session !== '' ? session : 'guest';
  return useWebSocket(`${SOCKET_URL}/${id}`, {
    protocols,
    onOpen: () => {
      setTimeout(() => toast.dismiss('wsError'));
      toast.success(t('ws success'), {
        id: 'wsSuccess',
      });
    },
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
      message: '',
    },
    onMessage: (event: MessageEvent<any>) => {
      if (!event.data) return;
      const message = JSON.parse(event.data);
      handleSocketMessage(
        message,
        queryClient,
        id,
        t('ws message error'),
        setRoundInView,
      );
    },
    onError: () => {
      setTimeout(() => toast.dismiss('wsSuccess'));
    },
    reconnectInterval: 3000,
    onReconnectStop: () => {
      setTimeout(() => toast.dismiss('wsError'));
      toast.error(t('ws error'), {
        id: 'wsError',
      });
    },
  });
};
