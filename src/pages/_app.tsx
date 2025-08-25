import { WorkerContext } from '@/helpers/embed';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    setWorker(
      new Worker(new URL('../worker.ts', import.meta.url), {
        type: 'module',
      }),
    );
  }, []);

  return (
    <WorkerContext.Provider value={worker}>
      <Component {...pageProps} />
    </WorkerContext.Provider>
  );
}
