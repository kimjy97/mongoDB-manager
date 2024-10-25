/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
  env: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: "false",
  },
};

export default nextConfig;
