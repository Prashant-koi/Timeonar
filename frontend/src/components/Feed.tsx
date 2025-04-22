import React, { useState } from 'react';
import Post from './Post';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      userImg: 'https://i.pravatar.cc/50?img=1',
      text: 'Just setting up my new X account!',
      timestamp: '2h',
      likes: 20,
      comments: 5,
      reposts: 2
    },
    {
      id: '2',
      name: 'Jane Smith',
      username: 'janesmith',
      userImg: 'https://i.pravatar.cc/50?img=2',
      text: 'The new interface looks amazing! #design #UI',
      timestamp: '5h',
      likes: 153,
      comments: 12,
      reposts: 8
    }
  ]);
  
  return (
    <div className="xl:ml-[370px] border-x border-gray-800 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-800">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
      </div>
      
      {/* Input */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex space-x-3">
          <img 
            src="https://i.pravatar.cc/50?img=5" 
            alt="user-img" 
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
          />
          <div className="w-full">
            <div className="border-b border-gray-800 pb-3">
              <textarea 
                className="bg-transparent outline-none text-white tracking-wide w-full min-h-[50px] text-lg placeholder-gray-500" 
                placeholder="What's happening?"
                rows={2}
              ></textarea>
            </div>
            <div className="flex items-center justify-between pt-2.5">
              <div className="flex items-center">
                <div className="icon">
                  <span role="img" aria-label="media">🖼️</span>
                </div>
                <div className="icon">
                  <span role="img" aria-label="gif">GIF</span>
                </div>
                <div className="icon">
                  <span role="img" aria-label="poll">📊</span>
                </div>
                <div className="icon">
                  <span role="img" aria-label="emoji">😊</span>
                </div>
                <div className="icon">
                  <span role="img" aria-label="schedule">🗓️</span>
                </div>
                <div className="icon">
                  <span role="img" aria-label="location">📍</span>
                </div>
              </div>
              <button 
                className="bg-blue-500 text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:brightness-95 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Posts */}
      <div>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;