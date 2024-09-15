import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('https://scriberebackend.vercel.app/post')
    .then(response => {
      response.json()
      .then(posts => {
        setPosts(posts);
        console.log(posts);

      });
    });
  }, []);
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 && posts.map((post) => (
          <Post key={post._id} {...post} />
        ))}
      </div>
    </div>

  );
}