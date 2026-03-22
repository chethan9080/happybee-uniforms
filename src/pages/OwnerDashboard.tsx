import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { IndianRupee, FileText, AlertTriangle, TrendingUp, ShoppingBag, School, Banknote, CreditCard, ShirtIcon } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { supabase } from "@/lib/supabase";

interface DashStats {
  todaySales: number; totalBills: number; cashBills: number;
  onlineBills: number; lowStockCount: number; monthlyRevenue: number;
}
interface WeekDay { day: string; sales: number; }
interface MonthData { month: string; sales: number; }
interface TopItem { name: string; sold: number; }
interface TopSchool { name: string; revenue: number; }

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const OwnerDashboard = () => {
  const [stats, setStats] = useState<DashStats>({ todaySales: 0, totalBills: 0, cashBills: 0, onlineBills: 0, lowStockCount: 0, monthlyRevenue: 0 });
  const [weeklyData, setWeeklyData] = useState<WeekDay[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [topSchools, setTopSchools] = useState<TopSchool[]>([]);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      const currentYear = new Date().getFullYear();

      const { data: todayBills } = await supabase.from("bills").select("total, payment_mode").eq("date", today);
      const todaySales = (todayBills || []).reduce((s, b) => s + b.total, 0);
      const cashBills = (todayBills || []).filter((b) => b.payment_mode === "Cash").length;
      const onlineBills = (todayBills || []).filter((b) => b.payment_mode === "Online").length;

      const { data: lowStock } = await supabase.from("stock").select("id").lt("quantity", 10);

      const monthStart = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`;
      const { data: monthBills } = await supabase.from("bills").select("total").gte("date", monthStart);
      const monthlyRevenue = (monthBills || []).reduce((s, b) => s + b.total, 0);

      setStats({ todaySales, totalBills: (todayBills || []).length, cashBills, onlineBills, lowStockCount: (lowStock || []).length, monthlyRevenue });

      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 6);
      const { data: weekBills } = await supabase.from("bills").select("total, date").gte("date", weekAgo.toISOString().split("T")[0]);
      const weekMap: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); weekMap[d.toISOString().split("T")[0]] = 0; }
      (weekBills || []).forEach((b) => { if (weekMap[b.date] !== undefined) weekMap[b.date] += b.total; });
      setWeeklyData(Object.entries(weekMap).map(([date, sales]) => ({ day: DAYS[new Date(date).getDay()], sales })));

      const { data: yearBills } = await supabase.from("bills").select("total, date").gte("date", `${currentYear}-01-01`);
      const monthMap: Record<number, number> = {};
      (yearBills || []).forEach((b) => { const m = new Date(b.date).getMonth(); monthMap[m] = (monthMap[m] || 0) + b.total; });
      setMonthlyData(Object.entries(monthMap).map(([m, sales]) => ({ month: MONTHS[Number(m)], sales })));

      const { data: billItems } = await supabase.from("bill_items").select("material, quantity");
      const itemMap: Record<string, number> = {};
      (billItems || []).forEach((i) => { itemMap[i.material] = (itemMap[i.material] || 0) + i.quantity; });
      setTopItems(Object.entries(itemMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, sold]) => ({ name, sold })));

      const { data: allBills } = await supabase.from("bills").select("school, total");
      const schoolMap: Record<string, number> = {};
      (allBills || []).forEach((b) => { if (b.school) schoolMap[b.school] = (schoolMap[b.school] || 0) + b.total; });
      setTopSchools(Object.entries(schoolMap).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, revenue]) => ({ name, revenue })));
    };
    load();
  }, []);

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString()}`;
  const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <DashboardLayout role="owner">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-7">

          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-300 to-yellow-200 p-8 md:p-10 shadow-xl shadow-yellow-100 opacity-0 animate-fade-in">
            <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full bg-white/20" />
            <div className="absolute bottom-0 right-28 w-36 h-36 rounded-full bg-white/15" />
            <div className="absolute top-6 right-52 w-16 h-16 rounded-full bg-white/10" />
            <div className="relative flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/30 rounded-full px-3 py-1 mb-4">
                  <ShirtIcon className="w-3.5 h-3.5 text-yellow-700" />
                  <span className="text-xs font-bold text-yellow-800 tracking-wide">HappyB.Pvt.Ltd — Owner View</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-1">Analytics Overview</h1>
                <p className="text-yellow-700 text-sm font-medium">{dateStr}</p>
                <div className="flex items-center gap-8 mt-6">
                  <div>
                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-widest mb-1">Today's Revenue</p>
                    <p className="text-5xl font-bold text-yellow-900">{fmt(stats.todaySales)}</p>
                  </div>
                  <div className="w-px h-14 bg-amber-600/20" />
                  <div>
                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-widest mb-1">This Month</p>
                    <p className="text-3xl font-bold text-yellow-800">{fmt(stats.monthlyRevenue)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/30 rounded-2xl px-6 py-4 hidden sm:block">
                <p className="text-xs font-bold text-yellow-700 uppercase tracking-widest mb-3">Today's Bills</p>
                <p className="text-4xl font-bold text-yellow-900">{stats.totalBills}</p>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs bg-white/40 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">{stats.cashBills} Cash</span>
                  <span className="text-xs bg-white/40 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">{stats.onlineBills} Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
            {[
              { label: "Today's Sales", value: fmt(stats.todaySales), sub: `${stats.totalBills} bills`, icon: IndianRupee },
              { label: "Cash Sales", value: `${stats.cashBills} bills`, sub: "Cash payments", icon: Banknote },
              { label: "Online Sales", value: `${stats.onlineBills} bills`, sub: "Online payments", icon: CreditCard },
              { label: "Low Stock Items", value: stats.lowStockCount, sub: "Below 10 units", icon: AlertTriangle },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 border-t-4 border-t-yellow-300">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{card.label}</p>
                  <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center">
                    <card.icon className="text-yellow-600" style={{ width: "16px", height: "16px" }} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-stone-800">{card.value}</p>
                <p className="text-xs text-stone-400 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Weekly Sales chart */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 opacity-0 animate-fade-in" style={{ animationDelay: "140ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                <TrendingUp className="text-yellow-600" style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Weekly Sales</h3>
                <p className="text-xs text-stone-400">Revenue by day — last 7 days</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Sales"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #fde68a", background: "#fffdf5" }}
                />
                <Bar dataKey="sales" fill="#fde047" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend chart */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                <FileText className="text-yellow-600" style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Monthly Revenue Trend</h3>
                <p className="text-xs text-stone-400">Revenue growth across months this year</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #fde68a", background: "#fffdf5" }}
                />
                <Line type="monotone" dataKey="sales" stroke="#fde047" strokeWidth={3} dot={{ r: 5, fill: "#fde047", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 opacity-0 animate-fade-in" style={{ animationDelay: "260ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                <ShoppingBag className="text-yellow-600" style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Top Selling Items</h3>
                <p className="text-xs text-stone-400">Best performers all time</p>
              </div>
            </div>
            {topItems.length === 0 ? (
              <p className="text-stone-400 text-sm">No sales data yet</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {topItems.map((item, i) => (
                  <div key={item.name} className="bg-[#fffdf5] border border-yellow-100 rounded-2xl p-5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-yellow-400">#{i + 1}</span>
                    <span className="text-base font-bold text-stone-800">{item.name}</span>
                    <span className="text-3xl font-bold text-yellow-500">{item.sold}</span>
                    <span className="text-xs text-stone-400">units sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Schools */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 opacity-0 animate-fade-in" style={{ animationDelay: "320ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                <School className="text-yellow-600" style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Top Schools by Revenue</h3>
                <p className="text-xs text-stone-400">Highest revenue generating schools</p>
              </div>
            </div>
            {topSchools.length === 0 ? (
              <p className="text-stone-400 text-sm">No data yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topSchools.map((school, i) => (
                  <div key={school.name} className="bg-[#fffdf5] border border-yellow-100 rounded-2xl p-5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-yellow-400">#{i + 1}</span>
                    <span className="text-base font-bold text-stone-800">{school.name}</span>
                    <span className="text-2xl font-bold text-yellow-600">{fmt(school.revenue)}</span>
                    <span className="text-xs text-stone-400">total revenue</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
