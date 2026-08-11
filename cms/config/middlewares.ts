export default ({ env }) => [
  "global::health",
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // keep default sources and allow Cloudinary images and Strapi market assets
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "https://res.cloudinary.com",
            "https://market-assets.strapi.io",
          ],
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
