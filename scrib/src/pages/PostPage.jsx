import {useContext, useEffect, useState} from "react";
import {useParams,Link} from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../UserContext";

export default function PostPage() {
  const [postInfo,setPostInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const {id} = useParams();
  useEffect(() => {
    fetch(`http://localhost:3000/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          console.log(postInfo);
          console.log(userInfo.id, postInfo.author._id);
          setPostInfo(postInfo);
        });
      });
  }, []);

  if (!postInfo) return '';

  return (
    <div className="container -mt-[40px] mx-auto px-4 py-8 max-w-2xl xl:max-w-4xl">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">{postInfo.title}</h1>
    
    <div className="flex items-center justify-between text-gray-500 text-sm mb-8">
      <div className="flex items-center">
        <div className="mr-2">by @{postInfo.author.username}</div>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      </div>

      {userInfo.id === postInfo.author._id && (
        <div className="flex">
          <Link to={`/edit/${postInfo._id}`} className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
    </div>

    <div className="mb-8">
      <img
        src={postInfo.cover}
        alt={postInfo.title}
        className="rounded-lg w-full h-[400px] object-cover shadow-md"
      />
    </div>

    <div className="prose prose-lg text-gray-700 mb-8">
      <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </div>

    <div className="flex justify-end">
      <Link to="/" className="text-indigo-600 hover:text-indigo-800">
        ← Back to posts
      </Link>
    </div>
  </div>
  );
}