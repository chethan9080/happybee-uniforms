import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText, Send, TrendingUp, Banknote, CreditCard,
  Receipt, Search, Calendar, ArrowUpRight, ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";

interface Bill {
  id: string;
  invoice_no: string;
  customer_name: string;
  school: string;
  total: number;
  payment_mode: string;
  date: string;
  billed_by?: string;
}

const BillsRecord = () => {
  const location = useLocation();
  const role = location.pathname.startsWith("/owner") ? "owner" : "worker";
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bills")
        .select("id, invoice_no, customer_name, school, total, payment_mode, date, billed_by")
        .eq("date", dateFilter)
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setBills((data as Bill[]) || []);
      setLoading(false);
    };
    fetchBills();
  }, [dateFilter]);

  const filtered = bills.filter(
    (b) =>
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.school?.toLowerCase().includes(search.toLowerCase()) ||
      b.invoice_no?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = bills.reduce((sum, b) => sum + b.total, 0);
  const cashTotal = bills.filter((b) => b.payment_mode === "Cash").reduce((sum, b) => sum + b.total, 0);
  const onlineTotal = bills.filter((b) => b.payment_mode === "Online").reduce((sum, b) => sum + b.total, 0);
  const avgBill = bills.length > 0 ? totalAmount / bills.length : 0;

  const handleSendReport = async () => {
    setSending(true);
    const { data: attendance } = await (supabase.from("attendance") as any)
      .select("employee_name, status").eq("date", dateFilter);

    const absent = (attendance || []).filter((a: any) => a.status === "absent").map((a: any) => a.employee_name);

    const message = `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;">
    <h1 style="margin:0;color:#ffffff;font-size:20px;">🏫 HappyB.Pvt.Ltd</h1>
    <p style="margin:6px 0 0;color:#a0aec0;font-size:13px;">Daily Report — ${dateFilter}</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#4a5568;margin:0 0 24px;">Good day! Here's a quick summary for <strong>${dateFilter}</strong>.</p>
    <div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#16a34a;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Total Sales</p>
      <p style="margin:8px 0 0;font-size:36px;font-weight:700;color:#15803d;">₹${totalAmount.toLocaleString()}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#4a5568;">${bills.length} bill${bills.length !== 1 ? "s" : ""} today · Cash ₹${cashTotal.toLocaleString()} · Online ₹${onlineTotal.toLocaleString()}</p>
    </div>
    <div style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#dc2626;text-transform:uppercase;letter-spacing:1px;font-weight:600;">❌ Absent Today (${absent.length})</p>
      <p style="margin:8px 0 0;font-size:15px;color:#1a1a2e;">${absent.length > 0 ? absent.join(", ") : "Everyone was present 🎉"}</p>
    </div>
    <p style="font-size:14px;color:#718096;margin:0;">Have a great day and keep up the good work! 💪</p>
  </div>
  <div style="background:#f8fafc;padding:14px 32px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#a0aec0;">Sent automatically by HappyB.Pvt.Ltd Management System</p>
  </div>
</div>`.trim();

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { to_email: "chethank.n333@gmail.com", subject: `Daily Report — HappyB.Pvt.Ltd — ${dateFilter}`, message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      toast.success("Report sent to owner!");
    } catch (err) {
      toast.error("Failed to send report.");
    }
    setSending(false);
  };

  const displayDate = new Date(dateFilter).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <DashboardLayout role={role}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/30 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-7">

          {/* Header */}
          <div className="flex items-start justify-between opacity-0 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200">
                <Receipt className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Bills Record</h1>
                <p className="text-muted-foreground text-sm mt-0.5">{displayDate}</p>
              </div>
            </div>
            <Button onClick={handleSendReport} disabled={sending}
              className="h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 border-0 shadow-md gap-2">
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Submit & Notify Owner"}
            </Button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "60ms" }}>
            {[
              { label: "Total Revenue", value: `₹${totalAmount.toLocaleString()}`, icon: TrendingUp, gradient: "from-green-500 to-emerald-600", sub: `${bills.length} bills` },
              { label: "Cash Sales", value: `₹${cashTotal.toLocaleString()}`, icon: Banknote, gradient: "from-amber-400 to-orange-500", sub: `${bills.filter(b => b.payment_mode === "Cash").length} bills` },
              { label: "Online Sales", value: `₹${onlineTotal.toLocaleString()}`, icon: CreditCard, gradient: "from-blue-500 to-indigo-600", sub: `${bills.filter(b => b.payment_mode === "Online").length} bills` },
              { label: "Avg Bill Value", value: `₹${avgBill.toFixed(0)}`, icon: ArrowUpRight, gradient: "from-purple-500 to-pink-500", sub: "per transaction" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-border/50 shadow-sm p-5">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-md`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-4 flex flex-wrap gap-3 items-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 h-11">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-sm font-medium outline-none" />
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, school, invoice..." className="h-11 pl-9 rounded-xl" />
            </div>
            {search && (
              <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Bills list */}
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "140ms" }}>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/30 border-b border-border/40">
              <div className="col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Invoice</div>
              <div className="col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Customer</div>
              <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">School</div>
              <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide text-right">Amount</div>
              <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide text-center">Payment</div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm">Loading bills...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-base mb-1">No bills found</p>
                <p className="text-sm text-muted-foreground">
                  {search ? "Try a different search term" : "No bills recorded for this date"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filtered.map((bill, i) => (
                  <div key={bill.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-muted/20 transition-colors items-center opacity-0 animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}>
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold">{bill.invoice_no}</p>
                        {bill.billed_by && <p className="text-xs text-muted-foreground">by {bill.billed_by}</p>}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <p className="font-semibold text-sm">{bill.customer_name}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground truncate">{bill.school || "—"}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="font-bold text-base">₹{bill.total.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                        bill.payment_mode === "Cash"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {bill.payment_mode === "Cash"
                          ? <Banknote className="w-3 h-3" />
                          : <CreditCard className="w-3 h-3" />}
                        {bill.payment_mode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer total */}
            {filtered.length > 0 && (
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-t border-border/40">
                <div className="col-span-8 flex items-center gap-2">
                  <span className="text-sm font-bold text-muted-foreground">{filtered.length} bill{filtered.length !== 1 ? "s" : ""} total</span>
                </div>
                <div className="col-span-2 text-right">
                  <p className="font-bold text-lg text-cyan-700">₹{filtered.reduce((s, b) => s + b.total, 0).toLocaleString()}</p>
                </div>
                <div className="col-span-2" />
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillsRecord;
