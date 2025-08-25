import { Document } from '@/helpers/hsnw';
import { FC, useState } from 'react';

const ModifyEntryModal: FC<{
  handleModify: (document?: Document) => Promise<void> | void;
  handleDelete: () => Promise<void> | void;
  document: Document;
}> = ({ handleModify, handleDelete, document }) => {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [editMode, setEditMode] = useState(false);

  return (
    <dialog
      id='modify-entry'
      open
      className='modal'
      onClose={() => handleModify()}
    >
      <div className='modal-box max-w-3xl max-h-[80vh]'>
        {editMode ? (
          <>
            <h3 className='font-bold text-lg'>Modify Entry</h3>
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
              className='textarea textarea-bordered w-full h-96 mt-4'
            ></textarea>
            <div className='modal-action'>
              <form method='dialog'>
                <button
                  className='btn btn-info'
                  onClick={() => {
                    handleModify({ title, content });
                    setEditMode(false);
                  }}
                  disabled={!title || !content}
                >
                  Modify
                </button>
                <button
                  className='btn ml-2'
                  onClick={() => {
                    setEditMode(false);
                    setTitle(document.title);
                    setContent(document.content);
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <h3 className='font-bold text-lg mb-2'>{title}</h3>
            <p>
              {content.split('\n').map((text) => (
                <>
                  {text}
                  <br />
                </>
              ))}
            </p>
            <div className='modal-action'>
              <form method='dialog'>
                <button
                  className='btn btn-error text-white'
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                >
                  Delete
                </button>
                <button
                  className='btn btn-info ml-2'
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  Edit
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
          </>
        )}
      </div>

      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModifyEntryModal;
