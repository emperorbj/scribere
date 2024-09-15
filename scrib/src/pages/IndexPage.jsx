// 
import Post from "../Post";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton"; // [CHANGED]
import 'react-loading-skeleton/dist/skeleton.css'; // [CHANGED]

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // [CHANGED]

  useEffect(() => {
    fetch('https://scriberebackend.vercel.app/post')
      .then(response => response.json())
      .then(posts => {
        setPosts(posts);
        setLoading(false); // [CHANGED]
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Display skeletons when loading */}
        {loading ? (
          Array(6).fill(0).map((_, index) => ( // [CHANGED]
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden p-4"> 
              <Skeleton height={250} /> {/* Skeleton for the image */} 
              <Skeleton height={30} className="mt-4" /> {/* Skeleton for the title */} 
              <Skeleton count={2} className="mt-2" /> {/* Skeleton for the content */} 
            </div>
          ))
        ) : (
          posts.length > 0 && posts.map((post) => (
            <Post key={post._id} {...post} />
          ))
        )}
      </div>
    </div>
  );
}
