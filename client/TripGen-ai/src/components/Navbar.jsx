import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const userName =
        localStorage.getItem(
            "userName"
        ) || "Traveler";

    const avatar =
        userName.charAt(0)
            .toUpperCase();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/10">

            <div className="w-full pl-6 pr-10 py-4 flex items-center justify-between">

                <Link
                    to="/dashboard"
                    className="flex items-center gap-3"
                >
                    <div className="text-3xl">
                        ✈️
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            TripGen AI
                        </h1>

                        <p className="text-xs text-gray-300">
                            AI Travel Planning Assistant
                        </p>
                    </div>
                </Link>


                {/* Navigation */}
                <div className="flex items-center gap-4">

                    <Link
                        to="/dashboard"
                        className="px-4 py-2 rounded-xl text-gray-200 hover:bg-white/10 transition"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/upload"
                        className="px-4 py-2 rounded-xl text-gray-200 hover:bg-white/10 transition"
                    >
                        Upload
                    </Link>

                    <Link
                        to="/history"
                        className="px-4 py-2 rounded-xl text-gray-200 hover:bg-white/10 transition"
                    >
                        History
                    </Link>

                    <div className="relative">

                        <button
                            onClick={() =>
                                setOpen(!open)
                            }
                            className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-white/10 transition"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                                {avatar}
                            </div>

                            <span
                                className={`text-sm transition-transform ${open
                                    ? "rotate-180"
                                    : ""
                                    }`}
                            >
                                ▼
                            </span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                                <div className="p-4 border-b border-white/10">

                                    <h3 className="font-semibold">
                                        {userName}
                                    </h3>

                                    <p className="text-sm text-gray-400">
                                        TripGen AI User
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                    className="w-full text-left px-4 py-3 hover:bg-white/10"
                                >
                                    👤 Profile
                                </button>

                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10"
                                >
                                    🚪 Logout
                                </button>

                            </div>
                        )}

                    </div>

                </div>
            </div>
        </nav>

    );
};

export default Navbar;