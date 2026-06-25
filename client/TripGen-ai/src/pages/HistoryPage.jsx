import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import DeleteModal from "../components/DeleteModal";
import axios from "axios";

const recommendationSections = [
    {
        key: "placesToVisit",
        title: "Places to Visit",
    },
    {
        key: "restaurants",
        title: "Restaurants",
    },
    {
        key: "localAttractions",
        title: "Local Attractions",
    },
    {
        key: "transportation",
        title: "Transportation",
    },
    {
        key: "travelTips",
        title: "Travel Tips",
    },
];

const isPlannerTrip = (trip) =>
    trip.source === "ai-planner";

const asList = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    if (value) {
        return [value];
    }

    return [];
};

const HistoryPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        try {
            const { data } = await API.get(
                "/itinerary/history"
            );

            setItineraries(data.itineraries);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load history");
        }
    }
    const deleteItinerary = async () => {
        try {
            await API.delete(
                `/itinerary/${selectedId}`
            );

            toast.success(
                "Itinerary Deleted"
            );

            fetchHistory();

            setShowDeleteModal(false);
            setSelectedId(null);

        } catch {
            toast.error(
                "Delete Failed"
            );
        }
    };

    const downloadPDF = async (id) => {
        try {
            const token =
                localStorage.getItem("token");

            const response =
                await axios.get(
                    `http://localhost:8000/api/itinerary/download/${id}`,
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
                "tripgen-itinerary.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch {
            toast.error(
                "Failed to download PDF"
            );
        }
    };

    const filtered = itineraries.filter((item) => {
        try {
            const trip = JSON.parse(item.itinerary);

            return (
                trip.destination
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                trip.hotel
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                trip.budget
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        } catch {
            return false;
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="mb-10">
                    <h1 className="text-5xl font-bold">
                        My Itineraries
                    </h1>

                    <p className="text-gray-300 mt-2">
                        View and manage all your AI-generated travel plans.
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Search destination or hotel..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full mb-8 p-4 rounded-xl bg-white/10 border border-white/20"
                />

                {filtered.length === 0 ? (
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 text-center">

                        <h2 className="text-2xl font-semibold">
                            No itineraries found
                        </h2>

                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-6">

                        {filtered.map((item) => {
                            const trip = JSON.parse(
                                item.itinerary
                            );
                            const plannerTrip =
                                isPlannerTrip(trip);
                            const documentUrl =
                                item.files?.find(
                                    (file) =>
                                        file.fileUrl
                                )?.fileUrl;
                            const recommendations =
                                trip.recommendations ||
                                {};
                            const hasRecommendations =
                                recommendationSections.some(
                                    (section) =>
                                        asList(
                                            recommendations[
                                                section
                                                    .key
                                            ]
                                        ).length > 0
                                ) ||
                                recommendations.bestTimeToVisit ||
                                recommendations.estimatedBudget ||
                                (
                                    Array.isArray(
                                        recommendations.budgetPlan
                                    ) &&
                                    recommendations.budgetPlan.length >
                                        0
                                );

                            return (
                                <div
                                    key={item._id}
                                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6"
                                >

                                    <div className="flex justify-between items-center mb-5">

                                        <h3 className="text-xl font-semibold">
                                            📍 {trip.destination}
                                        </h3>

                                        <span className="bg-blue-500/20 px-3 py-1 rounded-full text-xs">
                                            {plannerTrip
                                                ? "AI Planner"
                                                : "AI Generated"}
                                        </span>

                                    </div>

                                    {plannerTrip ? (
                                        <div className="grid grid-cols-2 gap-4 mb-5">
                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Budget
                                                </p>

                                                <p>
                                                    {
                                                        trip.budget
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Days
                                                </p>

                                                <p>
                                                    {
                                                        trip.days
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4 mb-5">

                                        <div>
                                            <p className="text-gray-400 text-sm">
                                                Hotel
                                            </p>

                                            <p>
                                                {trip.hotel}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-400 text-sm">
                                                Guests
                                            </p>

                                            <p>
                                                {trip.guests}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-400 text-sm">
                                                Check In
                                            </p>

                                            <p>
                                                {trip.checkIn}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-400 text-sm">
                                                Check Out
                                            </p>

                                            <p>
                                                {trip.checkOut}
                                            </p>
                                        </div>

                                        </div>
                                    )}

                                    <p className="text-gray-300 mb-6">
                                        {trip.summary}
                                    </p>

                                    {hasRecommendations && (
                                        <div className="bg-white/10 border border-white/10 rounded-2xl p-5 mb-6">
                                            <h4 className="text-lg font-semibold mb-4">
                                                AI Travel Recommendations
                                            </h4>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {recommendationSections.map(
                                                    (section) => {
                                                        const items =
                                                            asList(
                                                                recommendations[
                                                                    section
                                                                        .key
                                                                ]
                                                            );

                                                        if (
                                                            items.length ===
                                                            0
                                                        ) {
                                                            return null;
                                                        }

                                                        return (
                                                            <div
                                                                key={
                                                                    section.key
                                                                }
                                                            >
                                                                <p className="text-sm text-gray-400 mb-1">
                                                                    {
                                                                        section.title
                                                                    }
                                                                </p>

                                                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-200">
                                                                    {items.map(
                                                                        (
                                                                            item,
                                                                            index
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {
                                                                                    item
                                                                                }
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        );
                                                    }
                                                )}

                                                {recommendations.bestTimeToVisit && (
                                                    <div>
                                                        <p className="text-sm text-gray-400 mb-1">
                                                            Best Time to Visit
                                                        </p>

                                                        <p className="text-sm text-gray-200">
                                                            {
                                                                recommendations.bestTimeToVisit
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                {recommendations.estimatedBudget && (
                                                    <div>
                                                        <p className="text-sm text-gray-400 mb-1">
                                                            Estimated Budget
                                                        </p>

                                                        <p className="text-sm text-gray-200">
                                                            {
                                                                recommendations.estimatedBudget
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                {Array.isArray(
                                                    recommendations.budgetPlan
                                                ) &&
                                                    recommendations.budgetPlan.length >
                                                        0 && (
                                                        <div className="md:col-span-2">
                                                            <p className="text-sm text-gray-400 mb-1">
                                                                Budget Plan
                                                            </p>

                                                            <div className="space-y-2 text-sm text-gray-200">
                                                                {recommendations.budgetPlan.map(
                                                                    (
                                                                        budgetItem,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex justify-between gap-4 border-b border-white/10 pb-2 last:border-b-0 last:pb-0"
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    budgetItem.category
                                                                                }
                                                                            </span>

                                                                            <span className="text-green-300">
                                                                                {
                                                                                    budgetItem.amount
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">

                                        <a
                                            href={`/share/${item.shareId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
                                        >
                                            Open
                                        </a>
                                        {documentUrl && (
                                            <a
                                                href={documentUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl"
                                            >
                                                Document
                                            </a>
                                        )}

                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `${window.location.origin}/share/${item.shareId}`
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
                                            onClick={() =>
                                                downloadPDF(item._id)
                                            }
                                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl"
                                        >
                                            Download PDF
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedId(item._id);
                                                setShowDeleteModal(true);
                                            }}
                                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                    <p className="text-sm text-gray-400 mt-4">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleString()}
                                    </p>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
            <DeleteModal
                open={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedId(null);
                }}
                onConfirm={deleteItinerary}
            />
        </div>
    );
};

export default HistoryPage;
