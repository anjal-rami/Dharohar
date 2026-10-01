import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  AlertTriangle,
  History,
  LogOut,
  Maximize2,
  X,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  verifyAdminCredentials,
  getPendingSubmissions,
  moderateSubmission,
  type AdminSession,
  type ModerationLogEntry,
} from "@/lib/auth-server";
import { type ArchiveSubmission } from "@/lib/archive-server";
import { REELS, PRESERVATION_REPORTS } from "@/lib/heritage-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "National Heritage Moderation Cell — Executive Admin Portal | Dharohar" },
      {
        name: "description",
        content:
          "High-security administrative moderation gateway for Archaeological Survey of India (ASI) and Ministry of Culture officials.",
      },
      { property: "og:title", content: "National Heritage Moderation Cell — Dharohar" },
      {
        property: "og:description",
        content:
          "Official administrative gateway for verifying citizen archive provenance, sealing records, and auditing community submissions.",
      },
    ],
  }),
  component: AdminPage,
});

const SESSION_STORAGE_KEY = "dharohar_admin_session";

function AdminPage() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Login form state
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Dashboard queue state
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [items, setItems] = useState<ArchiveSubmission[]>([]);
  const [metrics, setMetrics] = useState({
    totalSubmissions: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    communityFlags: 3,
  });
  const [auditLogs, setAuditLogs] = useState<ModerationLogEntry[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Filters & Search
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Lightbox modal state
  const [lightboxMedia, setLightboxMedia] = useState<{
    url: string;
    title: string;
    contributor: string;
    description: string;
  } | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxMedia(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // SSR-safe session hydration
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminSession;
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          setSession(parsed);
        } else {
          window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    } finally {
      setCheckingSession(false);
    }
  }, []);

  // Load submissions whenever session is active
  const loadQueueData = async () => {
    try {
      setLoadingQueue(true);
      const res = await getPendingSubmissions();
      if (res.success) {
        setItems(res.items);
        setMetrics(res.metrics);
        setAuditLogs(res.auditLogs);
      }
    } catch (err) {
      toast.error("Failed to sync queue data with server.");
    } finally {
      setLoadingQueue(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadQueueData();
    }
  }, [session]);

  // Handle Passkey Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passkey.trim()) {
      setHasError(true);
      setErrorMessage("Passkey cannot be empty.");
      return;
    }

    try {
      setIsVerifying(true);
      setHasError(false);
      setErrorMessage("");

      const res = await verifyAdminCredentials({ data: { passkey: passkey.trim() } });

      if (res.success && res.session) {
        setSession(res.session);
        try {
          window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(res.session));
        } catch {
          // sessionStorage fallback
        }
        toast.success("Security clearance verified. Welcome, Heritage Officer.", {
          description: "High-clearance session initialized for SIH 2026 Jury Presentation.",
        });
      } else {
        setHasError(true);
        setErrorMessage(res.error || "Authentication failed. Incorrect passkey.");
        toast.error("Access Denied", {
          description: "Unauthorized credentials for National Heritage Moderation Cell.",
        });
      }
    } catch {
      setHasError(true);
      setErrorMessage("Network error during security clearance check.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    try {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    toast.info("Session terminated", {
      description: "Portal locked. Returning to high-security gateway.",
    });
  };

  // Moderate single item with optimistic UI updates
  const handleModerate = async (submissionId: string, action: "approve" | "reject") => {
    const item = items.find((i) => i.id === submissionId);
    if (!item) return;

    const itemNotes = notes[submissionId] || "";
    setActionInProgress(submissionId);

    // Optimistic UI updates
    const previousItems = [...items];
    const previousMetrics = { ...metrics };

    const updatedStatus = action === "approve" ? "approved" : "rejected";
    setItems((prev) =>
      prev.map((i) =>
        i.id === submissionId
          ? {
              ...i,
              status: updatedStatus,
              verifiedByCommunity: action === "approve",
              verifiedBy: action === "approve" ? "Ministry / ASI Heritage Cell" : undefined,
              moderationNotes:
                itemNotes.trim() ||
                (action === "approve"
                  ? "Officially authenticated by ASI Heritage Moderation Cell."
                  : "Rejected by moderation committee."),
            }
          : i,
      ),
    );

    // Optimistic metric adjustments
    setMetrics((prev) => {
      const wasPending = item.status === "pending" || !item.status;
      return {
        ...prev,
        pendingCount: wasPending ? Math.max(0, prev.pendingCount - 1) : prev.pendingCount,
        approvedCount: action === "approve" ? prev.approvedCount + 1 : prev.approvedCount,
        rejectedCount: action === "reject" ? prev.rejectedCount + 1 : prev.rejectedCount,
      };
    });

    try {
      const res = await moderateSubmission({
        data: {
          submissionId,
          action,
          notes: itemNotes,
          ...(session?.token ? { adminToken: session.token } : {}),
        },
      });

      if (res.success && res.item) {
        toast.success(action === "approve" ? "Record Approved & Sealed" : "Submission Rejected", {
          description: res.message,
        });
        // Clear notes
        setNotes((prev) => {
          const next = { ...prev };
          delete next[submissionId];
          return next;
        });
        // Reload audit log & sync
        loadQueueData();
      } else {
        throw new Error(res.error || "Moderation request rejected by server");
      }
    } catch (err: unknown) {
      // Revert optimistic updates
      setItems(previousItems);
      setMetrics(previousMetrics);
      const msg = err instanceof Error ? err.message : "Moderation action failed";
      toast.error(msg);
    } finally {
      setActionInProgress(null);
    }
  };

  // Filtered queue items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || item.category === filterCategory;

    const currentStatus = item.status || "pending";
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "pending"
          ? currentStatus === "pending"
          : filterStatus === "approved"
            ? currentStatus === "approved"
            : filterStatus === "rejected"
              ? currentStatus === "rejected"
              : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (checkingSession) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-stone-400">
          Verifying security handshake and official certificates…
        </p>
      </div>
    );
  }

  // 1. UNRECOGNIZED / UNAUTHENTICATED GATEWAY VIEW
  if (!session) {
    return (
      <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>

        {/* Ambient National Heritage Grid Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-stone-950 to-stone-950" />

        <div className="relative w-full max-w-md">
          {/* Top National Security Badge */}
          <div className="mb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300 shadow-lg backdrop-blur-md">
              <ShieldAlert className="size-4 text-amber-400" />
              Restricted Access: National Heritage Moderation Cell
            </div>
          </div>

          <div
            className={`overflow-hidden rounded-3xl border ${
              hasError
                ? "border-red-500/80 shadow-red-950/50 animate-shake"
                : "border-stone-800 shadow-2xl"
            } bg-stone-900/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300`}
          >
            {/* National Emblem & Crest Lock */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-700/20 shadow-inner">
                <Lock className="size-8 text-amber-400" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-stone-100">
                Official Admin Gateway
              </h1>
              <p className="mt-1 text-xs text-stone-400 leading-relaxed">
                Archaeological Survey of India &bull; Ministry of Culture
                <br />
                Citizen Archive Moderation & Authentication Portal
              </p>
            </div>

            {/* Error Notification Alert */}
            {hasError && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <ShieldAlert className="size-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Secure Passphrase Input Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Government Security Passphrase
                </label>
                <div className="relative">
                  <Input
                    type={showPasskey ? "text" : "password"}
                    value={passkey}
                    onChange={(e) => {
                      setPasskey(e.target.value);
                      if (hasError) setHasError(false);
                    }}
                    placeholder="Enter passkey clearance code…"
                    className="pr-10 bg-stone-950 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-amber-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    title={showPasskey ? "Hide passphrase" : "Show passphrase"}
                  >
                    {showPasskey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Jury Demo autofill button */}
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>SIH 2026 Jury Presentation:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPasskey("dharohar-admin-2026");
                    setHasError(false);
                  }}
                  className="font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2"
                >
                  Use Demo Passkey
                </button>
              </div>

              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 font-semibold text-stone-950 hover:from-amber-500 hover:to-amber-400 shadow-md shadow-amber-900/20"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-stone-950 border-t-transparent" />
                    Validating Security Seal…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Unlock className="size-4" />
                    Authorize Clearance & Access Queue
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 border-t border-stone-800/80 pt-4 text-center">
              <p className="text-[11px] text-stone-500">
                All administrative access is monitored and logged in compliance with the National
                Data Sharing and Accessibility Policy (NDSAP).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED EXECUTIVE MODERATION DASHBOARD
  return (
    <>
      <PageHeader
        kicker="Executive Control Portal"
        title="National Heritage Moderation Cell"
        subtitle="Archaeological Survey of India &bull; Citizen Archive Authentication & Digital Sealing Service"
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Officer Clearance Header Banner */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-100">{session.officialName}</span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  SECURE SESSION ACTIVE
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Session Token: <code className="text-stone-300">{session.token.slice(0, 16)}…</code>{" "}
                &bull; Auto-expires: {new Date(session.expiresAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadQueueData}
              disabled={loadingQueue}
              className="border-stone-700 bg-stone-800/80 text-stone-300 hover:bg-stone-700"
            >
              {loadingQueue ? "Syncing…" : "Refresh Queue"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1.5"
            >
              <LogOut className="size-3.5" />
              Lock Portal
            </Button>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1: Total Submissions */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Total Submissions
              </p>
              <FileText className="size-4 text-stone-500" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-stone-100">
              {metrics.totalSubmissions}
            </p>
            <p className="mt-1 text-[11px] text-stone-500">Citizen contributions in repository</p>
          </div>

          {/* Metric 2: Pending Verification */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Pending Verification
              </p>
              <span className="flex size-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-amber-300">
              {metrics.pendingCount}
            </p>
            <p className="mt-1 text-[11px] text-amber-400/80">Requires official review & decision</p>
          </div>

          {/* Metric 3: Approved Records */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Approved & Sealed
              </p>
              <ShieldCheck className="size-4 text-emerald-400" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-emerald-300">
              {metrics.approvedCount}
            </p>
            <p className="mt-1 text-[11px] text-emerald-400/80">Granted Official ASI Seal</p>
          </div>

          {/* Metric 4: Community Flags */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Community Flags
              </p>
              <AlertTriangle className="size-4 text-rose-400" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-rose-300">
              {metrics.communityFlags}
            </p>
            <p className="mt-1 text-[11px] text-rose-400/80">Disputed cultural provenance</p>
          </div>
        </div>

        {/* Tabbed Moderation Workflow */}
        <Tabs defaultValue="citizen-archive" className="mt-10">
          <TabsList className="bg-stone-900 border border-stone-800 p-1 flex-wrap">
            <TabsTrigger value="citizen-archive" className="gap-2">
              <Sparkles className="size-3.5 text-amber-400" />
              Citizen Archive Queue ({metrics.pendingCount} pending)
            </TabsTrigger>
            <TabsTrigger value="audit-log" className="gap-2">
              <History className="size-3.5 text-stone-400" />
              Official Audit Trail ({auditLogs.length})
            </TabsTrigger>
            <TabsTrigger value="reels" className="gap-2">
              AI-Drafted Reels ({REELS.filter((r) => !r.reviewed).length})
            </TabsTrigger>
            <TabsTrigger value="preservation" className="gap-2">
              Preservation Reports ({PRESERVATION_REPORTS.length})
            </TabsTrigger>
          </TabsList>

          {/* 1. CITIZEN ARCHIVE QUEUE TAB */}
          <TabsContent value="citizen-archive" className="mt-6 space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
                <Input
                  type="text"
                  placeholder="Search submissions by title, contributor, state, or provenance…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-stone-950 border-stone-800 text-xs text-stone-200 focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <Filter className="size-3.5 text-stone-500" />
                  <span>Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                  >
                    <option value="all">All Submissions</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved & Sealed</option>
                    <option value="rejected">Rejected Archive</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <span>Category:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="living_culture">Living Craft & Ritual</option>
                    <option value="oral_tradition">Oral Tradition</option>
                    <option value="document">Manuscript & Document</option>
                    <option value="photo">Historic Photograph</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submissions List / Grid */}
            {filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-12 text-center">
                <FileText className="mx-auto size-12 text-stone-600" />
                <h3 className="mt-4 text-base font-semibold text-stone-300">
                  No submissions match the current filter
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  Clear search filters or select "All Submissions" to see full archive queue.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredItems.map((item) => {
                  const isPending = item.status === "pending" || !item.status;
                  const isApproved = item.status === "approved";
                  const isRejected = item.status === "rejected";
                  const isProcessing = actionInProgress === item.id;

                  return (
                    <article
                      key={item.id}
                      className={`overflow-hidden rounded-2xl border ${
                        isPending
                          ? "border-amber-500/40 bg-stone-900/80 shadow-md"
                          : isApproved
                            ? "border-emerald-500/30 bg-stone-900/40"
                            : "border-stone-800/80 bg-stone-950/60 opacity-75"
                      } p-6 transition-all duration-200`}
                    >
                      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                        {/* Thumbnail with Lightbox trigger */}
                        <div
                          onClick={() =>
                            setLightboxMedia({
                              url: item.mediaUrl,
                              title: item.title,
                              contributor: item.contributorName,
                              description: item.description,
                            })
                          }
                          className="group relative h-44 w-full cursor-zoom-in overflow-hidden rounded-xl border border-stone-800 bg-stone-950 shadow-inner"
                        >
                          {item.mediaUrl ? (
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.dataset["fallbackApplied"]) return;
                                target.dataset["fallbackApplied"] = "true";
                                target.src = "/assets/hero-heritage.jpg";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-stone-600">
                              No Media Attached
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-stone-950/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900/90 px-3 py-1.5 text-xs font-medium text-stone-200 backdrop-blur-sm">
                              <Maximize2 className="size-3.5" /> Full Screen
                            </span>
                          </div>
                          <span className="absolute bottom-2 left-2 rounded-md bg-stone-950/80 px-2 py-0.5 text-[10px] uppercase font-semibold text-stone-300 backdrop-blur-sm">
                            {item.category.replace("_", " ")}
                          </span>
                        </div>

                        {/* Provenance & Moderation Controls */}
                        <div className="flex flex-col justify-between">
                          <div>
                            {/* Header row with badges */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-lg font-bold text-stone-100">{item.title}</h3>

                              {isApproved ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                  <ShieldCheck className="size-3.5" />
                                  Officially Sealed ({item.verifiedBy || "ASI"})
                                </span>
                              ) : isRejected ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
                                  <XCircle className="size-3.5" />
                                  Rejected from Public Archive
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 animate-pulse">
                                  <Sparkles className="size-3.5" />
                                  Awaiting Official ASI Verification
                                </span>
                              )}
                            </div>

                            {/* Contributor provenance info */}
                            <p className="mt-1 text-xs text-stone-400">
                              Contributor:{" "}
                              <strong className="text-stone-200">{item.contributorName}</strong> &bull;
                              State: <strong className="text-stone-200">{item.state}</strong> &bull;
                              Submitted: {item.createdAt} &bull; Upvotes: {item.upvotes}
                            </p>

                            {/* Cultural provenance description */}
                            <div className="mt-3 rounded-xl border border-stone-800 bg-stone-950/80 p-3.5">
                              <p className="text-xs font-medium uppercase tracking-wider text-amber-500/90 mb-1">
                                Cultural Provenance & Context
                              </p>
                              <p className="text-xs leading-relaxed text-stone-300">
                                {item.description}
                              </p>
                            </div>

                            {/* Existing moderation notes if available */}
                            {item.moderationNotes && (
                              <div className="mt-2.5 rounded-lg border border-stone-700/50 bg-stone-800/40 px-3 py-2 text-xs text-stone-300">
                                <span className="font-semibold text-amber-400">
                                  Official Record Notes:
                                </span>{" "}
                                {item.moderationNotes}
                              </div>
                            )}
                          </div>

                          {/* Action area: Notes input and Action buttons */}
                          <div className="mt-4 border-t border-stone-800/80 pt-4">
                            <div className="mb-3">
                              <label className="text-[11px] font-semibold text-stone-400">
                                Officer Verification Notes (saved to permanent provenance log):
                              </label>
                              <Textarea
                                rows={2}
                                value={notes[item.id] ?? ""}
                                onChange={(e) =>
                                  setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                                }
                                placeholder="e.g. Cross-referenced against IGNCA manuscripts / Authenticated by Sangeet Natak Akademi archive…"
                                className="mt-1 text-xs bg-stone-950 border-stone-800 text-stone-200 focus:border-amber-500"
                              />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <Button
                                size="sm"
                                onClick={() => handleModerate(item.id, "approve")}
                                disabled={isProcessing}
                                className="bg-emerald-600 font-semibold text-white hover:bg-emerald-500 shadow-sm"
                              >
                                {isProcessing && actionInProgress === item.id ? (
                                  <span className="flex items-center gap-1.5">
                                    <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Sealing…
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="size-4" />
                                    Approve & Seal Record
                                  </span>
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleModerate(item.id, "reject")}
                                disabled={isProcessing}
                                className="font-semibold shadow-sm"
                              >
                                <XCircle className="size-4 mr-1.5" />
                                Reject / Inappropriate Content
                              </Button>

                              <span className="text-[11px] text-stone-500 ml-auto">
                                ID: <code className="text-stone-400">#{item.id}</code>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* 2. OFFICIAL AUDIT TRAIL TAB */}
          <TabsContent value="audit-log" className="mt-6 space-y-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-100">
                    Immutable Moderation Audit Log
                  </h3>
                  <p className="text-xs text-stone-400">
                    Cryptographically stamped administrative actions for SIH 2026 inspection.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadQueueData}
                  className="border-stone-700 bg-stone-800 text-xs text-stone-300"
                >
                  Sync Logs
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="pb-3 pl-2">Timestamp</th>
                      <th className="pb-3">Action</th>
                      <th className="pb-3">Artifact Title</th>
                      <th className="pb-3">Clearance Officer</th>
                      <th className="pb-3 pr-2">Official Verification Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-stone-300">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-800/30">
                        <td className="py-3 pl-2 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3">
                          {log.action === "approve" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 font-semibold text-emerald-400">
                              <CheckCircle2 className="size-3" /> Sealed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 font-semibold text-rose-400">
                              <XCircle className="size-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 font-medium text-stone-100">{log.title}</td>
                        <td className="py-3 text-stone-400">{log.official}</td>
                        <td className="py-3 pr-2 text-stone-300 italic">
                          {log.notes || "Standard policy verification."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* 3. AI REELS TAB */}
          <TabsContent value="reels" className="mt-6 space-y-3">
            {REELS.filter((r) => r.aiAssisted).map((reel) => (
              <div
                key={reel.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-stone-800 bg-stone-900/60 p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-100">{reel.title.en}</p>
                  <p className="text-xs text-stone-400">
                    Narrator: {reel.narrator} &bull; {reel.durationSec}s &bull; AI-drafted script
                  </p>
                </div>
                <span
                  className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    reel.reviewed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/35 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {reel.reviewed ? "Reviewed" : "Awaiting review"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-stone-700 bg-stone-800 text-stone-200"
                  onClick={() => toast.success("Cultural claims verified and published.")}
                >
                  Verify claims
                </Button>
              </div>
            ))}
          </TabsContent>

          {/* 4. PRESERVATION REPORTS TAB */}
          <TabsContent value="preservation" className="mt-6 space-y-3">
            {PRESERVATION_REPORTS.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-stone-800 bg-stone-900/60 p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-100">{r.siteSlug}</p>
                  <p className="text-xs text-stone-400">
                    Reported by: {r.reportedBy} &bull; {r.date}
                  </p>
                </div>
                <span className="ml-auto rounded-full border border-stone-700 bg-stone-800 px-2.5 py-0.5 text-xs text-stone-300">
                  {r.status}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-stone-700 bg-stone-800 text-stone-200"
                  onClick={() => toast.success("Preservation status confirmed.")}
                >
                  Confirm status
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Lightbox Modal */}
      {lightboxMedia && (
        <div
          onClick={() => setLightboxMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setLightboxMedia(null)}
            className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full bg-stone-800/80 text-white hover:bg-stone-700 transition"
          >
            <X className="size-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl"
          >
            <div className="relative max-h-[60vh] overflow-hidden rounded-xl bg-black">
              <img
                src={lightboxMedia.url}
                alt={lightboxMedia.title}
                className="mx-auto max-h-[60vh] object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.dataset["fallbackApplied"]) return;
                  target.dataset["fallbackApplied"] = "true";
                  target.src = "/assets/hero-heritage.jpg";
                }}
              />
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-stone-100">{lightboxMedia.title}</h2>
              <p className="text-xs text-amber-400 mt-0.5">
                Contributor: {lightboxMedia.contributor}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-stone-300">
                {lightboxMedia.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
