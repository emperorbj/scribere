import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";


export default function Post({ _id, title, summary, cover, content, createdAt, author }) {

  return (

    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Post Cover Image */}
      <div className="w-full h-64 overflow-hidden">
        <Link to={`/post/${_id}`}>
          <img
            src={cover}
            alt="cover"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </Link>
      </div>

      {/* Post Content */}
      <div className="p-4 flex flex-col">
        <Link to={`/post/${_id}`}>
          <h2 className="text-xl font-bold text-gray-800 hover:text-purple-600 transition duration-200">
            {title}
          </h2>
        </Link>
        <div className="text-sm text-gray-500 mt-2">
          <span className="mr-2">{author?.username}</span>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </div>
        <p className="mt-4 text-gray-700">
          {summary}
        </p>
      </div>
    </div>

  );
}