import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const DashboardPage = () => {
    const navigate = useNavigate();

    const [itineraries, setItineraries] =
        useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get(
                    "/itinerary/history"
                );

                console.log(
                    "Dashboard Count:",
                    data.itineraries.length
                );

                setItineraries(
                    data.itineraries
                );
            } catch (error) {
                console.error(error);
            }
        };

        fetchStats();
    }, []);

    const totalItineraries =
        itineraries.length;

    const totalSharedLinks =
        itineraries.filter(
            (item) => item.shareId
        ).length;

    const latestDestination =
        itineraries.length > 0
            ? (() => {
                try {
                    const parsed = JSON.parse(
                        itineraries[0].itinerary
                    );

                    return (
                        parsed.destination ||
                        "N/A"
                    );
                } catch {
                    return "N/A";
                }
            })()
            : "N/A";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-5xl font-bold">
                    Welcome to TripGen AI
                </h1>

                <p className="text-gray-300 mt-3">
                    Generate and manage travel itineraries using AI.
                </p>

                {/* Statistics */}

                <div className="grid md:grid-cols-4 gap-6 mt-10">

                    <StatCard
                        icon="📄"
                        title="Documents"
                        value={totalItineraries}
                    />

                    <StatCard
                        icon="🧳"
                        title="Itineraries"
                        value={totalItineraries}
                    />

                    <StatCard
                        icon="🔗"
                        title="Shared Links"
                        value={totalSharedLinks}
                    />

                    <StatCard
                        icon="📍"
                        title="Destination"
                        value={latestDestination}
                    />

                </div>

                {/* Actions */}

                <div className="grid md:grid-cols-3 gap-6 mt-10">

                    <div
                        className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl cursor-pointer hover:bg-white/15 transition"
                        onClick={() =>
                            navigate("/upload")
                        }
                    >
                        <h2 className="text-2xl font-bold">
                            📄 Upload
                        </h2>

                        <p className="text-gray-300 mt-2">
                            Upload travel documents.
                        </p>
                    </div>

                    <div
                        className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl cursor-pointer hover:bg-white/15 transition"
                        onClick={() =>
                            navigate("/history")
                        }
                    >
                        <h2 className="text-2xl font-bold">
                            📚 History
                        </h2>

                        <p className="text-gray-300 mt-2">
                            View generated itineraries.
                        </p>
                    </div>

                    <div
                        className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl cursor-pointer hover:bg-white/15 transition"
                        onClick={() =>
                            navigate(
                                "/ai-recommendations"
                            )
                        }
                    >
                        <h2 className="text-2xl font-bold">
                            🤖 AI Planner
                        </h2>

                        <p className="text-gray-300 mt-2">
                            Get recommendations by destination, budget, and days.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

const StatCard = ({
    icon,
    title,
    value,
}) => {
    return (
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">

            <div className="text-4xl mb-3">
                {icon}
            </div>

            <h3 className="text-gray-400 text-sm">
                {title}
            </h3>

            <p className="text-2xl font-bold mt-1">
                {value}
            </p>

        </div>
    );
};

export default DashboardPage;
