import React from 'react';

// Icons (you'll need to install an icon library like heroicons or create SVGs)
const HomeIcon = () => (
  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.122 0 .245-.03.356-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.107.606-.703.822-1.18.822H7.36c-.48 0-1.075-.216-1.178-.798L4.48 7.69 12 3.628l7.522 4.06-1.7 12.015z"></path>
    <path d="M8.22 12.184c0 2.084 1.695 3.78 3.78 3.78s3.78-1.696 3.78-3.78-1.695-3.78-3.78-3.78-3.78 1.696-3.78 3.78zm6.06 0c0 1.258-1.022 2.28-2.28 2.28s-2.28-1.022-2.28-2.28 1.022-2.28 2.28-2.28 2.28 1.022 2.28 2.28z"></path>
  </svg>
);

// Add other icons similarly

const Sidebar: React.FC = () => {
  return (
    <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
      {/* Logo */}
      <div className="p-3 rounded-full hover:bg-blue-50/10 cursor-pointer transition duration-200">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      </div>
      
      {/* Navigation */}
      <nav className="mt-4 mb-2.5 xl:items-start">
        <NavItem icon={<HomeIcon />} text="Home" active />
        <NavItem icon={<span className="w-7 h-7">#</span>} text="Explore" />
        <NavItem icon={<span className="w-7 h-7">🔔</span>} text="Notifications" />
        <NavItem icon={<span className="w-7 h-7">✉️</span>} text="Messages" />
        <NavItem icon={<span className="w-7 h-7">🔖</span>} text="Bookmarks" />
        <NavItem icon={<span className="w-7 h-7">👤</span>} text="Profile" />
        <NavItem icon={<span className="w-7 h-7">⋯</span>} text="More" />
      </nav>
      
      {/* Post Button */}
      <button className="bg-blue-500 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
        Post
      </button>
      
      {/* Mobile Post Button */}
      <button className="bg-blue-500 p-3 rounded-full xl:hidden">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
        </svg>
      </button>
      
      {/* User Profile */}
      <div className="flex items-center justify-center mt-auto mb-4 hoverEffect p-2">
        <img 
          src="https://i.pravatar.cc/50?img=5" 
          alt="user" 
          className="h-10 w-10 rounded-full"
        />
        <div className="hidden xl:inline ml-2">
          <h4 className="font-bold">Username</h4>
          <p className="text-gray-500">@username</p>
        </div>
        <div className="hidden xl:inline ml-8">⋯</div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{icon: React.ReactNode, text: string, active?: boolean}> = ({icon, text, active}) => {
  return (
    <div className={`hoverEffect flex items-center justify-center xl:justify-start text-lg space-x-3 ${active && "font-bold"}`}>
      <div>{icon}</div>
      <span className="hidden xl:inline">{text}</span>
    </div>
  );
};

export default Sidebar;