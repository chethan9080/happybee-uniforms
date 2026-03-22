import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Printer, Package, AlertTriangle, CheckCircle2, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface StockRow {
  id: number;
  school: string;
  gender: string;
  material: string;
  size: string;
  quantity: number;
}

const OwnerViewStock = () => {
  const [stock, setStock] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  useEffect(() => {
    const fetchStock = async () => {
      const { data, error } = await supabase.from("stock").select("*").order("school");
      if (error) toast.error(error.message);
      else setStock(data || []);
      setLoading(false);
    };
    fetchStock();
  }, []);

  const schools = [...new Set(stock.map((s) => s.school))];

  const filtered = stock.filter((item) => {
    const matchSearch =
      item.school.toLowerCase().includes(search.toLowerCase()) ||
      item.material.toLowerCase().includes(search.toLowerCase());
    const matchSchool = schoolFilter === "all" || item.school === schoolFilter;
    const matchGender = genderFilter === "all" || item.gender === genderFilter;
    return matchSearch && matchSchool && matchGender;
  });

  const lowStock = filtered.filter((i) => i.quantity < 10).length;
  const totalUnits = filtered.reduce((s, i) => s + i.quantity, 0);

  return (
    <DashboardLayout role="owner">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-7">

          {/* Header */}
          <div className="flex items-center justify-between opacity-0 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100">
                <Package className="w-7 h-7 text-yellow-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Stock Overview</h1>
                <p className="text-muted-foreground mt-0.5">Browse and filter all inventory</p>
              </div>
            </div>
            <Button variant="outline" className="h-11 rounded-xl gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "60ms" }}>
            {[
              { label: "Total Items", value: filtered.length, icon: Package, sub: "in inventory" },
              { label: "Total Units", value: totalUnits.toLocaleString(), icon: CheckCircle2, sub: "across all items" },
              { label: "Low Stock", value: lowStock, icon: AlertTriangle, sub: "below 10 units" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 border-t-4 border-t-yellow-300 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0">
                  <s.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">{s.label}</p>
                  <p className="text-xs text-muted-foreground/60">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex flex-wrap gap-3 items-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search school, material..." value={search}
                onChange={(e) => setSearch(e.target.value)} className="h-11 pl-9 rounded-xl" />
            </div>
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="w-48 h-11 rounded-xl"><SelectValue placeholder="All Schools" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-36 h-11 rounded-xl"><SelectValue placeholder="Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Boy">Boy</SelectItem>
                <SelectItem value="Girl">Girl</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "140ms" }}>
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-yellow-50/60 border-b border-stone-100">
              <div className="col-span-4 text-xs font-bold text-muted-foreground uppercase tracking-wide">School</div>
              <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">Gender</div>
              <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">Material</div>
              <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">Size</div>
              <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide text-right">Quantity</div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="w-8 h-8 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm">Loading stock...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-base mb-1">No items found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filtered.map((item, i) => (
                  <div key={item.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-yellow-50/30 transition-colors items-center opacity-0 animate-fade-in"
                    style={{ animationDelay: `${i * 20}ms` }}>
                    <div className="col-span-4 font-semibold text-sm">{item.school}</div>
                    <div className="col-span-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.gender === "Boy" ? "bg-yellow-100 text-yellow-700" : "bg-stone-100 text-stone-600"
                      }`}>{item.gender}</span>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">{item.material}</div>
                    <div className="col-span-2 text-sm font-mono">{item.size}</div>
                    <div className="col-span-2 text-right">
                      <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                        item.quantity < 10
                          ? "bg-red-100 text-red-700"
                          : item.quantity < 20
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <div className="px-6 py-3 bg-yellow-50/60 border-t border-stone-100 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{filtered.length} items</span>
                <span className="text-sm font-bold">{totalUnits.toLocaleString()} total units</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerViewStock;
