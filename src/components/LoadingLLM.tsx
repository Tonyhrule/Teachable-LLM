import { initializeLLM } from '@/helpers/llm';
import { isWebGPUSupported } from '@/helpers/webgpu';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

const LoadingLLM: FC<{
  setLoaded: (loaded: boolean) => void;
}> = ({ setLoaded }) => {
  const [llmProgress, setLLMProgress] = useState({
    progress: 0,
    timeElapsed: 0,
    text: '',
  });
  const [webGPUSupported, setWebGPUSupported] = useState(true);

  useEffect(() => {
    isWebGPUSupported().then((supported) => {
      if (supported) initializeLLM(setLLMProgress);
      else setWebGPUSupported(false);
    });
  }, []);

  useEffect(() => {
    if (llmProgress.progress >= 1) {
      setLoaded(true);
    }
  }, [llmProgress]);

  if (!webGPUSupported) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <nav className='bg-white shadow fixed inset-x-0 top-0 z-10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex items-center'>
                <div className='text-sky-600 text-2xl font-bold'>
                  <Link href='/'>Teachable LLM</Link>
                </div>
              </div>
              <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                <a href='/pick-mode'>
                  <button className='btn btn-primary'>Get Started</button>
                </a>
              </div>
            </div>
          </div>
        </nav>

        <h1 className='text-3xl font-bold'>WebGPU Not Supported</h1>
        <p className='mt-4 text-lg text-gray-700'>
          Your browser does not support WebGPU, which is required for the
          on-device LLM. Please try a different browser or device.
        </p>
        <p className='mt-2 text-sm text-gray-500'>
          Find a list of supported browsers and instructions on potentially
          enabling WebGPU on your browser
          <a
            href='https://github.com/gpuweb/gpuweb/wiki/Implementation-Status'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 underline ml-1'
          >
            here
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      <h1 className='text-3xl font-bold mt-4'>Loading...</h1>
      <div className='mt-4 text-center'>
        <progress
          max='1'
          value={llmProgress.progress}
          className='progress w-96'
        />
        <p>{Math.floor(llmProgress.progress * 100)}%</p>
        <p className='text-sm text-gray-500'>{llmProgress.text}</p>
      </div>
    </div>
  );
};

export default LoadingLLM;
