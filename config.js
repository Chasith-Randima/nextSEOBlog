import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const API = publicRuntimeConfig.PRODUCTION
  ? "https://seo-blog-backend.onrender.com/api"
  : "http://127.0.0.1:8000/api";
// export const API = publicRuntimeConfig.PRODUCTION
//   ? "https://seoblog.com"
//   : "http://127.0.0.1:8000/api";
export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const DOMAIN = publicRuntimeConfig.PRODUCTION
  ? publicRuntimeConfig.DOMAIN_PRODUCTION
  : publicRuntimeConfig.DOMAIN_DEVELOPMENT;

export const FB_APP_ID = publicRuntimeConfig.FB_APP_ID;
export const DISQUS_SHORTNAME = publicRuntimeConfig.DISQUS_SHORTNAME;
export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;
