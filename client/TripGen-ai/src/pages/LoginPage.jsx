import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [temporaryPassword, setTemporaryPassword] = useState("");
    const [resetting, setResetting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const { data } = await API.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem(
                "token",
                data.token
            );
            localStorage.setItem(
                "userName",
                data.user.name
            );

            toast.success("Login Successful");

            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!forgotEmail.trim()) {
            toast.error(
                "Enter your registered email"
            );

            return;
        }

        try {
            setResetting(true);
            setTemporaryPassword("");

            const { data } = await API.post(
                "/auth/forgot-password",
                {
                    email: forgotEmail,
                }
            );

            setTemporaryPassword(
                data.temporaryPassword
            );

            toast.success(
                "Temporary password generated"
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to reset password"
            );
        } finally {
            setResetting(false);
        }
    };

    return (
        <AuthLayout
            title="Travel Smarter With AI"
            subtitle="Upload travel documents and instantly generate organized travel itineraries."
            features={[
                {
                    icon: "✈️",
                    text: "Flight & Hotel Analysis",
                },
                {
                    icon: "📄",
                    text: "PDF Booking Extraction",
                },
                {
                    icon: "🤖",
                    text: "AI Generated Itineraries",
                },
                {
                    icon: "🔗",
                    text: "Instant Sharing",
                },
            ]}
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">
                    {forgotMode
                        ? "Forgot Password"
                        : "Welcome Back"}
                </h2>

                <p className="text-gray-300 mt-2">
                    {forgotMode
                        ? "Generate a temporary password"
                        : "Login to continue"}
                </p>
            </div>

            {forgotMode ? (
                <form
                    onSubmit={handleForgotPassword}
                    className="space-y-4"
                >
                    <input
                        type="email"
                        placeholder="Registered Email Address"
                        value={forgotEmail}
                        autoComplete="email"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                        onChange={(e) =>
                            setForgotEmail(
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="submit"
                        disabled={resetting}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold"
                    >
                        {resetting
                            ? "Submitting..."
                            : "Submit"}
                    </button>

                    {temporaryPassword && (
                        <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 text-white">
                            <p className="text-sm text-green-200">
                                Temporary Password
                            </p>

                            <p className="font-mono text-xl mt-1 break-all">
                                {temporaryPassword}
                            </p>

                            <p className="text-sm text-gray-300 mt-3">
                                Login with this password, then change it from your profile.
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            setForgotMode(false);
                            setTemporaryPassword("");
                        }}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold"
                    >
                        Back to Login
                    </button>
                </form>
            ) : (
                <form
                    onSubmit={handleLogin}
                    className="space-y-4"
                >
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    autoComplete="current-password"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    type="button"
                    onClick={() => {
                        setForgotMode(true);
                        setForgotEmail(email);
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                >
                    Forgot password?
                </button>

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                    Login
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-white/20"></div>

                    <span className="px-4 text-gray-400 text-sm">
                        OR
                    </span>

                    <div className="flex-1 border-t border-white/20"></div>
                </div>

                <a
                    href="http://localhost:8000/api/auth/google"
                    className="flex justify-center"
                >
                    <div className="bg-white hover:bg-gray-100 transition p-3 rounded-full shadow-lg cursor-pointer">
                        <FcGoogle size={28} />
                    </div>
                </a>
                </form>
            )}

            {!forgotMode && (
                <p className="text-center text-gray-300 mt-6">
                Don't have an account?

                <span
                    onClick={() =>
                        navigate("/register")
                    }
                    className="text-blue-400 ml-2 cursor-pointer"
                >
                    Register
                </span>
                </p>
            )}
        </AuthLayout>
    );
};

export default LoginPage;
