import Logo from "../ui/Logo";
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 relative">

  {/* 🔷 TOP LEFT LOGO */}
  <div className="absolute top-6 left-6">
    <Logo />
  </div>

  {/* 🔷 CENTER LOGIN BOX */}
  <div className="flex items-center justify-center min-h-screen px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
      {children}
    </div>
  </div>

</div>
  );
};

export default AuthLayout;