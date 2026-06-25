import { Link } from "react-router-dom";

const AuthLayout = ({
  title,
  subtitle,
  features,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="px-8 py-5">
          <Link to="/">
            <h1 className="text-2xl font-bold text-white">
              ✈️ TripGen AI
            </h1>

            <p className="text-gray-400 text-sm">
              AI-Powered Travel Planning Assistant
            </p>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(90vh-80px)] px-8">

        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}
          <div className="hidden lg:block text-white">
            <h1 className="text-6xl font-bold leading-tight">
              {title}
            </h1>

            <p className="text-xl text-gray-300 mt-6">
              {subtitle}
            </p>

            <div className="mt-10 space-y-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center">
            <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
              {children}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;