import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoDocumentText, IoGlobeOutline } from 'react-icons/io5';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const Home: React.FC = () => {
  return (
    <div className='min-h-screen md:py-24'>
      <Head>
        <title>Teachable LLM</title>
      </Head>

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

      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
            <div className='sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left'>
              <h1 className='text-4xl font-bold text-sky-600 tracking-tight sm:text-5xl md:text-6xl'>
                Teachable LLM
              </h1>
              <p className='mt-3 text-base text-gray-800 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl'>
                Give your LLM the context it needs to answer your users&apos;
                questions using your own documents. Give your App Inventor users
                the experience they deserve.
              </p>
              <div className='mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0'>
                <a href='/pick-mode'>
                  <button className='btn btn-primary'>Get Started</button>
                </a>
              </div>
            </div>
            <div className='mt-12 relative sm:max-w-lg sm:mx-auto lg:-mt-24 lg:max-w-none lg:mr-12 lg:col-span-6 lg:flex lg:items-start'>
              <Image
                src='/documents.png'
                alt='Documents'
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
                What is Knowledgable LLM?
              </h2>
              <p className='mt-3 max-w-3xl text-lg text-gray-500'>
                Knowledgeable-LLM is an open-source educational platform
                designed to help you train and interact with LLMs using your own
                materials. Just upload your documents, and our Retrieval
                Augmented Generation (RAG) system lets the LLM answer questions
                based on that content—completely offline and under your control.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 bg-white w-full'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-3 lg:gap-8'>
            <div>
              <div className='flex items-center justify-center h-12 w-12 rounded-md bg-sky-500 text-white'>
                <IoDocumentText className='h-6 w-6' />
              </div>
              <div className='mt-5'>
                <h2 className='text-lg font-medium text-gray-900'>
                  Inform Your Own LLM
                </h2>
                <p className='mt-2 text-base text-gray-500'>
                  Use PDFs or text documents to inform your LLM. You can upload
                  any document and the LLM will be able to answer questions
                  based on that content.
                </p>
              </div>
            </div>

            <div className='mt-10 lg:mt-0'>
              <div className='flex items-center justify-center h-12 w-12 rounded-md bg-sky-500 text-white'>
                <IoGlobeOutline className='h-6 w-6' />
              </div>
              <div className='mt-5'>
                <h2 className='text-lg font-medium text-gray-900'>
                  Run Everything Locally
                </h2>
                <p className='mt-2 text-base text-gray-500'>
                  Everything is run locally on your machine. Once you download
                  the model, you can run it without an internet connection. No
                  need to worry about data privacy or security.
                </p>
              </div>
            </div>

            <div className='mt-10 lg:mt-0'>
              <div className='flex items-center justify-center h-12 w-12 rounded-md bg-sky-500 text-white'>
                <HiOutlineMagnifyingGlass className='h-6 w-6' />
              </div>
              <div className='mt-5'>
                <h2 className='text-lg font-medium text-gray-900'>
                  Get Cited Answers
                </h2>
                <p className='mt-2 text-base text-gray-500'>
                  See exactly where the LLM got its information from. The LLM
                  will provide citations for each answer, so you can verify the
                  information it provides. This is especially useful for
                  educational purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
