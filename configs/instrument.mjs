import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://199ab5b7add4c73a765758009ba03ef5@o4510906877804544.ingest.us.sentry.io/4510906882392064",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
