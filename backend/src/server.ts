import "dotenv/config";
import app from "./app.js";
import { recoverStuckRoasts } from "./controllers/roast.controller.js";

const PORT = process.env.PORT || 8000;

async function boot() {
  await recoverStuckRoasts();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

boot().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
