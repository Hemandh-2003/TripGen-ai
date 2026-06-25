import { useEffect } from "react";
import {
    useSearchParams,
    useNavigate,
} from "react-router-dom";
import API from "../services/api";

const OAuthSuccess = () => {

    const [params] =
        useSearchParams();

    const navigate =
        useNavigate();

    useEffect(() => {

        const handleGoogleLogin =
            async () => {

                const token =
                    params.get(
                        "token"
                    );

                if (!token) return;

                localStorage.setItem(
                    "token",
                    token
                );

                try {

                    const { data } =
                        await API.get(
                            "/protected",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    localStorage.setItem(
                        "userName",
                        data.user.name
                    );

                    localStorage.setItem(
                        "profilePicture",
                        data.user.profilePicture || ""
                    );

                } catch (error) {

                    console.error(error);
                }

                navigate(
                    "/dashboard"
                );
            };

        handleGoogleLogin();

    }, []);

    return (
        <h1>
            Logging in...
        </h1>
    );
};

export default OAuthSuccess;