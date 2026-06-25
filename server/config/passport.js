import passport from "passport";
import { Strategy as GoogleStrategy }
    from "passport-google-oauth20";

import User from "../models/User.js";

passport.use(
    new GoogleStrategy(
        {
            clientID:
                process.env.GOOGLE_CLIENT_ID,

            clientSecret:
                process.env.GOOGLE_CLIENT_SECRET,

            callbackURL:
                "http://localhost:8000/api/auth/google/callback",
        },

        async (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {

            try {

                let user = await User.findOne({
                    email: profile.emails[0].value,
                });

                if (!user) {

                    user =
                        await User.create({
                            googleId:
                                profile.id,

                            name:
                                profile.displayName,

                            email:
                                profile.emails[0].value,

                            profilePicture:
                                profile.photos[0].value,

                            authProvider:
                                "google",
                        });
                }

                done(
                    null,
                    user
                );

            } catch (error) {

                done(
                    error,
                    null
                );
            }
        }
    )
);

export default passport;