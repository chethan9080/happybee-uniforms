import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, PackagePlus, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";

const OwnerEnterStock = () => {
  const [school, setSchool] = useState("");
  const [gender, setGender] = useState("");
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async () => {
    if (!school || !gender || !material || !size || !qty) {
      toast.error("Please fill all fields"); return;
    }
    setSaving(true);
    const { error } = await (supabase.from("stock") as any).insert({
      school, gender, material, size, quantity: parseInt(qty),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setSaved(true);
    toast.success("Stock entry saved!");
    setTimeout(() => setSaved(false), 2000);
    setSchool(""); setGender(""); setMaterial(""); setSize(""); setQty("");
  };

  return (
    <DashboardLayout role="owner">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between opacity-0 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100">
                <PackagePlus className="w-7 h-7 text-yellow-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Enter Stock</h1>
                <p className="text-muted-foreground mt-0.5">Add new inventory items to the system</p>
              </div>
            </div>
            <Button variant="outline" className="h-11 rounded-xl gap-2">
              <Upload className="w-4 h-4" /> Upload Excel
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-8 opacity-0 animate-fade-in" style={{ animationDelay: "60ms" }}>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <PackagePlus className="w-4.5 h-4.5 text-yellow-600" style={{ width: "18px", height: "18px" }} />
                </div>
                <div>
                  <h2 className="font-bold text-base">Stock Details</h2>
                  <p className="text-xs text-muted-foreground">Fill in all fields to add inventory</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">School Name *</Label>
                  <Input value={school} onChange={(e) => setSchool(e.target.value)}
                    placeholder="e.g. St. Mary's School" className="h-12 rounded-xl text-base" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Gender *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-12 rounded-xl text-base"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boy">Boy</SelectItem>
                      <SelectItem value="Girl">Girl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Material *</Label>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger className="h-12 rounded-xl text-base"><SelectValue placeholder="Select material" /></SelectTrigger>
                    <SelectContent>
                      {["Shirt","Pant","Skirt","Sweater","Tie","Belt","Socks","Blazer"].map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Size *</Label>
                  <Input value={size} onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 28, 30, 32" className="h-12 rounded-xl text-base" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Quantity *</Label>
                  <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)}
                    placeholder="Enter quantity" className="h-12 rounded-xl text-base" />
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={saving}
                className="w-full h-14 mt-7 text-base rounded-2xl bg-yellow-300 hover:bg-yellow-500 text-yellow-900 font-bold border-0 shadow-xl shadow-yellow-100 gap-2">
                {saved ? (
                  <><CheckCircle2 className="w-5 h-5" /> Saved!</>
                ) : saving ? (
                  "Saving..."
                ) : (
                  <><Save className="w-5 h-5" /> Save Stock Entry</>
                )}
              </Button>
            </div>

            {/* Info panel */}
            <div className="space-y-4 opacity-0 animate-fade-in" style={{ animationDelay: "120ms" }}>
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-semibold text-sm">Excel Upload Format</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Upload an Excel file with these exact column headers:
                </p>
                <div className="space-y-1.5">
                  {["School", "Gender", "Material", "Size", "Quantity"].map((col) => (
                    <div key={col} className="flex items-center gap-2 bg-yellow-50/60 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <span className="text-xs font-mono font-semibold">{col}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl border border-yellow-200/60 p-5">
                <p className="text-xs font-semibold text-yellow-700 mb-2">Stock Levels Guide</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-xs text-muted-foreground">≥ 10 units — Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
                    <span className="text-xs text-muted-foreground">5–9 units — Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                    <span className="text-xs text-muted-foreground">&lt; 5 units — Critical</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerEnterStock;
