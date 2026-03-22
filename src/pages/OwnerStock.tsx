import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PackagePlus, Eye, ArrowRight, Boxes, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OwnerStock = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="owner">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <div className="opacity-0 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100">
                <Boxes className="w-7 h-7 text-yellow-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Stock Management</h1>
                <p className="text-muted-foreground mt-0.5">Enter new inventory or browse current stock</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "60ms" }}>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
                <PackagePlus className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Enter Stock</p>
                <p className="text-xs text-muted-foreground mt-0.5">Add new items to inventory</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">View Stock</p>
                <p className="text-xs text-muted-foreground mt-0.5">Browse and filter inventory</p>
              </div>
            </div>
          </div>

          {/* Action cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 opacity-0 animate-fade-in" style={{ animationDelay: "120ms" }}>
            <button
              onClick={() => navigate("/owner/stock/enter")}
              className="group bg-white rounded-2xl border-2 border-stone-100 shadow-sm p-8 text-left hover:border-yellow-300 hover:shadow-lg hover:shadow-amber-50 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center mb-5 shadow-md shadow-yellow-100 group-hover:scale-105 transition-transform">
                <PackagePlus className="w-7 h-7 text-yellow-900" />
              </div>
              <h2 className="text-xl font-bold mb-2">Enter Stock</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Add new uniform inventory — manually or via Excel upload. Supports school, gender, material, size and quantity.
              </p>
              <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Go to Enter Stock <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => navigate("/owner/stock/view")}
              className="group bg-white rounded-2xl border-2 border-stone-100 shadow-sm p-8 text-left hover:border-yellow-300 hover:shadow-lg hover:shadow-amber-50 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center mb-5 shadow-md shadow-yellow-100 group-hover:scale-105 transition-transform">
                <Eye className="w-7 h-7 text-yellow-900" />
              </div>
              <h2 className="text-xl font-bold mb-2">View Stock</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Browse the full inventory with filters by school, gender and material. Print or export for records.
              </p>
              <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Go to View Stock <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerStock;
