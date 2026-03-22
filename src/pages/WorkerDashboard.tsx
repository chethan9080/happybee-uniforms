import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  IndianRupee, FileText, AlertTriangle, Package,
  UserCheck, Receipt, RotateCcw, ArrowRight,
  Clock, ShirtIcon, TrendingUp, Banknote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [todaySales, setTodaySales] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [cashBills, setCashBills] = useState(0);
  const [onlineBills, setOnlineBills] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const timeStr = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data: bills } = await supabase
        .from("bills").select("total, payment_mode").eq("date", today);
      const b = bills || [];
      setTodaySales(b.reduce((s, x) => s + x.total, 0));
      setTotalBills(b.length);
      setCashBills(b.filter((x) => x.payment_mode === "Cash").length);
      setOnlineBills(b.filter((x) => x.payment_mode === "Online").length);
      const { data: stock } = await supabase.from("stock").select("id").lt("quantity", 10);
      setLowStock((stock || []).length);
    };
    load();
  }, []);

  const quickActions = [
    { label: "Stock",        desc: "View inventory",      icon: Package,   path: "/stock" },
    { label: "Attendance",   desc: "Mark today",          icon: UserCheck, path: "/attendance" },
    { label: "Billing",      desc: "Create a bill",       icon: Receipt,   path: "/billing" },
    { label: "Bills Record", desc: "View all bills",      icon: FileText,  path: "/bills-record" },
    { label: "Returns",      desc: "Process exchange",    icon: RotateCcw, path: "/returns" },
  ];

  return (
    <DashboardLayout role="worker">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Hero banner — yellow + white */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-300 to-yellow-200 p-8 md:p-10 shadow-xl shadow-yellow-100 opacity-0 animate-fade-in">
            {/* Decorative shapes */}
            <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-white/20" />
            <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/15" />
            <div className="absolute top-6 right-48 w-16 h-16 rounded-full bg-white/10" />

            <div className="relative flex items-start justify-between gap-6">
              <div>
                {/* Brand pill */}
                <div className="inline-flex items-center gap-2 bg-white/30 rounded-full px-3 py-1 mb-4">
                  <ShirtIcon className="w-3.5 h-3.5 text-yellow-700" />
                  <span className="text-xs font-bold text-yellow-800 tracking-wide">HappyB.Pvt.Ltd</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-1">
                  {greeting} 👋
                </h1>
                <p className="text-yellow-700 text-sm font-medium">{dateStr}</p>

                {/* Today's key number */}
                <div className="mt-6 flex items-end gap-3">
                  <div>
                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-widest mb-1">Today's Revenue</p>
                    <p className="text-5xl font-bold text-yellow-900">
                      ₹{todaySales.toLocaleString()}
                    </p>
                  </div>
                  {totalBills > 0 && (
                    <div className="mb-2 bg-white/40 rounded-xl px-3 py-1.5">
                      <p className="text-xs font-semibold text-yellow-800">{totalBills} bill{totalBills > 1 ? "s" : ""}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Time badge */}
              <div className="shrink-0 bg-white/30 rounded-2xl px-4 py-3 text-right hidden sm:block">
                <div className="flex items-center gap-1.5 text-yellow-800 mb-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Current Time</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900">{timeStr}</p>
              </div>
            </div>
          </div>

          {/* Stat cards — white with amber accents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
            {[
              {
                title: "Today's Sales",
                value: `₹${todaySales.toLocaleString()}`,
                sub: `${totalBills} bill${totalBills !== 1 ? "s" : ""} generated`,
                icon: IndianRupee,
                accent: "border-t-yellow-300",
              },
              {
                title: "Payment Split",
                value: `${cashBills} / ${onlineBills}`,
                sub: "Cash · Online",
                icon: Banknote,
                accent: "border-t-yellow-400",
              },
              {
                title: "Low Stock Alerts",
                value: lowStock,
                sub: lowStock > 0 ? "Items need restocking" : "All stock healthy",
                icon: AlertTriangle,
                accent: lowStock > 0 ? "border-t-red-400" : "border-t-green-400",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`bg-white rounded-2xl border border-stone-100 shadow-sm p-6 border-t-4 ${card.accent} flex flex-col gap-4`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{card.title}</p>
                  <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                    <card.icon className="w-4.5 h-4.5 text-yellow-600" style={{ width: "18px", height: "18px" }} />
                  </div>
                </div>
                <div>
                  <p className="text-4xl font-bold text-stone-800">{card.value}</p>
                  <p className="text-sm text-stone-400 mt-1">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "160ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-800">Quick Actions</h2>
              <span className="text-xs text-stone-400">Tap to navigate</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {quickActions.map((action, i) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="group bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col items-center gap-3 hover:border-yellow-300 hover:shadow-md hover:shadow-amber-50 transition-all duration-200 hover:-translate-y-0.5 opacity-0 animate-fade-in text-left"
                  style={{ animationDelay: `${220 + i * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 group-hover:bg-yellow-100 flex items-center justify-center transition-colors">
                    <action.icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-stone-800">{action.label}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Today's summary strip */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-sm">Today's Performance</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {totalBills > 0
                      ? `${totalBills} bill${totalBills > 1 ? "s" : ""} · Avg ₹${Math.round(todaySales / totalBills).toLocaleString()} per bill · Cash ${cashBills} · Online ${onlineBills}`
                      : "No bills generated yet — start billing to see stats here"}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/billing")}
                className="h-10 px-5 rounded-xl bg-yellow-300 hover:bg-yellow-500 text-yellow-900 font-bold border-0 shadow-sm gap-1.5 shrink-0"
              >
                New Bill <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
