
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { BiCopy, BiDownload, BiLink, BiSearch, BiX, BiCheck } from "react-icons/bi";
import { BsQrCode } from "react-icons/bs";
import BgStyle from "../components/BgStyle";
import api from "../api/api";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import type { QRCodeResponse, QRCodeType } from "../types/QrCodeTypes";
import { useAuthHeaders } from "../utils/getAuthHeaders";

function QRCodes() {
  const { accessToken } = useAuth();

  const [codes, setCodes] = useState<QRCodeType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {getAuthHeaders} = useAuthHeaders();

  // Fetch QR codes
  const getQRCodes = async () => {
    try {
      setLoading(true);
      const response = await api.get<QRCodeResponse>("/api/qr/", {
        headers: getAuthHeaders(),
      });

      if (response.data.success) {
        setCodes(response.data.qrCodes || []);
        setTotalCount(response.data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching QR codes:", error);
      toast.error("Unable to fetch QR codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getQRCodes();
    } else {
      setCodes([]);
      setTotalCount(0);
      setLoading(false);
    }
  }, [accessToken]);

  // Generate QR previews
  useEffect(() => {
    let cancelled = false;

    const generatePreviews = async () => {
      try {
        const results = await Promise.all(
          codes.map(async (code) => {
            try {
              const dataUrl = await QRCode.toDataURL(code.originalUrl, {
                width: 240,
                margin: 2,
                errorCorrectionLevel: "H",
                color: {
                  dark: "#064e3b",
                  light: "#ffffff",
                },
              });

              return [code.id, dataUrl] as const;
            } catch (error) {
              console.error("QR generation error:", error);
              return [code.id, ""] as const;
            }
          })
        );

        if (!cancelled) {
          setPreviews(Object.fromEntries(results));
        }
      } catch (error) {
        console.error("Preview generation failed:", error);
      }
    };

    if (codes.length > 0) {
      generatePreviews();
    } else {
      setPreviews({});
    }

    return () => {
      cancelled = true;
    };
  }, [codes]);

  // Search QR codes
  const filteredCodes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return codes;

    return codes.filter((code) =>
      code.originalUrl.toLowerCase().includes(query)
    );
  }, [codes, search]);

  // Copy original URL
  const copyLink = async (code: QRCodeType) => {
    try {
      await navigator.clipboard.writeText(code.originalUrl);

      setCopiedId(code.id);
      toast.success("URL copied successfully!");

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === code.id ? null : current
        );
      }, 1800);
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Unable to copy URL.");
    }
  };

  // Download QR code
  const downloadQR = (code: QRCodeType, index: number) => {
    const image = previews[code.id];

    if (!image) {
      toast.error("QR code is not ready yet.");
      return;
    }

    const anchor = document.createElement("a");

    anchor.href = image;
    anchor.download = `qr-code-${index + 1}.png`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    toast.success("QR code downloaded!");
  };
  return (
    <section className="relative min-h-screen px-4 py-6 text-black dark:text-white sm:px-6 lg:px-8">
      <BgStyle />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Welcome Header */}
        <div className="my-4">
          <h1 className="text-3xl font-bold">
            Welcome back!
          </h1>

          <p className="text-sm">
            Manage your shortened links and QR codes all in one place.
          </p>
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <BsQrCode className="size-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                My QR Codes
              </h1>

              <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                View, download and manage your QR codes.
              </p>
            </div>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={getQRCodes}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
          >
            <BiCheck className="size-5" />
            {loading ? "Loading..." : "Refresh QR Codes"}
          </button>

        </div>

        {/* Statistics */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-emerald-700/15 bg-white/75 p-5 dark:border-emerald-400/15 dark:bg-slate-950/60">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Total QR codes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-700/15 bg-white/75 p-5 dark:border-emerald-400/15 dark:bg-slate-950/60">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Showing QR codes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {filteredCodes.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-700/15 bg-white/75 p-5 dark:border-emerald-400/15 dark:bg-slate-950/60">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Ready to download
            </p>

            <p className="mt-2 text-3xl font-bold">
              {Object.values(previews).filter(Boolean).length}
            </p>
          </div>

        </div>

        {/* QR Codes Listing */}
        <div className="mt-7 rounded-2xl border border-emerald-700/20 bg-white/75 p-4 dark:border-emerald-400/15 dark:bg-slate-950/70 sm:p-6">

          {/* Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold">
                All QR Codes
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                {filteredCodes.length} of {totalCount} QR codes
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search QR codes..."
                aria-label="Search QR codes"
                className="w-full rounded-xl border border-emerald-700/20 bg-white py-2.5 pl-10 pr-10 text-sm text-black outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-400/20 dark:bg-slate-950 dark:text-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <BiX className="size-5" />
                </button>
              )}
            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto size-9 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />

              <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
                Loading your QR codes...
              </p>
            </div>
          ) : filteredCodes.length === 0 ? (

            /* Empty State */
            <div className="py-16 text-center">
              <BsQrCode className="mx-auto size-10 text-gray-400" />

              <p className="mt-3 font-semibold">
                No QR codes found
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                {search
                  ? "Try a different search term."
                  : "You haven't created any QR codes yet."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black"
                >
                  Clear search
                </button>
              )}
            </div>

          ) : (

            /* QR Cards */
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {filteredCodes.map((code, index) => (
                <article
                  key={code.id}
                  className="rounded-2xl border border-emerald-700/15 bg-white p-4 transition hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/5 dark:border-emerald-400/15 dark:bg-slate-900/70"
                >

                  {/* QR Preview */}
                  <div className="flex min-h-52 items-center justify-center rounded-xl bg-emerald-500/5 p-4 dark:bg-white/3">

                    {previews[code.id] ? (
                      <img
                        src={previews[code.id]}
                        alt={`QR code for ${code.originalUrl}`}
                        className="size-44 rounded-lg bg-white p-2 object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <BsQrCode className="size-12" />
                        <span className="text-xs">
                          Generating preview...
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Details */}
                  <div className="mt-4">

                    <h3 className="font-bold">
                      QR Code #{index + 1}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      ID: {code.id}
                    </p>

                    <a
                      href={code.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={code.originalUrl}
                      className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 hover:underline dark:text-emerald-300"
                    >
                      <BiLink className="size-4 shrink-0" />

                      <span className="truncate">
                        {code.originalUrl}
                      </span>

                    </a>

                    {/* Creation Date */}
                    <div className="mt-4 border-t border-emerald-700/10 pt-3 text-xs text-gray-500 dark:border-emerald-400/10 dark:text-slate-400">

                      Created{" "}
                      {new Date(code.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}

                    </div>

                    {/* Actions */}
                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <button
                        type="button"
                        onClick={() => downloadQR(code, index)}
                        disabled={!previews[code.id]}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
                      >
                        <BiDownload className="size-4" />
                        Download
                      </button>

                      <button
                        type="button"
                        onClick={() => copyLink(code)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-700/20 px-3 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-500/10 dark:border-emerald-400/20 dark:text-emerald-300"
                      >
                        {copiedId === code.id ? (
                          <BiCheck className="size-4" />
                        ) : (
                          <BiCopy className="size-4" />
                        )}

                        {copiedId === code.id ? "Copied!" : "Copy URL"}
                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default QRCodes;
