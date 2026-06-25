import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";
import axios from "axios";

const AIRecommendationsPage = () => {
    const [form, setForm] = useState({
        destination: "",
        budget: "",
        days: "",
    });

    const [loading, setLoading] =
        useState(false);

    const [recommendations, setRecommendations] =
        useState(null);

    const [savedItinerary, setSavedItinerary] =
        useState(null);

    const [shareUrl, setShareUrl] =
        useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.destination.trim() ||
            !form.budget.trim() ||
            !form.days
        ) {
            toast.error(
                "Enter destination, budget, and days"
            );

            return;
        }

        try {
            setLoading(true);
            setRecommendations(null);
            setSavedItinerary(null);
            setShareUrl("");

            const { data } = await API.post(
                "/recommendations/ai",
                form
            );

            setRecommendations(
                data.recommendations
            );

            setSavedItinerary(
                data.itinerary
            );

            setShareUrl(
                data.shareUrl
            );

            toast.success(
                "AI planner saved to history"
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to generate recommendations"
            );
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!savedItinerary?._id) {
            return;
        }

        try {
            const token =
                localStorage.getItem("token");

            const response =
                await axios.get(
                    `http://localhost:8000/api/itinerary/download/${savedItinerary._id}`,
                    {
                        responseType: "blob",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;
            link.download =
                "tripgen-ai-planner.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            toast.error(
                "Failed to download PDF"
            );
        }
    };

    const renderList = (title, items) => {
        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return null;
        }

        return (
            <section className="bg-white/10 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">
                    {title}
                </h2>

                <ul className="list-disc pl-5 space-y-2 text-gray-200">
                    {items.map((item, index) => (
                        <li key={index}>
                            {item}
                        </li>
                    ))}
                </ul>
            </section>
        );
    };

    const recommendationDetails =
        recommendations?.recommendations ||
        recommendations ||
        {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="mb-10">
                    <h1 className="text-5xl font-bold">
                        AI Planner
                    </h1>

                    <p className="text-gray-300 mt-3">
                        Generate travel recommendations from your destination, budget, and trip length.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                >
                    <div className="grid md:grid-cols-3 gap-4">
                        <input
                            name="destination"
                            type="text"
                            placeholder="Destination, e.g. Dubai"
                            value={form.destination}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                        />

                        <input
                            name="budget"
                            type="text"
                            placeholder="Budget, e.g. AED 3000"
                            value={form.budget}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                        />

                        <input
                            name="days"
                            type="number"
                            min="1"
                            placeholder="Days, e.g. 5"
                            value={form.days}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 bg-green-600 hover:bg-green-700 disabled:opacity-60 px-6 py-3 rounded-xl font-semibold"
                    >
                        {loading
                            ? "Generating..."
                            : "Generate Recommendations"}
                    </button>
                </form>

                {recommendations && (
                    <div className="mt-10 space-y-6">
                        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
                            <p className="text-gray-400 text-sm">
                                Trip
                            </p>

                            <h2 className="text-2xl font-bold mt-1">
                                {recommendations.destination ||
                                    form.destination}
                            </h2>

                            <p className="text-gray-300 mt-2">
                                {(recommendations.days ||
                                    form.days) +
                                    " days"}{" "}
                                with{" "}
                                {recommendations.budget ||
                                    form.budget}
                            </p>

                            {savedItinerary && (
                                <div className="flex flex-wrap gap-3 mt-5">
                                    <a
                                        href={`/share/${savedItinerary.shareId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
                                    >
                                        Open
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                shareUrl
                                            );

                                            toast.success(
                                                "Link Copied"
                                            );
                                        }}
                                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
                                    >
                                        Share
                                    </button>

                                    <button
                                        type="button"
                                        onClick={downloadPDF}
                                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl"
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {renderList(
                                "Places to Visit",
                                recommendationDetails.placesToVisit
                            )}

                            {renderList(
                                "Restaurants",
                                recommendationDetails.restaurants
                            )}

                            {renderList(
                                "Travel Tips",
                                recommendationDetails.travelTips
                            )}

                            {Array.isArray(
                                recommendationDetails.budgetPlan
                            ) &&
                                recommendationDetails.budgetPlan.length >
                                    0 && (
                                    <section className="bg-white/10 border border-white/10 rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-4">
                                            Budget Plan
                                        </h2>

                                        <div className="space-y-4">
                                            {recommendationDetails.budgetPlan.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                        className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                                                    >
                                                        <div className="flex justify-between gap-4">
                                                            <p className="font-semibold">
                                                                {
                                                                    item.category
                                                                }
                                                            </p>

                                                            <p className="text-green-300">
                                                                {
                                                                    item.amount
                                                                }
                                                            </p>
                                                        </div>

                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {
                                                                item.notes
                                                            }
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </section>
                                )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AIRecommendationsPage;
