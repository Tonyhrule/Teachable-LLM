import { isWebGPUSupported } from '@/helpers/webgpu';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const PickMode: React.FC = () => {
  const [webGPUSupported, setWebGPUSupported] = useState(false);

  useEffect(() => {
    isWebGPUSupported().then(setWebGPUSupported);
  }, []);

  return (
    <div className='h-screen bg-gray-300 flex justify-center items-center gap-24'>
      <Head>
        <title>Teachable LLM | Pick Mode</title>
      </Head>

      <nav className='rounded-br-md fixed top-0 left-0 border-b-1 border-r-1 p-4 border-gray-500 shadow-md bg-white'>
        <div className='text-sky-600 text-2xl font-bold'>
          <Link href='/'>Teachable LLM</Link>
        </div>
      </nav>

      <Link
        className={
          'rounded-2xl p-4 sm:px-6 lg:px-8 shadow-lg max-w-96 transition-all ' +
          (webGPUSupported
            ? 'bg-white hover:shadow-xl cursor-pointer'
            : 'cursor-not-allowed bg-gray-200')
        }
        onClick={(e) => {
          if (!webGPUSupported) {
            e.preventDefault();
            (
              document.getElementById('webgpu-modal') as HTMLDialogElement
            ).showModal();
          }
        }}
        href='/playground'
      >
        <Image
          src='/on-device.png'
          alt='On Device'
          className='pointer-events-none'
          width={300}
          height={300}
        />
        <div className='mt-4'>
          <h2 className='text-2xl font-medium'>On Device</h2>
          <h3 className='text-xl text-gray-500'>(Suggested for Computers)</h3>
          <p className='mt-2 text-lg text-gray-700'>
            Run the LLM model directly on your device for more privacy and
            easier use. If this mode crashes the website or is too slow, switch
            to Cloud/OpenAI. (Requires WebGPU support)
          </p>
        </div>
      </Link>

      <Link
        className='rounded-2xl p-4 sm:px-6 lg:px-8 shadow-lg max-w-96 transition-all bg-white hover:shadow-xl cursor-pointer'
        href='/playground-openai'
      >
        <Image
          src='/openai.jpg'
          alt='OpenAI'
          className='pointer-events-none'
          width={300}
          height={300}
        />
        <div className='mt-4'>
          <h2 className='text-2xl font-medium'>Cloud/OpenAI</h2>
          <h3 className='text-xl text-gray-500'>
            (Suggested for Tablets/Mobile)
          </h3>
          <p className='mt-2 text-lg text-gray-700'>
            Run the LLM model in the cloud for improved speed and performance.
            This requires an OpenAI API key, but instructions to acquire one are
            provided.
          </p>
        </div>
      </Link>

      <dialog id='webgpu-modal' className='modal'>
        <div className='modal-box max-w-3xl'>
          <h3 className='font-bold text-xl'>WebGPU Support</h3>
          <p className='mt-2 text-lg text-gray-700'>
            This feature requires WebGPU support in your browser. Please ensure
            you are using a compatible browser and have enabled any necessary
            flags. You can check your browser&apos;s compatibility with WebGPU
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

        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default PickMode;
