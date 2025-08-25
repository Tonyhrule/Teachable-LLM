import React, { useEffect, useMemo, useState } from 'react';
import Playground from './playground';
import { ChatMessage } from '@/helpers/types';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import Head from 'next/head';
import { FiSettings } from 'react-icons/fi';

const buildStreamChat =
  (client: OpenAI, model: string) =>
  async (
    messages: ChatMessage[],
    prompt: string,
    setMessages: (v: ChatMessage[]) => void,
  ) => {
    const chunks = await client.chat.completions.create({
      model,
      messages: messages.concat({
        role: 'user',
        content: prompt,
      }) as ChatCompletionMessageParam[],
      stream: true,
    });

    let response = '';
    for await (const chunk of chunks) {
      response += chunk.choices[0]?.delta.content || '';
      setMessages([
        ...messages,
        { role: 'user', content: prompt },
        { role: 'assistant', content: response },
      ]);
    }

    return response;
  };

const PlaygroundOpenAI: React.FC = () => {
  const [oaiKey, setOaiKey] = useState('');
  const [oaiInput, setOaiInput] = useState('');
  const [model, setModel] = useState('gpt-4.1-mini');
  const [modelInput, setModelInput] = useState('gpt-4.1-mini');
  const oaiClient = useMemo(
    () => new OpenAI({ apiKey: oaiKey, dangerouslyAllowBrowser: true }),
    [oaiKey],
  );

  useEffect(() => {
    const key = localStorage.getItem('openai_key');
    if (key) {
      setOaiKey(key);
      setOaiInput(key);
    }
    const savedModel = localStorage.getItem('openai_model');
    if (savedModel) {
      setModel(savedModel);
      setModelInput(savedModel);
    }
  }, []);

  if (!oaiKey) {
    return (
      <div className='bg-gray-200 h-screen flex items-center justify-center gap-16'>
        <Head>
          <title>Teachable LLM | Playground</title>
        </Head>
        <div className='flex flex-col items-center gap-4 bg-white p-16 rounded-lg shadow-lg'>
          <h1 className='text-2xl font-bold'>OpenAI API Key Required</h1>
          <p>Please set your OpenAI API key below.</p>
          <input
            type='text'
            className='input'
            placeholder='Enter your OpenAI API key'
            value={oaiInput}
            onChange={(e) => setOaiInput(e.target.value)}
          />
          <button
            className='btn btn-primary'
            onClick={() => {
              localStorage.setItem('openai_key', oaiInput);
              setOaiKey(oaiInput);
            }}
          >
            Set API Key
          </button>
        </div>

        <div className='flex flex-col items-center gap-4 bg-white p-16 rounded-lg shadow-lg'>
          <h1 className='text-2xl font-bold'>How to get an OpenAI API Key</h1>
          <p>To get your OpenAI API key, follow these steps:</p>
          <ol className='list-decimal list-inside'>
            <li>
              Go to the{' '}
              <a
                href='https://platform.openai.com/signup'
                className='text-blue-500'
                target='_blank'
                rel='noopener noreferrer'
              >
                OpenAI website
              </a>{' '}
              and sign up for an account.
            </li>
            <li>
              Once you have an account, click the settings icon in the top
              right.
            </li>
            <li>
              Navigate to the &quot;API Keys&quot; section on the left menu.
            </li>
            <li>Generate a new API key and copy it.</li>
            <li>Paste your API key into the input field above.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <Playground customLLMStream={buildStreamChat(oaiClient, model)}>
      <button
        className='fixed top-0 right-0 border-b-1 border-l-1 p-8 border-gray-500 shadow-md bg-white cursor-pointer btn btn-ghost rounded-bl-md rounded-none'
        onClick={() => {
          setOaiInput(oaiKey);
          setModelInput(model);
          (
            document.getElementById(
              'openai-settings-modal',
            ) as HTMLDialogElement
          ).showModal();
        }}
      >
        <FiSettings className='inline-block mr-2' size={24} title='Settings' />
        <span className='align-middle text-lg font-semibold'>Settings</span>
      </button>

      <dialog id='openai-settings-modal' className='modal'>
        <div className='modal-box max-w-xl max-h-[80vh]'>
          <h1 className='modal-top text-2xl font-medium'>Settings</h1>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>OpenAI Key</legend>
            <input
              type='text'
              className='input'
              placeholder='sk-proj-...'
              value={oaiInput}
              onChange={(e) => setOaiInput(e.target.value)}
            />
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>Model</legend>
            <input
              type='text'
              className='input'
              placeholder='gpt-4.1-mini'
              value={modelInput}
              onChange={(e) => setModelInput(e.target.value)}
            />
          </fieldset>
          <button
            className='btn btn-primary mt-2'
            onClick={() => {
              localStorage.setItem('openai_key', oaiInput);
              setOaiKey(oaiInput);
              localStorage.setItem('openai_model', modelInput);
              setModel(modelInput);
              (
                document.getElementById(
                  'openai-settings-modal',
                ) as HTMLDialogElement
              ).close();
            }}
          >
            Save Settings
          </button>
          <button
            className='btn btn-secondary mt-2 ml-2'
            onClick={() =>
              (
                document.getElementById(
                  'openai-settings-modal',
                ) as HTMLDialogElement
              ).close()
            }
          >
            Cancel
          </button>
        </div>

        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </Playground>
  );
};

export default PlaygroundOpenAI;
