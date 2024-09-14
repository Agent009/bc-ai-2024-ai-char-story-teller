import withLlamaIndex from "llamaindex/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  //   webpack(config) {
  //     config.experiments = {
  //       ...config.experiments,
  //       asyncWebAssembly: true,
  //     };
  //     return config;
  //   },
};

export default withLlamaIndex(nextConfig);
