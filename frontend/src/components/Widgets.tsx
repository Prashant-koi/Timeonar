import React from 'react';

const Widgets: React.FC = () => {
  const trends = [
    { id: 1, topic: 'Technology', name: 'React 19', posts: '125K' },
    { id: 2, topic: 'Sports', name: 'World Cup', posts: '98.5K' },
    { id: 3, topic: 'Politics', name: 'Elections 2024', posts: '80K' },
    { id: 4, topic: 'Entertainment', name: '#NewAlbum', posts: '74.2K' }
  ];
  
  const whoToFollow = [
    { id: 1, name: 'React', username: 'reactjs', img: 'https://i.pravatar.cc/50?img=10' },
    { id: 2, name: 'TypeScript', username: 'typescript', img: 'https://i.pravatar.cc/50?img=11' },
    { id: 3, name: 'Tailwind CSS', username: 'tailwindcss', img: 'https://i.pravatar.cc/50?img=12' }
  ];
  
  return (
    <div className="hidden lg:inline ml-8 space-y-5 py-1 w-[350px]">
      {/* Search bar */}
      <div className="sticky top-0 py-1.5 z-50">
        <div className="flex items-center bg-gray-900 p-3 rounded-full relative">
          <svg className="h-5 z-50 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 20.585l-4.929-4.929A8.94 8.94 0 0 0 19 10a9 9 0 1 0-9 9c2.353 0 4.507-.896 6.152-2.353L21.414 22 22 20.585zM10 17c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent pl-11 pr-5 w-full text-white border-none focus:outline-none text-[15px] placeholder-gray-500"
          />
        </div>
      </div>
      
      {/* What's happening */}
      <div className="bg-gray-900 rounded-xl pt-2 space-y-3">
        <h4 className="font-bold text-xl px-4 pb-2">What's happening</h4>
        
        {trends.map(trend => (
          <div key={trend.id} className="hover:bg-gray-800 cursor-pointer transition duration-200 ease-out px-4 py-2">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-xs text-gray-500">{trend.topic} · Trending</p>
                <h5 className="font-bold max-w-[250px] text-sm">#{trend.name}</h5>
                <p className="text-xs text-gray-500">{trend.posts} posts</p>
              </div>
              <div className="icon">⋯</div>
            </div>
          </div>
        ))}
        
        <button className="hover:bg-gray-800 cursor-pointer transition duration-200 ease-out px-4 py-3 text-blue-500 w-full text-left">
          Show more
        </button>
      </div>
      
      {/* Who to follow */}
      <div className="bg-gray-900 rounded-xl pt-2 space-y-3">
        <h4 className="font-bold text-xl px-4 pb-2">Who to follow</h4>
        
        {whoToFollow.map(account => (
          <div key={account.id} className="hover:bg-gray-800 cursor-pointer transition duration-200 ease-out px-4 py-2 flex items-center">
            <img src={account.img} alt={account.name} className="rounded-full h-12 w-12 mr-3" />
            <div className="flex-1">
              <h5 className="font-bold text-[15px] truncate">{account.name}</h5>
              <p className="text-[13px] text-gray-500 truncate">@{account.username}</p>
            </div>
            <button className="bg-white text-black px-3.5 py-1.5 font-bold rounded-full text-sm">
              Follow
            </button>
          </div>
        ))}
        
        <button className="hover:bg-gray-800 cursor-pointer transition duration-200 ease-out px-4 py-3 text-blue-500 w-full text-left">
          Show more
        </button>
      </div>
      
      {/* Footer */}
      <div className="text-gray-500 text-xs space-x-2 px-4">
        <span className="hover:underline cursor-pointer">Terms of Service</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
        <span className="hover:underline cursor-pointer">Cookie Policy</span>
        <span className="hover:underline cursor-pointer">Accessibility</span>
        <span className="hover:underline cursor-pointer">Ads info</span>
        <span className="hover:underline cursor-pointer">More...</span>
        <span>© 2025 Timeonar</span>
      </div>
    </div>
  );
};

export default Widgets;