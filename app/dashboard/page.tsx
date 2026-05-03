"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const ADMIN_USER = "IMMINEXUS CONSULTANTS@MS";
const ADMIN_PASS = "IMMINEXUS CONSULTANTS@MS1";
const SESSION_KEY = "imminexus_admin_v2";

type Booking = {
  _id: string;
  trackingId: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  status: string;
  createdAt: string;
  modifications?: { previousDate: string; previousTime: string; newDate: string; newTime: string; reason: string }[];
};

type Feedback = {
  _id: string;
  name: string;
  country: string;
  service: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
};

type Tab = "overview" | "bookings" | "feedbacks";

export default function Dashboard() {
  const [authed,    setAuthed]    = useState(false);
  const [checking,  setChecking]  = useState(true);
  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [loginErr,  setLoginErr]  = useState("");
  const [showPass,  setShowPass]  = useState(false);

  const [tab,          setTab]          = useState<Tab>("overview");
  const [bookings,     setBookings]     = useState<Booking[]>([]);
  const [feedbacks,    setFeedbacks]    = useState<Feedback[]>([]);
  const [loadingB,     setLoadingB]     = useState(false);
  const [loadingF,     setLoadingF]     = useState(false);
  const [errorB,       setErrorB]       = useState("");
  const [errorF,       setErrorF]       = useState("");
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [downloading,  setDownloading]  = useState<string | null>(null);
  const [lastRefresh,  setLastRefresh]  = useState<Date | null>(null);

  // Check session on mount
  useEffect(() => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      if (s === "true") setAuthed(true);
    } catch {}
    setChecking(false);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoadingB(true); setErrorB("");
    try {
      const res  = await fetch("/api/dashboard/bookings", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setBookings(json.bookings ?? []);
      setLastRefresh(new Date());
    } catch (e: any) {
      setErrorB(`Failed to load bookings: ${e.message}`);
    } finally { setLoadingB(false); }
  }, []);

  const fetchFeedbacks = useCallback(async () => {
    setLoadingF(true); setErrorF("");
    try {
      const res  = await fetch("/api/dashboard/feedbacks", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setFeedbacks(json.feedbacks ?? []);
    } catch (e: any) {
      setErrorF(`Failed to load feedbacks: ${e.message}`);
    } finally { setLoadingF(false); }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchBookings();
    fetchFeedbacks();
  }, [authed, fetchBookings, fetchFeedbacks]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      try { sessionStorage.setItem(SESSION_KEY, "true"); } catch {}
      setAuthed(true); setLoginErr("");
    } else {
      setLoginErr("Invalid username or password.");
    }
  };

  const logout = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    setAuthed(false); setUsername(""); setPassword("");
  };

  const downloadPDF = async (b: Booking) => {
    setDownloading(b.trackingId);
    try {
      const res  = await fetch(`/api/dashboard/pdf?id=${b._id}`);
      if (!res.ok) { alert("PDF not available"); return; }
      const json = await res.json();
      if (!json.pdfBase64) { alert("PDF not available"); return; }
      const bytes = Uint8Array.from(atob(json.pdfBase64), c => c.charCodeAt(0));
      const blob  = new Blob([bytes], { type: "application/pdf" });
      const url   = URL.createObjectURL(blob);
      const a     = Object.assign(document.createElement("a"), {
        href: url, download: `ImmiNexus-${b.trackingId}.pdf`,
      });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { alert("Download failed. Check console."); }
    finally { setDownloading(null); }
  };

  const cancelBooking = async (b: Booking) => {
    if (!confirm(`Cancel booking for ${b.fullName}?\nThis cannot be undone.`)) return;
    try {
      const res = await fetch("/api/dashboard/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b._id, status: "cancelled" }),
      });
      if (!res.ok) throw new Error();
      setBookings(prev => prev.map(bk => bk._id === b._id ? { ...bk, status: "cancelled" } : bk));
    } catch { alert("Failed to cancel booking."); }
  };

  const toggleApprove = async (f: Feedback) => {
    try {
      const res = await fetch("/api/dashboard/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: f._id, approved: !f.approved }),
      });
      if (!res.ok) throw new Error();
      setFeedbacks(prev => prev.map(fb => fb._id === f._id ? { ...fb, approved: !f.approved } : fb));
    } catch { alert("Failed to update review."); }
  };

  const deleteFeedback = async (f: Feedback) => {
    if (!confirm(`Delete review from ${f.name}?`)) return;
    try {
      const res = await fetch(`/api/dashboard/feedbacks?id=${f._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setFeedbacks(prev => prev.filter(fb => fb._id !== f._id));
    } catch { alert("Failed to delete review."); }
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.trackingId.toLowerCase().includes(q) ||
      b.country.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q);
    return matchSearch && (statusFilter === "all" || b.status === statusFilter);
  });

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    today:     bookings.filter(b => {
      const today = new Date();
      const gmt5  = new Date(today.getTime() - 5 * 3600000);
      return b.date === gmt5.toISOString().split("T")[0];
    }).length,
    pendingReviews: feedbacks.filter(f => !f.approved).length,
  };

  // ── Loading screen ──
  if (checking) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg,#041c1e,#073d40)" }}>
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: "rgba(17,153,158,0.3)", borderTopColor: "#11999e" }}/>
    </div>
  );

  // ── Login screen ──
  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#041c1e 0%,#073d40 50%,#0d5c5f 100%)" }}>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle at 25% 25%, #11999e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #11999e 0%, transparent 50%)",
      }}/>

      <div className="relative w-full" style={{ maxWidth: 400 }}>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-8">
            <Image src="/logonobackground.png" alt="ImmiNexus" width={220} height={80}
              className="mx-auto mb-5 object-contain" style={{ height: 64, width: "auto" }} />
            <h1 className="font-heading text-xl font-bold" style={{ color: "#293533" }}>
              Admin Dashboard
            </h1>
            <p className="font-body text-sm mt-1" style={{ color: "#9ca3af" }}>
              Restricted — authorized personnel only
            </p>
          </div>

          {loginErr && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-xl mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {loginErr}
            </div>
          )}

          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-bold uppercase tracking-wide mb-1.5"
                style={{ color: "#9ca3af" }}>Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-teal-500 focus:ring-2 transition-all"
                style={{ color: "#293533", fontSize: 14 }}
              />
            </div>
            <div>
              <label className="block text-xs font-body font-bold uppercase tracking-wide mb-1.5"
                style={{ color: "#9ca3af" }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-body focus:outline-none focus:border-teal-500 focus:ring-2 transition-all"
                  style={{ color: "#293533", fontSize: 14 }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            <button type="submit"
              className="w-full py-3.5 rounded-xl text-white font-body font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)", boxShadow: "0 4px 16px rgba(17,153,158,0.3)" }}>
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-center text-xs font-body mt-5" style={{ color: "#d1d5db" }}>
            This page is not indexed or publicly linked
          </p>
        </div>
      </div>
    </div>
  );

  // ── Dashboard ──
  return (
    <div className="min-h-screen" style={{ background: "#f0f4f4" }}>

      {/* Top navbar */}
      <div className="sticky top-0 z-50 bg-white border-b"
        style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo + badge */}
            <div className="flex items-center gap-3">
            <Image src="/logonobackground.png" alt="ImmiNexus" width={220} height={80}
              className="object-contain" style={{ height: 48, width: "auto" }}/>
              <span className="hidden sm:inline font-body text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(17,153,158,0.1)", color: "#11999e" }}>
                Admin
              </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1">
              {([
                ["overview",  "Overview"],
                ["bookings",  `Bookings (${stats.total})`],
                ["feedbacks", `Reviews (${feedbacks.length})`],
              ] as [Tab, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)}
                  className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-body font-medium transition-all"
                  style={{
                    background: tab === key ? "#11999e" : "transparent",
                    color:      tab === key ? "white"   : "#576d69",
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {lastRefresh && (
                <span className="hidden md:block text-xs font-body" style={{ color: "#9ca3af" }}>
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>
              )}
              <button onClick={() => { fetchBookings(); fetchFeedbacks(); }}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
                title="Refresh">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#576d69" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
                </svg>
              </button>
              <button onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-all hover:bg-red-50"
                style={{ color: "#ef4444" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold" style={{ color: "#293533" }}>Overview</h2>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: "Total",          value: stats.total,         color: "#11999e" },
                { label: "Confirmed",      value: stats.confirmed,     color: "#22c55e" },
                { label: "Cancelled",      value: stats.cancelled,     color: "#ef4444" },
                { label: "Today",          value: stats.today,         color: "#3b82f6" },
                { label: "Pending Review", value: stats.pendingReviews,color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border"
                  style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  <p className="text-xs font-body font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "#9ca3af" }}>{s.label}</p>
                  <p className="font-heading text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Recent bookings */}
            <div className="bg-white rounded-2xl border p-6"
              style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>
                  Recent Bookings
                </h3>
                <button onClick={() => setTab("bookings")}
                  className="text-xs font-body font-medium" style={{ color: "#11999e" }}>
                  View all →
                </button>
              </div>
              {loadingB ? (
                <div className="flex justify-center py-8">
                  <Spinner/>
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-center py-8 font-body text-sm" style={{ color: "#9ca3af" }}>
                  No bookings yet
                </p>
              ) : (
                <div className="space-y-2">
                  {bookings.slice(0, 8).map(b => (
                    <div key={b._id} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: "#f9fafb" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)", flexShrink: 0 }}>
                          {b.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-body font-semibold text-sm" style={{ color: "#293533" }}>
                            {b.fullName}
                          </p>
                          <p className="font-body text-xs" style={{ color: "#9ca3af" }}>
                            {b.date} · {b.time} GMT-5 · {b.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={b.status}/>
                        <button onClick={() => downloadPDF(b)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(17,153,158,0.08)", border: "1px solid rgba(17,153,158,0.2)" }}
                          title="Download PDF">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending reviews */}
            {feedbacks.filter(f => !f.approved).length > 0 && (
              <div className="bg-white rounded-2xl border p-6"
                style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>
                    Pending Reviews
                    <span className="ml-2 text-xs font-body font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                      {feedbacks.filter(f => !f.approved).length} awaiting
                    </span>
                  </h3>
                  <button onClick={() => setTab("feedbacks")}
                    className="text-xs font-body font-medium" style={{ color: "#11999e" }}>
                    Manage →
                  </button>
                </div>
                <div className="space-y-2">
                  {feedbacks.filter(f => !f.approved).slice(0, 3).map(f => (
                    <div key={f._id} className="flex items-start justify-between p-3 rounded-xl"
                      style={{ background: "#fffbf0", border: "1px solid rgba(245,158,11,0.15)" }}>
                      <div>
                        <p className="font-body font-semibold text-sm" style={{ color: "#293533" }}>
                          {f.name} · {f.country}
                        </p>
                        <p className="font-body text-xs italic mt-1" style={{ color: "#576d69" }}>
                          "{f.message.slice(0, 80)}{f.message.length > 80 ? "..." : ""}"
                        </p>
                      </div>
                      <button onClick={() => toggleApprove(f)}
                        className="ml-3 px-3 py-1.5 rounded-lg text-xs font-body font-semibold flex-shrink-0"
                        style={{ background: "rgba(17,153,158,0.1)", color: "#11999e" }}>
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="font-heading text-2xl font-bold" style={{ color: "#293533" }}>
                All Bookings
              </h2>
              <button onClick={fetchBookings}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium"
                style={{ background: "rgba(17,153,158,0.08)", color: "#11999e", border: "1px solid rgba(17,153,158,0.2)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
                </svg>
                Refresh
              </button>
            </div>

            {/* Search + filter */}
            <div className="bg-white rounded-2xl p-4 border flex flex-col sm:flex-row gap-3"
              style={{ borderColor: "#e5e7eb" }}>
              <div className="relative flex-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                  className="absolute left-3 top-1/2 -translate-y-1/2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email, tracking ID, country, service..."
                  className="w-full rounded-xl pl-9 pr-4 py-2.5 border text-sm font-body focus:outline-none focus:border-teal-500 transition-all"
                  style={{ borderColor: "#e5e7eb", background: "#f9fafb", fontSize: 14, color: "#293533" }}/>
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="rounded-xl px-4 py-2.5 border text-sm font-body focus:outline-none focus:border-teal-500"
                style={{ borderColor: "#e5e7eb", background: "#f9fafb", color: "#293533", minWidth: 130 }}>
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {errorB && <ErrorBanner msg={errorB} onRetry={fetchBookings}/>}

            {/* Table */}
            <div className="bg-white rounded-2xl border overflow-hidden"
              style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              {loadingB ? (
                <div className="flex justify-center py-20"><Spinner/></div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"
                    className="mx-auto mb-3">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <p className="font-body text-sm" style={{ color: "#9ca3af" }}>
                    {bookings.length === 0 ? "No bookings yet" : "No results match your search"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        {["Tracking ID","Client","Contact","Country","Service","Date & Time","Status","Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-body font-bold uppercase tracking-wide whitespace-nowrap"
                            style={{ color: "#9ca3af" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b, i) => (
                        <tr key={b._id}
                          style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                          <td className="px-4 py-4">
                            <code className="text-xs font-semibold" style={{ color: "#11999e" }}>
                              {b.trackingId}
                            </code>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-body font-semibold text-sm" style={{ color: "#293533" }}>
                              {b.fullName}
                            </p>
                            <p className="font-body text-xs" style={{ color: "#9ca3af" }}>
                              {new Date(b.createdAt).toLocaleDateString("en-CA")}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-body text-xs" style={{ color: "#576d69" }}>{b.email}</p>
                            <p className="font-body text-xs mt-0.5" style={{ color: "#9ca3af" }}>{b.phone || "—"}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-body text-sm" style={{ color: "#576d69" }}>{b.country}</span>
                          </td>
                          <td className="px-4 py-4" style={{ maxWidth: 220 }}>
                            <p className="font-body text-xs leading-relaxed" style={{ color: "#576d69" }}>
                              {b.service}
                            </p>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <p className="font-body text-sm font-semibold" style={{ color: "#293533" }}>{b.date}</p>
                            <p className="font-body text-xs" style={{ color: "#9ca3af" }}>{b.time} GMT-5</p>
                            {b.modifications && b.modifications.length > 0 && (
                              <span className="text-xs font-body px-1.5 py-0.5 rounded-full mt-1 inline-block"
                                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                                Modified ×{b.modifications.length}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={b.status}/>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => downloadPDF(b)}
                                disabled={downloading === b.trackingId}
                                title="Download PDF"
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:shadow-md disabled:opacity-50"
                                style={{ background: "rgba(17,153,158,0.08)", border: "1px solid rgba(17,153,158,0.2)" }}>
                                {downloading === b.trackingId
                                  ? <Spinner size={12}/>
                                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2.5">
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                      <polyline points="7 10 12 15 17 10"/>
                                      <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                }
                              </button>
                              {b.status === "confirmed" && (
                                <button onClick={() => cancelBooking(b)}
                                  title="Cancel booking"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:shadow-md"
                                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {filtered.length > 0 && (
                <div className="px-5 py-3 border-t" style={{ borderColor: "#f3f4f6" }}>
                  <p className="font-body text-xs" style={{ color: "#9ca3af" }}>
                    Showing {filtered.length} of {bookings.length} bookings
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FEEDBACKS TAB ── */}
        {tab === "feedbacks" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold" style={{ color: "#293533" }}>
                Client Reviews
              </h2>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm" style={{ color: "#9ca3af" }}>
                  {feedbacks.filter(f => !f.approved).length} pending · {feedbacks.filter(f => f.approved).length} published
                </span>
                <button onClick={fetchFeedbacks}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body font-medium"
                  style={{ background: "rgba(17,153,158,0.08)", color: "#11999e", border: "1px solid rgba(17,153,158,0.2)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {errorF && <ErrorBanner msg={errorF} onRetry={fetchFeedbacks}/>}

            {loadingF ? (
              <div className="flex justify-center py-20"><Spinner/></div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-20 font-body text-sm" style={{ color: "#9ca3af" }}>
                No reviews yet
              </div>
            ) : (
              <div className="space-y-3">
                {/* Pending first */}
                {[...feedbacks].sort((a, b) => Number(a.approved) - Number(b.approved)).map(f => (
                  <div key={f._id} className="bg-white rounded-2xl border p-5 transition-all hover:shadow-md"
                    style={{
                      borderColor:  f.approved ? "rgba(17,153,158,0.12)" : "rgba(245,158,11,0.25)",
                      borderLeft:   `3px solid ${f.approved ? "#11999e" : "#f59e0b"}`,
                      boxShadow:    "0 1px 6px rgba(0,0,0,0.04)",
                    }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)" }}>
                            {f.name.charAt(0)}
                          </div>
                          <span className="font-body font-bold text-sm" style={{ color: "#293533" }}>{f.name}</span>
                          <span className="font-body text-xs" style={{ color: "#9ca3af" }}>{f.country}</span>
                          <span className="font-body text-xs" style={{ color: "#9ca3af" }}>·</span>
                          <span className="font-body text-xs" style={{ color: "#9ca3af" }}>{f.service}</span>
                          <div className="flex gap-0.5">
                            {Array(5).fill(null).map((_, i) => (
                              <svg key={i} width="11" height="11" viewBox="0 0 24 24"
                                fill={i < f.rating ? "#F59E0B" : "#E5E7EB"}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs font-body font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: f.approved ? "#f0fdf4" : "#fefce8",
                              color:      f.approved ? "#15803d" : "#92400e",
                            }}>
                            {f.approved ? "Published" : "Pending"}
                          </span>
                        </div>
                        {/* Message */}
                        <p className="font-body text-sm italic leading-relaxed mb-2" style={{ color: "#576d69" }}>
                          "{f.message}"
                        </p>
                        <p className="font-body text-xs" style={{ color: "#9ca3af" }}>
                          Submitted: {new Date(f.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </p>
                      </div>
                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => toggleApprove(f)}
                          className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all whitespace-nowrap"
                          style={{
                            background: f.approved ? "rgba(239,68,68,0.07)" : "rgba(17,153,158,0.1)",
                            color:      f.approved ? "#ef4444"               : "#11999e",
                            border:     `1px solid ${f.approved ? "rgba(239,68,68,0.18)" : "rgba(17,153,158,0.2)"}`,
                          }}>
                          {f.approved ? "Unpublish" : "✓ Approve"}
                        </button>
                        <button onClick={() => deleteFeedback(f)}
                          className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all"
                          style={{ background: "rgba(239,68,68,0.07)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.18)" }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small reusable components ──
function StatusBadge({ status }: { status: string }) {
  const confirmed = status === "confirmed";
  return (
    <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{
        background: confirmed ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
        color:      confirmed ? "#15803d"              : "#dc2626",
      }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function Spinner({ size = 28 }: { size?: number }) {
  return (
    <div style={{
      width:         size, height: size,
      borderRadius:  "50%",
      border:        "2px solid rgba(17,153,158,0.2)",
      borderTopColor:"#11999e",
      animation:     "spin 0.8s linear infinite",
    }}/>
  );
}

function ErrorBanner({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
      <div className="flex items-center gap-2 text-red-700 text-sm font-body">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {msg}
      </div>
      <button onClick={onRetry}
        className="text-xs font-body font-semibold px-3 py-1.5 rounded-lg ml-4"
        style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
        Retry
      </button>
    </div>
  );
}