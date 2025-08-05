import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BASE_URL: process.env.BASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_VERIFICATION_CALLBACK_URL: process.env.EMAIL_VERIFICATION_CALLBACK_URL,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  },
};

export default nextConfig;
