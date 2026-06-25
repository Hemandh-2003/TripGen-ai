import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import {
    isValidPassword,
    PASSWORD_RULE_MESSAGE,
} from "../utils/passwordRules";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidPassword(form.password)) {
            toast.error(PASSWORD_RULE_MESSAGE);

            return;
        }

        try {
            const { data } = await API.post(
                "/auth/register",
                form
            );

            localStorage.setItem(
                "token",
                data.token
            );
            localStorage.setItem(
                "userName",
                data.user.name
            );

            toast.success(
                "Account Created Successfully"
            );

            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Registration Failed"
            );
        }
    };

    return (
        <AuthLayout
            title="Start Your Travel Journey"
            subtitle="Create your TripGen AI account and let AI organize every trip for you."
            features={[
                {
                    icon: "🌍",
                    text: "Manage Multiple Trips",
                },
                {
                    icon: "⚡",
                    text: "Generate Plans In Seconds",
                },
                {
                    icon: "📅",
                    text: "Smart Travel Scheduling",
                },
                {
                    icon: "🔒",
                    text: "Secure Cloud Storage",
                },
            ]}
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">
                    Create Account
                </h2>

                <p className="text-gray-300 mt-2">
                    Join TripGen AI today
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value,
                        })
                    }
                />

                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value,
                        })
                    }
                />

                <p className="text-xs text-gray-400 leading-relaxed">
                    Password must be at least 6 characters with lowercase, uppercase, number, and special character.
                </p>

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                    Create Account
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-white/20"></div>

                    <span className="px-4 text-gray-400 text-sm">
                        OR
                    </span>

                    <div className="flex-1 border-t border-white/20"></div>
                </div>

                <a
                    href="/api/auth/google"
                    className="flex justify-center"
                >
                    <div className="bg-white hover:bg-gray-100 transition p-3 rounded-full shadow-lg cursor-pointer">
                        <FcGoogle size={28} />
                    </div>
                </a>
            </form>

            <p className="text-center text-gray-300 mt-6">
                Already have an account?

                <span
                    onClick={() => navigate("/")}
                    className="text-blue-400 ml-2 cursor-pointer"
                >
                    Login
                </span>
            </p>
        </AuthLayout>
    );
};

export default RegisterPage;
