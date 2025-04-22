import React from 'react';

interface PostProps {
  post: {
    id: string;
    name: string;
    username: string;
    userImg: string;
    text: string;
    timestamp: string;
    likes: number;
    comments: number;
    reposts: number;
  }
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="p-3 flex cursor-pointer border-b border-gray-800">
      {/* User image */}
      <img 
        src={post.userImg}
        alt="user-img" 
        className="h-11 w-11 rounded-full mr-4"
      />
      
      {/* Right side */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px]">{post.name}</h4>
            <span className="text-sm sm:text-[15px] text-gray-500">@{post.username} · {post.timestamp}</span>
          </div>
          
          <div className="text-gray-500 hover:text-blue-500">
            <div className="icon">⋯</div>
          </div>
        </div>

        {/* Post text */}
        <p className="text-gray-200 text-[15px] sm:text-[16px] mb-2">{post.text}</p>
        
        {/* Icons */}
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center space-x-1 group">
            <div className="icon group-hover:bg-blue-500/10 group-hover:text-blue-500">
              <span role="img" aria-label="comment">💬</span>
            </div>
            <span className="group-hover:text-blue-500 text-sm">{post.comments}</span>
          </div>
          
          <div className="flex items-center space-x-1 group">
            <div className="icon group-hover:bg-green-500/10 group-hover:text-green-500">
              <span role="img" aria-label="repost">🔁</span>
            </div>
            <span className="group-hover:text-green-500 text-sm">{post.reposts}</span>
          </div>
          
          <div className="flex items-center space-x-1 group">
            <div className="icon group-hover:bg-red-500/10 group-hover:text-red-500">
              <span role="img" aria-label="like">❤️</span>
            </div>
            <span className="group-hover:text-red-500 text-sm">{post.likes}</span>
          </div>
          
          <div className="icon group">
            <span role="img" aria-label="share">📤</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;