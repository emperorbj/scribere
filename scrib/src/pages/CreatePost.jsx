
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);


  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    setLoading(true);
    const response = await fetch('https://scriberebackend.vercel.app/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    setLoading(false);


    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form onSubmit={createNewPost}>
      <input type="title"
        placeholder={'Title'}
        value={title}
        onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
        onChange={ev => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <div className='flex items-center justify-center'>
      <button className='bg-orange-400 p-4 w-44 text-white font-bold flex items-center justify-center' style={{ marginTop: '5px' }}
      disabled={loading}>
        {loading ? (
            <AiOutlineLoading3Quarters className='animate-spin h-6 w-6' /> // <-- Spinner icon
          ) : (
            'Create post'
          )}
      </button>
      </div>
    </form>
  );
}