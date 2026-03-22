import DashboardLayout from "@/components/DashboardLayout";
import { PackagePlus, Eye, TrendingUp, AlertTriangle, ArrowRight, Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Stock = () => {
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("stock").select("quantity");
      if (data) {
        setTotalItems(data.length);
        setTotalQty(data.reduce((s, r) => s + r.quantity, 0));
        setLowStock(data.filter((r) => r.quantity < 10).length);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout role="worker">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10 max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your inventory</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
          {[
            { label: "Total Items", value: totalItems, icon: Boxes, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Total Quantity", value: totalQty, icon: TrendingUp, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Low Stock", value: lowStock, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 border-t-4 border-t-yellow-300 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/stock/enter")}
            className="group bg-white rounded-2xl border-2 border-stone-100 shadow-sm p-8 flex flex-col gap-5 text-left hover:border-yellow-300 hover:shadow-lg hover:shadow-amber-50 transition-all duration-200 hover:-translate-y-1 opacity-0 animate-fade-in"
            style={{ animationDelay: "160ms" }}
          >
            <div className="w-16 h-16 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100 group-hover:scale-110 transition-transform duration-200">
              <PackagePlus className="w-8 h-8 text-yellow-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Enter Stock</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">Add new inventory items or update existing stock quantities. Supports Excel upload for bulk entry.</p>
            </div>
            <div className="flex items-center gap-2 text-yellow-600 font-medium text-sm">
              Add inventory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate("/stock/view")}
            className="group bg-white rounded-2xl border-2 border-stone-100 shadow-sm p-8 flex flex-col gap-5 text-left hover:border-yellow-300 hover:shadow-lg hover:shadow-amber-50 transition-all duration-200 hover:-translate-y-1 opacity-0 animate-fade-in"
            style={{ animationDelay: "240ms" }}
          >
            <div className="w-16 h-16 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100 group-hover:scale-110 transition-transform duration-200">
              <Eye className="w-8 h-8 text-yellow-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">View Stock</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">Browse and filter current inventory by school, gender, material and size. See real-time stock levels.</p>
            </div>
            <div className="flex items-center gap-2 text-yellow-600 font-medium text-sm">
              Browse inventory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 bg-yellow-50/40 border-yellow-100 opacity-0 animate-fade-in" style={{ animationDelay: "320ms" }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-yellow-700">Low Stock Alert</p>
              <p className="text-sm text-yellow-700 mt-1">
                {lowStock > 0
                  ? `${lowStock} item${lowStock > 1 ? "s are" : " is"} running low (below 10 units). Consider restocking soon.`
                  : "All items are well stocked. No action needed."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Stock;
