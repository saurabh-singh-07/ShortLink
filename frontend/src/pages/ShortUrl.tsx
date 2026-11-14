import React, { useEffect, useState } from "react";
import { BsArrowRight, BsDot, BsQrCode } from "react-icons/bs";
import { BiCopy, BiDownload, BiLink, BiCheckCircle, BiX } from "react-icons/bi";
import { CgCopy } from "react-icons/cg";
import BgStyle from "../components/BgStyle";
import type { ShortResult } from "../types/ShortURL";
import api from "../api/api";
import { useAuthHeaders } from "../utils/getAuthHeaders";
type Mode = "short" | "qr";

function ShortUrl() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<Mode>("short");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const {getAuthHeaders} = useAuthHeaders();

  const [shortResult, setShortResult] = useState<ShortResult | null>(null);

  const [qrResult, setQrResult] = useState("");

  const validateUrl = (value: string) => {
    try {
      const parsed = new URL(value.trim());
      return (
        ["http:", "https:"].includes(parsed.protocol) &&
        parsed.hostname.includes(".")
      );
    } catch {
      return false;
    }
  };
  useEffect(() => {
    setShortResult(null);
    setQrResult("");
    setError("");
    setTitle("");
    setCopied(false);
  }, [mode]);

  const handleClear = () => {
    setUrl("");
    setTitle("");
    setShortResult(null);
    setQrResult("");
    setError("");
    setCopied(false);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setError("");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy. Please copy manually.");
    }
  };

  const expiredAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();
  

  const generateShortUrl = async (originalUrl: string) => {
    try {
      const response = await api.post(
        "/api/urls",
        { originalUrl, title, expiredAt },
        { headers: getAuthHeaders() },
      );

      const data = response?.data;
      const generatedUrl = data?.url?.shortUrl;

      if (!generatedUrl || typeof generatedUrl !== "string") {
        throw new Error(
          "Short URL was not returned by the backend. Check your API response.",
        );
      }
      setShortResult({
        originalUrl,
        shortUrl: generatedUrl,
        clicks: data.clicks ?? 0,
        expiresAt: data.expiresAt ?? data.expires_at ?? null,
      });
    } catch (error) {
      console.error(error);
      setError("failed to generating short url...");
    }
  };

  const generateQRCode = async (url: string) => {
    const response = await api.post(
      "/api/qr/generate",
      { url },
      { headers: getAuthHeaders() },
    );
    console.log(response);

    const data = response.data;

    const generatedQR = data?.qrCode?.image;

    if (!generatedQR || typeof generatedQR !== "string") {
      throw new Error(
        "QR code was not returned by the backend. Check your API response.",
      );
    }

    setQrResult(generatedQR);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setShortResult(null);
    setQrResult("");
    setCopied(false);

    const originalUrl = url.trim();

    if (!originalUrl) {
      setError("Please enter a URL first.");
      return;
    }

    if (!validateUrl(originalUrl)) {
      setError("Enter a valid URL starting with https:// or http://.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "short") {
        await generateShortUrl(originalUrl);
      } else {
        await generateQRCode(originalUrl);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Download backend-generated QR code
  const handleDownload = () => {
    if (!qrResult) return;

    const anchor = document.createElement("a");

    anchor.href = qrResult;
    anchor.download = "linkshort-qr-code.png";
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const inputClasses =
    "w-full min-w-0 rounded-xl border border-emerald-600/30 bg-white/80 px-4 py-3 text-sm text-black placeholder:text-gray-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-400";

  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600/30 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-500/10 dark:text-emerald-300";

  return (
    <section>
      <BgStyle />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        {/* Heading */}
        <header className="my-12 max-w-3xl text-center sm:my-16">
          <p className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.18em] text-emerald-700 dark:text-emerald-400 sm:text-sm">
            LINKSHORT
            <BsDot className="size-5 rounded-full bg-emerald-500 text-emerald-500" />
            SHORTEN OR GENERATE QR
          </p>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Shorten Your Links or
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">
              Generate a QR Code
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-600 dark:text-slate-300 sm:text-base">
            Turn long URLs into clean, shareable links or generate a QR code in
            seconds.
          </p>
        </header>

        {/* Main Card */}
        <div className="w-full rounded-2xl border border-emerald-700/20 bg-white/80 p-4 shadow-xl shadow-emerald-950/5 backdrop-blur-xl dark:border-emerald-400/15 dark:bg-slate-950/75 sm:p-7">
          <form onSubmit={handleSubmit}>
            {/* URL Input */}
            <label
              htmlFor="long-url"
              className="mb-2 block text-sm font-semibold"
            >
              Your destination URL
            </label>

            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className={`w-60 my-4 min-w-0 rounded-xl border border-emerald-600/30 bg-white/80 px-4 py-3 text-sm text-black placeholder:text-gray-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-400`}
              placeholder="Enter Title here..."
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="long-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                placeholder="https://example.com/your-very-long-url"
                className={inputClasses}
                autoComplete="url"
              />

              <button
                type="button"
                onClick={handleClear}
                className={secondaryButton}
              >
                <BiX className="size-5" />
                Clear
              </button>
            </div>

            {/* Mode Selection */}
            <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Short URL */}
              <button
                type="button"
                onClick={() => setMode("short")}
                aria-pressed={mode === "short"}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  mode === "short"
                    ? "border-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "border-gray-300 bg-white/50 hover:border-emerald-500 dark:border-slate-700 dark:bg-white/3"
                }`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <BiLink className="size-7" />
                </span>

                <span>
                  <span className="block font-bold">Shorten URL</span>

                  <span className="mt-1 block text-xs text-gray-600 dark:text-slate-400">
                    Create a clean, short link
                  </span>
                </span>

                {mode === "short" && (
                  <BiCheckCircle className="ml-auto size-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>

              {/* QR Code */}
              <button
                type="button"
                onClick={() => setMode("qr")}
                aria-pressed={mode === "qr"}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  mode === "qr"
                    ? "border-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "border-gray-300 bg-white/50 hover:border-emerald-500 dark:border-slate-700 dark:bg-white/3"
                }`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <BsQrCode className="size-7" />
                </span>

                <span>
                  <span className="block font-bold">Generate QR Code</span>

                  <span className="mt-1 block text-xs text-gray-600 dark:text-slate-400">
                    Make a scannable QR code
                  </span>
                </span>

                {mode === "qr" && (
                  <BiCheckCircle className="ml-auto size-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3.5 font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-52"
            >
              {loading
                ? "Please wait..."
                : mode === "short"
                  ? "Shorten URL"
                  : "Generate QR Code"}

              {!loading &&
                (mode === "short" ? (
                  <BsArrowRight className="size-5" />
                ) : (
                  <BsQrCode className="size-5" />
                ))}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {/* Short URL Result */}
          {mode === "short" && shortResult && (
            <div
              aria-live="polite"
              className="mt-7 rounded-2xl border border-emerald-500/30 bg-emerald-500/6 p-4 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <BiCheckCircle className="size-6" />
                </span>

                <div>
                  <h2 className="text-lg font-bold">
                    Your short link is ready!
                  </h2>

                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Your destination URL has been shortened successfully.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-emerald-600/20 bg-white p-3 dark:bg-black/30 sm:flex-row sm:items-center">
                <a
                  href={shortResult.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 break-all font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
                >
                  {shortResult.shortUrl}
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(shortResult.shortUrl)}
                  className={secondaryButton}
                >
                  {copied ? (
                    <BiCheckCircle className="size-5" />
                  ) : (
                    <BiCopy className="size-5" />
                  )}

                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-slate-400">
                {shortResult.expiresAt && (
                  <span>
                    Expires:{" "}
                    {new Date(shortResult.expiresAt).toLocaleDateString()}
                  </span>
                )}

                <span>Clicks: {shortResult.clicks}</span>
              </div>
            </div>
          )}

          {/* QR Code Result */}
          {mode === "qr" && qrResult && (
            <div
              aria-live="polite"
              className="mt-7 rounded-2xl border border-emerald-500/30 bg-emerald-500/6 p-4 sm:p-6"
            >
              <div className="text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <BsQrCode className="size-7" />
                </span>

                <h2 className="mt-3 text-lg font-bold">
                  Your QR code is ready!
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                  Scan the code to open your destination URL.
                </p>

                {/* Backend-generated QR image */}
                <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-3 shadow-sm">
                  <img
                    src={qrResult}
                    alt="QR code for your destination URL"
                    className="size-56 max-w-full object-contain sm:size-64"
                  />
                </div>

                <p className="mx-auto mt-4 max-w-lg break-all text-xs text-gray-600 dark:text-slate-400">
                  {url.trim()}
                </p>

                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-black transition hover:bg-emerald-400"
                  >
                    <BiDownload className="size-5" />
                    Download PNG
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(url.trim())}
                    className={secondaryButton}
                  >
                    <CgCopy className="size-5" />
                    {copied ? "Copied!" : "Copy original link"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!shortResult && !qrResult && !error && (
            <div className="mt-5 rounded-xl border border-dashed border-emerald-700/20 p-5 text-center dark:border-emerald-400/20">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                {mode === "short"
                  ? "Your shortened link will appear here."
                  : "Your QR code will appear here."}
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                Paste a URL above and select{" "}
                {mode === "short" ? "Shorten URL" : "Generate QR Code"}.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-slate-400">
          Simple links. Easy sharing. One scan away.
        </p>
      </div>
    </section>
  );
}

export default ShortUrl;
