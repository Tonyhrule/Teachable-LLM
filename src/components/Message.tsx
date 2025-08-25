import { FC, useState } from 'react';
import { ChatMessage } from '../helpers/types';
import ReactMarkdown from 'react-markdown';
import { ImSpinner2 } from 'react-icons/im';

const Message: FC<ChatMessage> = ({ role, content }) => {
  const [systemShow, setSystemShow] = useState(false);

  if (role === 'assistant') {
    return (
      <div>
        <p>Assistant</p>
        <div className='flex'>
          <div className='border rounded p-2 mt-1 max-w-4/5 bg-sky-900/10'>
            <div className='prose max-w-full'>
              {content === '...' ? (
                <ImSpinner2 className='animate-spin' />
              ) : (
                <ReactMarkdown>{content}</ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'user') {
    return (
      <div className='flex flex-col items-end'>
        <p className='inline-block'>You</p>
        <div className='border rounded p-2 mt-1 max-w-4/5 ml-auto bg-blue-100'>
          <p>
            {content
              .split('\n\n=================================\n\nUSER PROMPT:\n')
              .at(-1)
              ?.split('\n')
              .map((text) => (
                <>
                  {text}
                  <br />
                </>
              ))}
          </p>
        </div>
      </div>
    );
  }

  if (role === 'system') {
    return (
      <div>
        <button
          className='text-center cursor-pointer w-full'
          onClick={() => setSystemShow(!systemShow)}
        >
          System Message: Click to {systemShow ? 'Hide' : 'Show'}
        </button>
        {systemShow && (
          <div className='border rounded p-2 mt-1 max-w-4/5 mx-auto bg-purple-900/10'>
            <p>
              {content.split('\n').map((text) => (
                <>
                  {text}
                  <br />
                </>
              ))}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Message;
