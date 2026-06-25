import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const UploadPage = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const navigate = useNavigate();

    const onDrop = (acceptedFiles) => {
        setFiles(acceptedFiles);
    };

    const {
        getRootProps,
        getInputProps,
    } = useDropzone({
        multiple: true,

        accept: {
            "application/pdf": [".pdf"],

            "image/jpeg": [".jpg", ".jpeg"],

            "image/png": [".png"],
        },

        onDrop,
    });

    const handleUpload = async () => {
        try {
            if (files.length === 0) {
                toast.error(
                    "Please select at least one file"
                );
                return;
            }

            const token =
                localStorage.getItem(
                    "token"
                );

            if (!token) {
                toast.error(
                    "Please login first"
                );

                navigate("/");

                return;
            }

            setLoading(true);

            const formData =
                new FormData();

            files.forEach((files) => {
                formData.append(
                    "documents",
                    files
                );
            });

            const { data } =
                await axios.post(
                    "/api/upload",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            setResponse(data);

            toast.success(
                "Itinerary Generated Successfully"
            );
        } catch (error) {

            console.error(error);

            if (
                error.response?.status === 503
            ) {
                toast.error(
                    "AI service is busy. Please try again in a few moments."
                );
            } else {
                toast.error(
                    error.response?.data?.message ||
                    "Upload Failed"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    let travelData = null;

    try {
        if (
            response?.itinerary
                ?.itinerary
        ) {
            travelData = JSON.parse(
                response.itinerary
                    .itinerary
            );
        }
    } catch (error) {
        console.error(
            "Invalid itinerary JSON",
            error
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-12">

                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold mb-4">
                        Upload Travel Documents
                    </h1>

                    <p className="text-gray-300 text-lg">
                        Upload flight tickets,
                        hotel bookings,
                        visas and travel
                        confirmations.
                    </p>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">

                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 transition"
                    >
                        <input
                            {...getInputProps()}
                        />

                        <div className="text-7xl mb-4">
                            📄
                        </div>

                        <h3 className="text-2xl font-semibold">
                            Drag & Drop Travel Document
                        </h3>

                        <p className="text-gray-400 mt-2">
                            or click to browse PDF, JPG, PNG, WEBP
                        </p>

                        {files.length > 0 && (
                            <div className="mt-5 space-y-2">
                                {files.map((files, index) => (
                                    <p
                                        key={index}
                                        className="text-green-400"
                                    >
                                        ✓ {files.name}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-4 mt-8">

                        <button
                            onClick={
                                handleUpload
                            }
                            disabled={
                                loading
                            }
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
                        >
                            {loading
                                ? "Generating..."
                                : "Generate Itinerary"}
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/history"
                                )
                            }
                            className="bg-gray-700 hover:bg-gray-800 px-8 py-3 rounded-xl"
                        >
                            History
                        </button>

                    </div>

                    {travelData && (
                        <div className="mt-10 space-y-6">

                            <div className="grid md:grid-cols-4 gap-4">

                                <div className="bg-white/10 p-5 rounded-2xl">
                                    <div className="text-3xl mb-2">
                                        📍
                                    </div>

                                    <h4 className="text-sm text-gray-400">
                                        Destination
                                    </h4>

                                    <p className="font-semibold">
                                        {travelData.destination}
                                    </p>
                                </div>

                                <div className="bg-white/10 p-5 rounded-2xl">
                                    <div className="text-3xl mb-2">
                                        🏨
                                    </div>

                                    <h4 className="text-sm text-gray-400">
                                        Hotel
                                    </h4>

                                    <p className="font-semibold">
                                        {travelData.hotel}
                                    </p>
                                </div>

                                <div className="bg-white/10 p-5 rounded-2xl">
                                    <div className="text-3xl mb-2">
                                        📅
                                    </div>

                                    <h4 className="text-sm text-gray-400">
                                        Check In
                                    </h4>

                                    <p className="font-semibold">
                                        {travelData.checkIn}
                                    </p>
                                </div>

                                <div className="bg-white/10 p-5 rounded-2xl">
                                    <div className="text-3xl mb-2">
                                        🛫
                                    </div>

                                    <h4 className="text-sm text-gray-400">
                                        Check Out
                                    </h4>

                                    <p className="font-semibold">
                                        {travelData.checkOut}
                                    </p>
                                </div>

                            </div>

                            <div className="bg-white/10 rounded-2xl p-6">
                                <h3 className="text-2xl font-bold mb-3">
                                    Travel Summary
                                </h3>

                                <p>
                                    {travelData.summary}
                                </p>

                                <p className="mt-3">
                                    Guests:{" "}
                                    {
                                        travelData.guests
                                    }
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-2xl p-6">
                                <h3 className="text-2xl font-bold mb-5">
                                    Day-by-Day Itinerary
                                </h3>

                                {travelData.days?.map(
                                    (
                                        day,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="mb-6 border-l-4 border-blue-500 pl-4"
                                        >
                                            <h4 className="font-bold text-xl">
                                                {
                                                    day.title
                                                }
                                            </h4>

                                            <ul className="mt-2 list-disc pl-5">
                                                {day.activities?.map(
                                                    (activity, i) => (
                                                        <li key={i}>
                                                            <strong>
                                                                {activity.time}
                                                            </strong>
                                                            {" - "}
                                                            {activity.activity_title}

                                                            <div className="text-sm text-gray-400">
                                                                {activity.description}
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="bg-white/10 rounded-2xl p-6">

                                <h3 className="text-xl font-bold mb-4">
                                    Share Itinerary
                                </h3>

                                <div className="flex gap-3 flex-wrap">

                                    <a
                                        href={
                                            response.shareUrl
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
                                    >
                                        Open Link
                                    </a>

                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                response.shareUrl
                                            );

                                            toast.success(
                                                "Link Copied"
                                            );
                                        }}
                                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
                                    >
                                        Copy Link
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default UploadPage;
