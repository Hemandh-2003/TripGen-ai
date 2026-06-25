import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

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

const asList = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    if (value) {
        return [value];
    }

    return [];
};

const SharePage = () => {
    const { shareId } = useParams();

    const [itinerary, setItinerary] =
        useState(null);

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const { data } = await API.get(
                    `/itinerary/share/${shareId}`
                );

                setItinerary(data.itinerary);
            } catch (error) {
                console.error(error);
            }
        };

        fetchItinerary();
    }, [shareId]);

    if (!itinerary) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center text-white">
                <h2 className="text-3xl">
                    Loading Itinerary...
                </h2>
            </div>
        );
    }

    const trip = JSON.parse(
        itinerary.itinerary
    );
    const plannerTrip =
        trip.source === "ai-planner";
    const recommendations =
        trip.recommendations || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">

            <div className="max-w-6xl mx-auto px-6 py-12">

                <div className="text-center mb-10">

                    <h1 className="text-5xl font-bold mb-3">
                        {plannerTrip
                            ? "🤖 Shared AI Planner"
                            : "✈️ Shared Travel Itinerary"}
                    </h1>

                    <p className="text-gray-300">
                        Generated using TripGen AI
                    </p>

                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white/10 p-5 rounded-2xl">
                        <h4 className="text-sm text-gray-400">
                            📍 Destination
                        </h4>

                        <p className="font-semibold">
                            {trip.destination}
                        </p>
                    </div>

                    {plannerTrip ? (
                        <>
                            <div className="bg-white/10 p-5 rounded-2xl">
                                <h4 className="text-sm text-gray-400">
                                    💰 Budget
                                </h4>

                                <p className="font-semibold">
                                    {trip.budget}
                                </p>
                            </div>

                            <div className="bg-white/10 p-5 rounded-2xl">
                                <h4 className="text-sm text-gray-400">
                                    📅 Days
                                </h4>

                                <p className="font-semibold">
                                    {trip.days}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white/10 p-5 rounded-2xl">
                                <h4 className="text-sm text-gray-400">
                                    🏨 Hotel
                                </h4>

                                <p className="font-semibold">
                                    {trip.hotel}
                                </p>
                            </div>

                            <div className="bg-white/10 p-5 rounded-2xl">
                                <h4 className="text-sm text-gray-400">
                                    📅 Check In
                                </h4>

                                <p className="font-semibold">
                                    {trip.checkIn}
                                </p>
                            </div>

                            <div className="bg-white/10 p-5 rounded-2xl">
                                <h4 className="text-sm text-gray-400">
                                    🛫 Check Out
                                </h4>

                                <p className="font-semibold">
                                    {trip.checkOut}
                                </p>
                            </div>
                        </>
                    )}

                </div>

                <div className="bg-white/10 rounded-2xl p-6 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        Travel Summary
                    </h2>

                    <p>
                        {trip.summary}
                    </p>

                    {!plannerTrip && (
                        <p className="mt-3">
                            Guests: {trip.guests}
                        </p>
                    )}

                </div>

                <div className="bg-white/10 rounded-2xl p-6">

                    <h2 className="text-2xl font-bold mb-5">
                        {plannerTrip
                            ? "AI Recommendations"
                            : "Day-by-Day Itinerary"}
                    </h2>

                    {plannerTrip ? (
                        <div className="grid md:grid-cols-2 gap-5 mb-6">
                            {recommendationSections.map(
                                (section) => {
                                    const items =
                                        asList(
                                            recommendations[
                                                section.key
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
                                            <h3 className="font-bold text-xl mb-2">
                                                {
                                                    section.title
                                                }
                                            </h3>

                                            <ul className="list-disc pl-5 space-y-1 text-gray-200">
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

                            {Array.isArray(
                                recommendations.budgetPlan
                            ) &&
                                recommendations.budgetPlan.length >
                                    0 && (
                                    <div className="md:col-span-2">
                                        <h3 className="font-bold text-xl mb-3">
                                            Budget Plan
                                        </h3>

                                        <div className="space-y-3">
                                            {recommendations.budgetPlan.map(
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
                                    </div>
                                )}
                        </div>
                    ) : (
                        trip.days?.map(
                            (day, index) => (
                                <div
                                    key={index}
                                    className="mb-6 border-l-4 border-blue-500 pl-4"
                                >
                                    <h3 className="font-bold text-xl">
                                        {day.title}
                                    </h3>

                                    <ul className="mt-2 list-disc pl-5">
                                        {day.activities?.map(
                                            (
                                                activity,
                                                i
                                            ) => (
                                                <li key={i}>
                                                    {typeof activity ===
                                                        "string"
                                                        ? activity
                                                        : activity.activity_title}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )
                        )
                    )}

                    <a
                        href={`http://localhost:8000/api/itinerary/share/download/${shareId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl"
                    >
                        Download PDF
                    </a>

                </div>

                <div className="mt-8 text-center text-gray-400">
                    Created on{" "}
                    {new Date(
                        itinerary.createdAt
                    ).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default SharePage;
