import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Printer, Eye, Boxes, AlertTriangle, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface StockRow { id: number; school: string; gender: string; material: string; size: string; quantity: number; }

const ViewStock = () => {
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
    const matchSearch = item.school.toLowerCase().includes(search.toLowerCase()) || item.material.toLowerCase().includes(search.toLowerCase());
    const matchSchool = schoolFilter === "all" || item.school === schoolFilter;
    const matchGender = genderFilter === "all" || item.gender === genderFilter;
    return matchSearch && matchSchool && matchGender;
  });

  const totalQty = filtered.reduce((s, r) => s + r.quantity, 0);
  const lowCount = filtered.filter((r) => r.quantity < 10).length;

  return (
    <DashboardLayout role="worker">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10 max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between opacity-0 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100">
              <Eye className="w-7 h-7 text-yellow-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">View Stock</h1>
              <p className="text-muted-foreground mt-0.5">Browse and filter current inventory</p>
            </div>
          </div>
          <Button variant="outline" className="h-11 rounded-xl gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
          {[
            { label: "Filtered Items", value: filtered.length, icon: Boxes, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Total Quantity", value: totalQty, icon: TrendingUp, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Low Stock", value: lowCount, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
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

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 opacity-0 animate-fade-in" style={{ animationDelay: "160ms" }}>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search school or material..." value={search}
                onChange={(e) => setSearch(e.target.value)} className="h-12 rounded-xl pl-10 text-base" />
            </div>
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="w-52 h-12 rounded-xl text-base"><SelectValue placeholder="All Schools" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-36 h-12 rounded-xl text-base"><SelectValue placeholder="Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Boy">👦 Boy</SelectItem>
                <SelectItem value="Girl">👧 Girl</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "240ms" }}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="py-4 text-sm font-semibold">School</TableHead>
                <TableHead className="py-4 text-sm font-semibold">Gender</TableHead>
                <TableHead className="py-4 text-sm font-semibold">Material</TableHead>
                <TableHead className="py-4 text-sm font-semibold">Size</TableHead>
                <TableHead className="py-4 text-sm font-semibold text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-16 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-16 text-muted-foreground">No items found</TableCell></TableRow>
              ) : filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4 font-semibold">{item.school}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="rounded-lg">{item.gender}</Badge>
                  </TableCell>
                  <TableCell className="py-4">{item.material}</TableCell>
                  <TableCell className="py-4">
                    <span className="bg-muted px-2.5 py-1 rounded-lg text-sm font-medium">{item.size}</span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <span className={`text-base font-bold ${item.quantity < 10 ? "text-red-500" : "text-green-600"}`}>
                      {item.quantity}
                    </span>
                    {item.quantity < 10 && (
                      <span className="ml-2 text-xs text-red-400">Low</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ViewStock;
