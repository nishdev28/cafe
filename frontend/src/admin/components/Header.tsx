const Header = () => {
    return (
      <header className="bg-[#8C3A22]  shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span >Admin</span>
          <img
            src=""
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </header>
    );
  };
  
  export default Header;
  