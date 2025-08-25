import { FC, useState } from 'react';

const AddTextModal: FC<{
  handleText: (title: string, content: string) => Promise<void> | void;
}> = ({ handleText }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <dialog id='add-text' className='modal'>
      <div className='modal-box max-w-3xl max-h-[80vh]'>
        <h3 className='font-bold text-lg'>Add Text Document</h3>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='input w-full mt-4'
          placeholder='Title'
        />
        <textarea
          placeholder='Content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className='textarea textarea-bordered w-full h-48 mt-4'
        ></textarea>
        <div className='modal-action'>
          <form method='dialog'>
            <button
              className='btn btn-info'
              onClick={() => {
                setTitle('');
                setContent('');
                handleText(title, content);
              }}
              disabled={!title || !content}
            >
              Add
            </button>
            <button
              className='btn ml-2'
              onClick={() => {
                setTitle('');
                setContent('');
              }}
            >
              Close
            </button>
          </form>
        </div>
      </div>

      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AddTextModal;
