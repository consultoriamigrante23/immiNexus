"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const DASHBOARD_USER = "IMMINEXUS CONSULTANTS@MS";
const DASHBOARD_PASS = "IMMINEXUS CONSULTANTS@MS1";

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
  message: string;
  status: string;
  createdAt: string;
  modifications?: any[];
};

export default function Dashboard() {
  const [authed,   setAuthed]   = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [bookings,    setBookings]    = useState<Booking[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatusFilter]= useState("all");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error,       setError]       = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === DASHBOARD_USER && password === DASHBOARD_PASS) {
      setAuthed(true);
      setLoginErr("");
    } else {
      setLoginErr("Invalid credentials.");
    }
  };

  useEffect(() => {
    if (!authed) return;
    fetchBookings();
  }, [authed]);

  const fetchBookings = async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/dashboard/bookings");
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Failed to load bookings"); return; }
      setBookings(json.bookings);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  const downloadPDF = async (booking: Booking) => {
    setDownloading(booking.trackingId);
    try {
      const res  = await fetch(`/api/dashboard/pdf?id=${booking._id}`);
      const json = await res.json();
      if (!res.ok || !json.pdfBase64) { alert("Could not generate PDF"); return; }

      const byteChars = atob(json.pdfBase64);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = `ImmiNexus-${booking.trackingId}.pdf`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { alert("Download failed"); }
    finally { setDownloading(null); }
  };

  const cancelBooking = async (booking: Booking) => {
    if (!confirm(`Cancel booking for ${booking.fullName}?`)) return;
    try {
      const res = await fetch(`/api/dashboard/bookings?id=${booking._id}`, { method: "PATCH" });
      if (res.ok) {
        setBookings(prev => prev.map(b =>
          b._id === booking._id ? { ...b, status: "cancelled" } : b
        ));
      }
    } catch { alert("Error cancelling booking"); }
  };

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      b.country.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    today:     bookings.filter(b => b.date === new Date().toISOString().split("T")[0]).length,
  };

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg,#041c1e 0%,#073d40 40%,#0d7a7e 100%)" }}>
        <div className="bg-white rounded-3xl p-8 w-full shadow-2xl" style={{ maxWidth: 420 }}>
          <div className="text-center mb-8">
            <Image src="/logo-horizontal.png" alt="ImmiNexus" width={200} height={60}
              className="object-contain mx-auto mb-4" style={{ height: 48, width: "auto" }}/>
            <h1 className="font-heading text-2xl font-bold" style={{ color: "#293533" }}>
              Admin Dashboard
            </h1>
            <p className="font-body text-sm mt-1" style={{ color: "#9ca3af" }}>
              Restricted access · ImmiNexus Consultants
            </p>
          </div>

          {loginErr && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-xl mb-5 text-center">
              {loginErr}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: "#9ca3af" }}>Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                className="inp" autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-body font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: "#9ca3af" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="inp" autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn-brand w-full py-3.5 mt-2 justify-center text-base">
              Sign In
            </button>
          </form>

          <p className="text-center text-xs font-body mt-6" style={{ color: "#d1d5db" }}>
            This page is not indexed or linked publicly.
          </p>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Top bar */}
      <div className="border-b bg-white sticky top-0 z-40" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo-horizontal.png" alt="ImmiNexus" width={160} height={48}
              className="object-contain" style={{ height: 36, width: "auto" }}/>
            <span className="font-body text-sm font-medium px-3 py-1 rounded-full"
              style={{ background: "rgba(17,153,158,0.1)", color: "#11999e" }}>
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchBookings}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all hover:shadow-md"
              style={{ background: "rgba(17,153,158,0.08)", color: "#11999e", border: "1px solid rgba(17,153,158,0.2)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
              </svg>
              Refresh
            </button>
            <button onClick={() => setAuthed(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all hover:bg-red-50"
              style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.15)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings",  value: stats.total,     color: "#11999e", bg: "rgba(17,153,158,0.08)" },
            { label: "Confirmed",       value: stats.confirmed, color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
            { label: "Cancelled",       value: stats.cancelled, color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
            { label: "Today",           value: stats.today,     color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border"
              style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <p className="text-xs font-body font-semibold uppercase tracking-wide mb-2"
                style={{ color: "#9ca3af" }}>{s.label}</p>
              <p className="font-heading text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 mb-6 border"
          style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, tracking ID, country..."
                className="w-full font-body text-sm rounded-xl pl-9 pr-4 py-2.5 border focus:outline-none focus:border-teal-500"
                style={{ borderColor: "#e5e7eb", background: "#f9fafb" }}
              />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="font-body text-sm rounded-xl px-4 py-2.5 border focus:outline-none focus:border-teal-500"
              style={{ borderColor: "#e5e7eb", background: "#f9fafb", color: "#293533", minWidth: 140 }}>
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Bookings table */}
        <div className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#11999e", borderTopColor: "transparent" }}/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"
                className="mx-auto mb-4">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p className="font-body text-base font-medium" style={{ color: "#9ca3af" }}>
                {bookings.length === 0 ? "No bookings yet" : "No results match your search"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    {["Tracking ID","Client","Contact","Country","Service","Date & Time","Status","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-body font-bold uppercase tracking-wide"
                        style={{ color: "#9ca3af", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b._id}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        background: i % 2 === 0 ? "white" : "#fafafa",
                      }}>
                      <td className="px-4 py-4">
                        <span className="font-body font-mono text-xs font-semibold"
                          style={{ color: "#11999e" }}>
                          {b.trackingId}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-body font-semibold text-sm" style={{ color: "#293533" }}>
                          {b.fullName}
                        </p>
                        <p className="font-body text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                          Booked {new Date(b.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-body text-xs" style={{ color: "#576d69" }}>{b.email}</p>
                        <p className="font-body text-xs mt-0.5" style={{ color: "#9ca3af" }}>{b.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-body text-sm" style={{ color: "#576d69" }}>{b.country}</span>
                      </td>
                      <td className="px-4 py-4" style={{ maxWidth: 200 }}>
                        <p className="font-body text-xs leading-relaxed" style={{ color: "#576d69" }}>
                          {b.service}
                        </p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="font-body text-sm font-semibold" style={{ color: "#293533" }}>
                          {b.date}
                        </p>
                        <p className="font-body text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                          {b.time} GMT-5
                        </p>
                        {b.modifications && b.modifications.length > 0 && (
                          <span className="text-xs font-body px-1.5 py-0.5 rounded-full mt-1 inline-block"
                            style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                            Modified ×{b.modifications.length}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background: b.status === "confirmed"
                              ? "rgba(34,197,94,0.1)"  : "rgba(239,68,68,0.1)",
                            color: b.status === "confirmed" ? "#15803d" : "#dc2626",
                          }}>
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {/* Download PDF */}
                          <button
                            onClick={() => downloadPDF(b)}
                            disabled={downloading === b.trackingId}
                            title="Download PDF"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:shadow-md disabled:opacity-50"
                            style={{ background: "rgba(17,153,158,0.08)", border: "1px solid rgba(17,153,158,0.2)" }}>
                            {downloading === b.trackingId ? (
                              <div className="w-3 h-3 rounded-full border border-t-transparent animate-spin"
                                style={{ borderColor: "#11999e", borderTopColor: "transparent" }}/>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                            )}
                          </button>

                          {/* Cancel */}
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => cancelBooking(b)}
                              title="Cancel booking"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:shadow-md"
                              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
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

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="px-6 py-3 border-t" style={{ borderColor: "#f3f4f6" }}>
              <p className="font-body text-xs" style={{ color: "#9ca3af" }}>
                Showing {filtered.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}