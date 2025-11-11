// server.js (revisi)
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());

// CORS: untuk keamanan Anda bisa set ORIGINS via env, default: allow all (ubah di production)
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
  : null;

app.use(
  cors(
    allowedOrigins ? { origin: allowedOrigins } : {} // empty => allow all (dev). Set CORS_ORIGINS in production.
  )
);

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_BASE =
  process.env.MIDTRANS_BASE || "https://app.sandbox.midtrans.com";

if (!MIDTRANS_SERVER_KEY) {
  console.error(
    "🔥 MIDTRANS_SERVER_KEY is not set. Set env variable MIDTRANS_SERVER_KEY."
  );
  // don't exit so health can still show helpful message
}

// health
app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    midtrans_key_present: Boolean(MIDTRANS_SERVER_KEY),
  });
});

app.post("/api/create-midtrans", async (req, res) => {
  if (!MIDTRANS_SERVER_KEY) {
    return res
      .status(500)
      .json({ error: "MIDTRANS_SERVER_KEY not configured on server." });
  }

  try {
    const url = `${MIDTRANS_BASE.replace(/\/+$/, "")}/snap/v1/transactions`;
    console.log("[proxy] create midtrans tx ->", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic " + Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64"),
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[proxy] midtrans returned non-ok:", response.status, data);
      return res.status(502).json({ error: "Midtrans error", details: data });
    }

    if (!data || !data.token) {
      console.warn("[proxy] midtrans response missing token:", data);
      return res.status(502).json({
        error: "Midtrans response invalid (no token)",
        details: data,
      });
    }

    // return token only
    return res.status(200).json({ token: data.token });
  } catch (error) {
    console.error("[proxy] create-midtrans error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal proxy error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Midtrans proxy berjalan pada port ${PORT}`);
});
