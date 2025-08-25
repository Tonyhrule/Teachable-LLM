import React, { MouseEventHandler, ReactNode, useState } from 'react';
import {
  docToText,
  Document,
  emptyHNSW,
  hnsw,
  insertHNSW,
  queryHNSW,
} from '@/helpers/hsnw';
import { streamChat as streamChatWebLLM } from '@/helpers/llm';
import { ChatMessage } from '@/helpers/types';
import Message from '@/components/Message';
import AddTextModal from '@/components/AddTextModal';
import Head from 'next/head';
import LoadingLLM from '@/components/LoadingLLM';
import Link from 'next/link';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { ImSpinner2 } from 'react-icons/im';
import { useEmbed } from '@/helpers/embed';
import ModifyEntryModal from '@/components/ModifyEntryModal';
import { HNSW } from 'mememo';

const Playground: React.FC<{
  customLLMStream?: typeof streamChatWebLLM;
  children?: ReactNode;
}> = ({ customLLMStream, children }) => {
  const [loaded, setLoaded] = useState(!!customLLMStream);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<
    (Document & { distance: number })[]
  >([]);
  const [loadingFile, setLoadingFile] = useState(false);
  const [openDocument, setOpenDocument] = useState<Document | null>(null);
  const [highlightedDocuments, setHighlightedDocuments] = useState<string[]>(
    [],
  );

  const streamChat = customLLMStream || streamChatWebLLM;

  const embed = useEmbed();

  const fetchDocuments = async (query: string, k?: number) => {
    const rawDocs = await queryHNSW(query || '.', embed, k);
    const docs = rawDocs.keys.map((key, i) => ({
      title: key.split('\n')[0],
      content: key.split('\n').slice(1).join('\n'),
      distance: rawDocs.distances[i],
    }));
    setDocuments(docs);
    return docs;
  };

  const handlePrompt = async () => {
    if (!prompt) return;

    setPrompt('');
    if (!messages.length) {
      let newPrompt = prompt;

      const docs = await fetchDocuments(prompt, 5);
      setHighlightedDocuments(documents.map((doc) => doc.title));
      if (docs.length) {
        newPrompt = `Use provided documents to answer the user's prompt.
Whenever you use information from a document, you must cite it in the format "[DOCUMENT TITLE]".
Most of your documents should be cited.
For example:
The capital of France is Paris [world_map.pdf - Page 1].

DOCUMENTS:
${docs
  .map(
    (doc, i) => `Document ${i + 1}:
Title: ${doc.title}

Content:
${doc.content}`,
  )
  .join('\n\n=================================\n\n')}

=================================

USER PROMPT:
${prompt}`;
      }

      setMessages([
        ...messages,
        { role: 'user', content: newPrompt },
        { role: 'assistant', content: '...' },
      ]);
      streamChat(messages, newPrompt, setMessages);
    } else {
      setMessages([
        ...messages,
        { role: 'user', content: prompt },
        { role: 'assistant', content: '...' },
      ]);
      streamChat(messages, prompt, setMessages);
    }
  };

  const handleText = async (title: string, content: string) => {
    await insertHNSW([{ title, content: content.trim() }], embed);
    (document.getElementById('add-text') as HTMLDialogElement)?.close();
    fetchDocuments(title);
  };

  const handlePDF = async (file: File) => {
    if (!file) return;
    setLoadingFile(true);

    const formData = new FormData();
    formData.append('file', file as File);

    const response: string[] = await fetch('/api/pdf', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    await insertHNSW(
      response.map((page, i) => ({
        title: `${file.name} - Page ${i + 1}`,
        content: page.trim(),
      })),
      embed,
    );

    fetchDocuments(file.name);
    setLoadingFile(false);
  };

  const handleImport = async (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = JSON.parse(e.target?.result as string);
      const { index, keys, embeddings } = data;

      hnsw.loadIndex(index);
      hnsw.bulkInsertSkipIndex(keys, embeddings);

      fetchDocuments('.');
    };
    reader.readAsText(file);
  };

  const handleExport: MouseEventHandler = async (e) => {
    e.currentTarget?.parentElement?.parentElement?.parentElement?.removeAttribute(
      'open',
    );

    const exportHNSW = new HNSW({ distanceFunction: 'cosine' });

    const rawEmbeddings = Array.from(hnsw.nodes.nodesMap.values()).filter(
      (node) => !node.isDeleted,
    );
    const keys = rawEmbeddings.map((node) => node.key);
    const embeddings = rawEmbeddings.map((node) => node.value);

    await exportHNSW.bulkInsert(keys, embeddings);

    const data = {
      index: exportHNSW.exportIndex(),
      keys,
      embeddings,
    };

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  const handleClear: MouseEventHandler = async (e) => {
    e.currentTarget?.parentElement?.parentElement?.parentElement?.removeAttribute(
      'open',
    );

    if (!window.confirm('Are you sure you want to clear all documents?')) {
      return;
    }
    setDocuments([]);
    await hnsw.clear();
    hnsw.loadIndex(emptyHNSW);
  };

  const handleModify = async (document?: Document) => {
    if (!document || !openDocument) {
      setOpenDocument(null);
      return;
    }

    hnsw.markDeleted(docToText(openDocument));
    await insertHNSW([document], embed);
    setOpenDocument(null);
    fetchDocuments(document.title);
  };

  const handleDelete = async () => {
    if (
      !openDocument ||
      !confirm('Are you sure you want to delete this document?')
    )
      return;

    hnsw.markDeleted(docToText(openDocument));
    setOpenDocument(null);
    fetchDocuments('.');
  };

  const handleShowDocuments = async () => {
    const documents = await fetchDocuments(prompt, 5);
    setHighlightedDocuments(documents.map((doc) => doc.title));
  };

  if (!loaded) {
    return (
      <>
        <Head>
          <title>Teachable LLM | Playground</title>
        </Head>
        <LoadingLLM setLoaded={setLoaded} />
      </>
    );
  }

  return (
    <div className='grid grid-cols-3 h-screen p-24 gap-24 bg-gray-100'>
      <Head>
        <title>Teachable LLM | Playground</title>
      </Head>

      <nav className='rounded-br-md fixed top-0 left-0 border-b-1 border-r-1 p-4 border-gray-500 shadow-md bg-white'>
        <div className='text-sky-600 text-2xl font-bold'>
          <Link href='/'>Teachable LLM</Link>
        </div>
      </nav>

      <div className='col-span-2 bg-white relative py-16 shadow-md rounded-xl'>
        <div className='absolute top-0 inset-x-0 p-2 flex gap-2 border-b border-gray-300 shadow'>
          <h1 className='text-2xl p-1 mr-auto'>Chat</h1>
          {messages
            .at(0)
            ?.content.startsWith(
              "Use provided documents to answer the user's prompt.",
            ) && (
            <button className='btn btn-primary' onClick={handleShowDocuments}>
              Show Documents
            </button>
          )}
          <button
            className='btn text-white bg-red-600 hover:bg-red-700 border-none'
            onClick={() => {
              if (confirm('Are you sure you want to reset this chat?')) {
                setMessages([]);
                setHighlightedDocuments([]);
              }
            }}
          >
            Reset Chat
          </button>
        </div>
        <div className='flex flex-col gap-4 px-4 overflow-y-scroll h-[calc(100vh-20rem)]'>
          {messages.map((message, i) => (
            <Message key={i} {...message} />
          ))}
        </div>
        <div className='absolute bottom-0 inset-x-0 border-t border-gray-300 p-2 flex justify-stretch gap-2'>
          <input
            className='input flex-1 focus:outline-none shadow hover:shadow'
            placeholder='Type something here...'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePrompt();
              }
            }}
          />
          <button
            className='btn btn-info'
            disabled={!loaded}
            onClick={handlePrompt}
          >
            Send
            <IoPaperPlaneOutline />
          </button>
        </div>
      </div>
      <div className='bg-white shadow-md rounded-xl relative py-16'>
        <div className='absolute top-0 inset-x-0 p-2 flex gap-2 border-b border-gray-300 shadow'>
          <h1 className='text-2xl p-1 mr-auto'>Documents</h1>
          <details className='dropdown dropdown-end'>
            <summary className='btn btn-primary'>Manage</summary>
            <ul className='menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-md border border-gray-300'>
              <li>
                <a
                  onClick={(e) => {
                    (
                      document.getElementById('add-text') as HTMLDialogElement
                    )?.showModal();
                    e.currentTarget?.parentElement?.parentElement?.parentElement?.removeAttribute(
                      'open',
                    );
                  }}
                >
                  Add Text
                </a>
              </li>
              <li>
                <label htmlFor='pdf-file' className='cursor-pointer'>
                  <a>Add PDF</a>
                  {loadingFile && (
                    <ImSpinner2 className='animate-spin ml-auto' />
                  )}
                </label>
                <input
                  id='pdf-file'
                  type='file'
                  accept='application/pdf'
                  hidden
                  onChange={(e) =>
                    handlePDF(e.target.files![0]).then(
                      () => (e.target.value = ''),
                    )
                  }
                />
              </li>
              <li>
                <label htmlFor='import-file' className='cursor-pointer'>
                  <a>Import</a>
                </label>
                <input
                  id='import-file'
                  type='file'
                  accept='application/json'
                  hidden
                  onChange={(e) => {
                    handleImport(e.target.files![0]).then(
                      () => (e.target.value = ''),
                    );
                    e.currentTarget?.parentElement?.parentElement?.parentElement?.removeAttribute(
                      'open',
                    );
                  }}
                />
              </li>
              <li>
                <a onClick={handleExport}>Export</a>
              </li>
              <li>
                <a onClick={handleClear}>Clear</a>
              </li>
            </ul>
          </details>
        </div>
        <div className='flex flex-col overflow-y-scroll h-[calc(100vh-20rem)] divide-y'>
          {documents.map((document, i) => (
            <div
              key={i}
              className={`p-4 hover:bg-sky-600/10 cursor-pointer ${
                highlightedDocuments.includes(document.title)
                  ? 'bg-sky-300/10'
                  : ''
              }`}
              onClick={() => setOpenDocument(document)}
            >
              <p className='font-medium text-xl truncate'>{document.title}</p>
              <p className='text-xs'>Distance: {document.distance}</p>
              <p className='text-sm line-clamp-3'>{document.content}</p>
            </div>
          ))}
        </div>
        <div className='absolute bottom-0 inset-x-0 p-2 flex justify-stretch gap-2 border-t border-gray-300'>
          <input
            className='input flex-1 focus:outline-none shadow hover:shadow'
            placeholder='Search through your documents'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                fetchDocuments(query);
                setQuery('');
              }
            }}
          />
          <button
            className='btn btn-info'
            disabled={!loaded}
            onClick={() => {
              fetchDocuments(query);
              setQuery('');
            }}
          >
            Search <FaMagnifyingGlass />
          </button>
        </div>
      </div>

      <AddTextModal handleText={handleText} />
      {openDocument && (
        <ModifyEntryModal
          handleModify={handleModify}
          handleDelete={handleDelete}
          document={openDocument}
        />
      )}
      {children}
    </div>
  );
};

export default Playground;
