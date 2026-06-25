import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";
import {
    isValidPassword,
    PASSWORD_RULE_MESSAGE,
} from "../utils/passwordRules";

const ProfilePage = () => {
    const [itineraries, setItineraries] =
        useState([]);

    const [user, setUser] =
        useState(null);

    const [editMode, setEditMode] =
        useState(false);

    const [name, setName] =
        useState("");

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [changingPassword, setChangingPassword] =
        useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const [
                    historyRes,
                    profileRes,
                ] = await Promise.all([
                    API.get(
                        "/itinerary/history"
                    ),

                    API.get(
                        "/user/profile"
                    ),
                ]);

                setItineraries(
                    historyRes.data
                        .itineraries
                );

                setUser(
                    profileRes.data.user
                );

                setName(
                    profileRes.data.user.name
                );

            } catch (error) {

                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {

        if (!name.trim()) {

            toast.error(
                "Name cannot be empty"
            );

            return;
        }

        try {

            const { data } =
                await API.put(
                    "/user/profile",
                    {
                        name,
                    }
                );

            setUser(
                data.user
            );

            setEditMode(
                false
            );

            toast.success(
                "Profile Updated"
            );

        } catch (error) {

            console.error(
                error
            );

            toast.error(
                "Update Failed"
            );
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            toast.error(
                "Fill all password fields"
            );

            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            toast.error(
                "New passwords do not match"
            );

            return;
        }

        if (!isValidPassword(newPassword)) {
            toast.error(PASSWORD_RULE_MESSAGE);

            return;
        }

        try {
            setChangingPassword(true);

            await API.put(
                "/user/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            toast.success(
                "Password Changed"
            );
        } catch (error) {
            toast.error(
                error.response?.data
                    ?.message ||
                "Password change failed"
            );
        } finally {
            setChangingPassword(false);
        }
    };


    const totalTrips =
        itineraries.length;

    const totalShared =
        itineraries.filter(
            (item) => item.shareId
        ).length;

    const latestDestination =
        itineraries.length > 0
            ? (() => {
                try {
                    return JSON.parse(
                        itineraries[0]
                            .itinerary
                    ).destination;
                } catch {
                    return "N/A";
                }
            })()
            : "N/A";

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Profile Header */}

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

                    <div className="flex items-center gap-5">

                        <div className="flex flex-col items-center">

                            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">

                                {user.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                            </div>

                        </div>

                        <div>

                            {editMode ? (

                                <input
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white"
                                />

                            ) : (

                                <h1 className="text-4xl font-bold">
                                    {user.name}
                                </h1>

                            )}

                            <p className="text-gray-400 mt-2">
                                {user.email}
                            </p>

                            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-500/20 text-sm">

                                {user.authProvider ===
                                    "google"
                                    ? "Google Account"
                                    : "Local Account"}

                            </span>

                            <div className="mt-4 flex gap-3">

                                {editMode ? (
                                    <>
                                        <button
                                            onClick={
                                                handleSave
                                            }
                                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => {

                                                setName(
                                                    user.name
                                                );

                                                setEditMode(
                                                    false
                                                );

                                            }}
                                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (

                                    <button
                                        onClick={() =>
                                            setEditMode(
                                                true
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
                                    >
                                        Edit Profile
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

                {/* Change Password */}

                {user.authProvider === "local" && (
                    <form
                        onSubmit={handleChangePassword}
                        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mt-10"
                    >

                        <h2 className="text-3xl font-bold mb-6">
                            Change Password
                        </h2>

                        <div className="grid md:grid-cols-3 gap-4">

                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                            />

                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                            />

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
                            />

                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            New password must be at least 6 characters with lowercase, uppercase, number, and special character.
                        </p>

                        <button
                            type="submit"
                            disabled={changingPassword}
                            className="mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-60 px-5 py-3 rounded-xl font-semibold"
                        >
                            {changingPassword
                                ? "Changing..."
                                : "Change Password"}
                        </button>

                    </form>
                )}

                {/* Travel Insights */}

                <div className="grid md:grid-cols-3 gap-6 mt-10">

                    <InsightCard
                        title="Total Trips"
                        value={totalTrips}
                        icon="🧳"
                    />

                    <InsightCard
                        title="Shared Trips"
                        value={totalShared}
                        icon="🔗"
                    />

                    <InsightCard
                        title="Last Destination"
                        value={
                            latestDestination
                        }
                        icon="📍"
                    />

                </div>

                {/* Recent Trips */}

                <div className="mt-12">

                    <h2 className="text-3xl font-bold mb-6">
                        Recent Trips
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        {itineraries
                            .slice(0, 4)
                            .map((item) => {

                                try {

                                    const trip =
                                        JSON.parse(
                                            item.itinerary
                                        );

                                    return (
                                        <div
                                            key={
                                                item._id
                                            }
                                            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                                        >

                                            <h3 className="text-xl font-semibold">

                                                📍{" "}
                                                {
                                                    trip.destination
                                                }

                                            </h3>

                                            <p className="text-gray-300 mt-2">

                                                🏨{" "}
                                                {
                                                    trip.hotel
                                                }

                                            </p>

                                            <p className="text-gray-400 mt-3">

                                                {
                                                    trip.checkIn
                                                }

                                            </p>

                                        </div>
                                    );

                                } catch {

                                    return null;
                                }
                            })}

                    </div>

                </div>

            </div>

        </div>
    );
};

const InsightCard = ({
    title,
    value,
    icon,
}) => (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

        <div className="text-4xl mb-3">
            {icon}
        </div>

        <h3 className="text-gray-400">
            {title}
        </h3>

        <p className="text-2xl font-bold mt-2">
            {value}
        </p>

    </div>
);

export default ProfilePage;
