import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, FileSpreadsheet, PackagePlus, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const EnterStock = () => {
  const [form, setForm] = useState({ school: "", gender: "", material: "", size: "", quantity: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.school || !form.gender || !form.material || !form.size || !form.quantity) {
      toast.error("Please fill all fields"); return;
    }
    setLoading(true);
    const { data: existing } = await (supabase.from("stock") as any)
      .select("id, quantity").eq("school", form.school).eq("gender", form.gender)
      .eq("material", form.material).eq("size", form.size).limit(1);

    if (existing && existing.length > 0) {
      const newQty = existing[0].quantity + parseInt(form.quantity);
      const { error } = await (supabase.from("stock") as any).update({ quantity: newQty }).eq("id", existing[0].id);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success(`Stock updated! New quantity: ${newQty}`);
    } else {
      const { error } = await (supabase.from("stock") as any).insert({
        school: form.school, gender: form.gender, material: form.material,
        size: form.size, quantity: parseInt(form.quantity),
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Stock entry saved!");
    }
    setForm({ school: "", gender: "", material: "", size: "", quantity: "" });
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
        if (rows.length === 0) { toast.error("Excel file is empty"); return; }
        const records = rows.map((row) => ({
          school: String(row["School"] || row["school"] || "").trim(),
          gender: String(row["Gender"] || row["gender"] || "").trim(),
          material: String(row["Material"] || row["material"] || "").trim(),
          size: String(row["Size"] || row["size"] || "").trim(),
          quantity: parseInt(String(row["Quantity"] || row["quantity"] || "0")),
        })).filter((r) => r.school && r.gender && r.material && r.size && r.quantity > 0);
        if (records.length === 0) { toast.error("No valid rows found. Check column headers."); return; }
        setUploading(true);
        const { error } = await (supabase.from("stock") as any).insert(records);
        setUploading(false);
        if (error) { toast.error(error.message); return; }
        toast.success(`${records.length} stock entries uploaded!`);
      } catch { toast.error("Failed to read Excel file"); }
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["School", "Gender", "Material", "Size", "Quantity"],
      ["Delhi Public School", "Boy", "Shirt", "32", 45],
      ["St. Mary's School", "Girl", "Skirt", "28", 30],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    XLSX.writeFile(wb, "stock_template.xlsx");
  };

  return (
    <DashboardLayout role="worker">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10 max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="opacity-0 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100">
              <PackagePlus className="w-7 h-7 text-yellow-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Enter Stock</h1>
              <p className="text-muted-foreground mt-0.5">Add or update inventory items</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-8 opacity-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
            <h2 className="text-lg font-semibold mb-6">Stock Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">School Name</Label>
                  <Input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })}
                    placeholder="e.g. Delhi Public School" className="h-12 rounded-xl text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger className="h-12 rounded-xl text-base"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boy">👦 Boy</SelectItem>
                      <SelectItem value="Girl">👧 Girl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Material Type</Label>
                  <Select value={form.material} onValueChange={(v) => setForm({ ...form, material: v })}>
                    <SelectTrigger className="h-12 rounded-xl text-base"><SelectValue placeholder="Select material" /></SelectTrigger>
                    <SelectContent>
                      {["Shirt","Pant","Sweater","Tie","Belt","Socks","Skirt","Blazer"].map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Size</Label>
                  <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="e.g. 32, M, XL" className="h-12 rounded-xl text-base" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold text-foreground">Quantity</Label>
                  <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="Enter quantity to add" className="h-12 rounded-xl text-base" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 text-base rounded-xl bg-yellow-300 hover:bg-yellow-500 text-yellow-900 font-bold border-0 shadow-md">
                <Save className="w-5 h-5 mr-2" />
                {loading ? "Saving..." : "Save Entry"}
              </Button>
            </form>
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Bulk upload */}
            <div className="card-elevated p-6 opacity-0 animate-fade-in" style={{ animationDelay: "160ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Bulk Upload</h3>
                  <p className="text-xs text-muted-foreground">Upload Excel file</p>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelUpload} />
              <Button variant="outline" className="w-full h-11 rounded-xl" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Excel"}
              </Button>
            </div>

            {/* Template download */}
            <div className="card-elevated p-6 opacity-0 animate-fade-in" style={{ animationDelay: "220ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Template</h3>
                  <p className="text-xs text-muted-foreground">Download sample file</p>
                </div>
              </div>
              <Button variant="outline" className="w-full h-11 rounded-xl" onClick={handleDownloadTemplate}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>

            {/* Info */}
            <div className="card-elevated p-6 bg-yellow-50/50 border border-yellow-100 opacity-0 animate-fade-in" style={{ animationDelay: "280ms" }}>
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700 space-y-1">
                  <p className="font-semibold">Excel Format</p>
                  <p className="text-xs leading-relaxed">Columns: School, Gender, Material, Size, Quantity</p>
                  <p className="text-xs leading-relaxed">If item exists, quantity will be added to existing stock.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnterStock;
