import { useMemo, useState } from "react";
import {BiCopy,BiEdit,BiLink,BiSearch,BiTrash,BiCheck,BiX,} from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import BgStyle from "../components/BgStyle";
import { toast } from "react-toastify";
import type { MyLinksProps, MyLinksType } from "../types/myLinksTypes";
function MyLinks({ links, loading ,setLinks}: MyLinksProps) {

  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  

  // Check link status
  const getLinkStatus = (link: MyLinksType) => {
    if (!link.is_active) return "Inactive";

    if (link.expires_at && new Date(link.expires_at).getTime() <= Date.now()) {
      return "Expired";
    }

    return "Active";
  };

  // Search functionality
  const filteredLinks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return links;

    return links.filter((link) => {
      const status = getLinkStatus(link).toLowerCase();

      return (
        link.shortUrl.toLowerCase().includes(query) ||
        link.short_code.toLowerCase().includes(query) ||
        link.original_url.toLowerCase().includes(query) ||
        (link.title || "").toLowerCase().includes(query) ||
        status.includes(query)
      );
    });
  }, [links, search]);

  // Statistics
  const totalLinks = links.length;

  const activeLinks = links.filter(
    (link) => getLinkStatus(link) === "Active",
  ).length;

  const expiredLinks = links.filter(
    (link) => getLinkStatus(link) === "Expired",
  ).length;

  // Copy short URL
  const copyLink = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedId(id);
      toast.success("Link copied successfully!");

      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 1800);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  // Start editing
  const startEdit = (link: MyLinksType) => {
    setEditingId(link.id);
    setEditValue(link.original_url);
    setActiveMenu(null);
  };

  // Save edit (local state only)
  const saveEdit = (id: string) => {
    const value = editValue.trim();
    try {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        toast.error("Please enter a valid HTTP/HTTPS URL.");
        return;
      }

      setLinks((current) =>
        current.map((link) =>
          link.id === id ? { ...link, original_url: parsed.href } : link,
        ),
      );

      setEditingId(null);
      setEditValue("");
      toast.success("Destination updated locally.");
    } catch {
      toast.error("Please enter a valid URL including https://");
    }
  };

  // Delete link (local state only)
  const deleteLink = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this link?")) {
      return;
    }

    setLinks((current) => current.filter((link) => link.id !== id));
    setActiveMenu(null);
    toast.success("Link removed from the current view.");
  };

  const iconButton =
    "inline-flex size-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300";

  return (
    <section className="relative min-h-screen px-4 py-6 text-black dark:text-white sm:px-6 lg:px-8">
      <BgStyle />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="my-4">
          <h1 className="text-3xl font-bold">Welcome back!</h1>

          <p className="text-sm">
            Manage your shortened links and QR codes all in one place.
          </p>
        </div>

        {/* Title and Search */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <BiLink className="size-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                My Links
              </h1>

              <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                View, copy and manage your shortened links.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search links..."
              aria-label="Search links"
              className="w-full rounded-xl border border-emerald-700/20 bg-white/75 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-400/20 dark:bg-slate-950/70 dark:placeholder:text-slate-500"
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

        {/* Stats */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-700/15 bg-white/70 p-5 dark:border-emerald-400/15 dark:bg-slate-950/60">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Total links
            </p>

            <p className="mt-2 text-3xl font-bold">{totalLinks}</p>
          </div>

          <div className="rounded-2xl border border-emerald-700/15 bg-white/70 p-5 dark:border-emerald-400/15 dark:bg-slate-950/60">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Active links
            </p>

            <p className="mt-2 text-3xl font-bold">{activeLinks}</p>
          </div>

          <div className="rounded-2xl border border-emerald-700/15 bg-white/70 p-5 dark:border-emerald-400/15 dark:bg-slate-950/60">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Expired links
            </p>

            <p className="mt-2 text-3xl font-bold">{expiredLinks}</p>
          </div>
        </div>

        {/* Links Table */}
        <div className="mt-7 overflow-visible rounded-2xl border border-emerald-700/20 bg-white/75 shadow-sm dark:border-emerald-400/15 dark:bg-slate-950/70">
          <div className="flex flex-col gap-1 border-b border-emerald-700/15 px-5 py-4 dark:border-emerald-400/15 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-bold">All links</h2>

            <p className="text-xs text-gray-500 dark:text-slate-400">
              Showing {filteredLinks.length} of {links.length} links
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">
              <thead className="bg-emerald-500/6 text-xs uppercase tracking-wider text-gray-600 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">Link</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 font-semibold">Expires</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-emerald-700/10 dark:divide-emerald-400/10">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      Loading your links...
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((link) => {
                    const status = getLinkStatus(link);

                    return (
                      <tr
                        key={link.id}
                        className="transition hover:bg-emerald-500/4"
                      >
                        {/* Link */}
                        <td className="max-w-md px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                              <BiLink className="size-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              {editingId === link.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    className="w-72 max-w-full rounded-lg border border-emerald-500 bg-transparent px-2 py-1 outline-none"
                                    aria-label="Edit destination URL"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => saveEdit(link.id)}
                                    className={iconButton}
                                    aria-label="Save URL"
                                  >
                                    <BiCheck className="size-5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditValue("");
                                    }}
                                    className={iconButton}
                                    aria-label="Cancel editing"
                                  >
                                    <BiX className="size-5" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={link.shortUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="break-all font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
                                    >
                                      {link.shortUrl}
                                    </a>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        copyLink(link.shortUrl, link.id)
                                      }
                                      className={iconButton}
                                      aria-label="Copy short link"
                                      title="Copy short link"
                                    >
                                      {copiedId === link.id ? (
                                        <BiCheck className="size-5 text-emerald-500" />
                                      ) : (
                                        <BiCopy className="size-4" />
                                      )}
                                    </button>
                                  </div>

                                  {link.title && (
                                    <p className="mt-1 text-xs font-medium text-gray-700 dark:text-slate-300">
                                      {link.title}
                                    </p>
                                  )}

                                  <p
                                    title={link.original_url}
                                    className="mt-1 max-w-sm truncate text-xs text-gray-500 dark:text-slate-400"
                                  >
                                    {link.original_url}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-slate-300">
                          {new Date(link.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        {/* Expiry Date */}
                        <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-slate-300">
                          {link.expires_at
                            ? new Date(link.expires_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "Never"}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              status === "Active"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                : status === "Expired"
                                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                  : "bg-gray-500/10 text-gray-600 dark:text-slate-300"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                status === "Active"
                                  ? "bg-emerald-500"
                                  : status === "Expired"
                                    ? "bg-amber-500"
                                    : "bg-gray-500"
                              }`}
                            />

                            {status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => copyLink(link.shortUrl, link.id)}
                              className={iconButton}
                              aria-label="Copy link"
                              title="Copy link"
                            >
                              <BiCopy className="size-5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => startEdit(link)}
                              className={iconButton}
                              aria-label="Edit destination"
                              title="Edit destination"
                            >
                              <BiEdit className="size-5" />
                            </button>

                            <a
                              href={link.original_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={iconButton}
                              aria-label="Open destination"
                              title="Open destination"
                            >
                              <FiExternalLink className="size-5" />
                            </a>

                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMenu(
                                    activeMenu === link.id ? null : link.id,
                                  )
                                }
                                className={iconButton}
                                aria-label="More actions"
                                aria-expanded={activeMenu === link.id}
                              >
                                <BsThreeDots className="size-5" />
                              </button>

                              {activeMenu === link.id && (
                                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-emerald-700/20 bg-white p-1 shadow-xl dark:border-emerald-400/20 dark:bg-slate-900">
                                  <button
                                    type="button"
                                    onClick={() => startEdit(link)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-emerald-500/10"
                                  >
                                    <BiEdit className="size-4" />
                                    Edit destination
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => deleteLink(link.id)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-500/10 dark:text-red-400"
                                  >
                                    <BiTrash className="size-4" />
                                    Delete link
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && filteredLinks.length === 0 && (
            <div className="px-5 py-14 text-center">
              <BiSearch className="mx-auto size-9 text-gray-400" />

              <p className="mt-3 font-semibold">No links found</p>

              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                {search
                  ? "Try another search term."
                  : "You haven't created any short links yet."}
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
          )}
        </div>
      </div>
    </section>
  );
}

export default MyLinks;
