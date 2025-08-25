import { createContext, useContext } from 'react';

export const WorkerContext = createContext<Worker | null>(null);

export const useEmbed = () => {
  const worker = useContext(WorkerContext);

  const embed = (texts: string[]) =>
    new Promise<number[][]>((resolve) => {
      const onMessage = (event: MessageEvent) => {
        resolve(event.data);
        worker?.removeEventListener('message', onMessage);
      };
      worker?.addEventListener('message', onMessage);

      worker?.postMessage(texts);
    });

  return embed;
};
