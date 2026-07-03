// Local development entry point.
// Imports the Express app and starts the HTTP server.
// On Vercel, api/index.js is used instead.
import app from "./src/index.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Contact API running on http://localhost:${PORT}/api/health`);
});

const shutdown = () => process.exit(0);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
