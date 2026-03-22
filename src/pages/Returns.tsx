import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  RotateCcw, ArrowLeftRight, ArrowRight, PackageCheck,
  History, CheckCircle2, RefreshCw, Boxes, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ReturnRecord {
  id: number;
  school: string;
  student_name: string;
  student_class: string;
  returned_material: string;
  exchanged_material: string;
  date: string;
}

const MATERIALS = ["Shirt","Pant","Tie","Belt","Socks","Sweater","Skirt","Blazer"];

const Returns = () => {
  const [form, setForm] = useState({ school: "", studentName: "", class: "", returnedMaterial: "", exchangedMaterial: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ReturnRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await (supabase.from("returns") as any)
        .select("*").order("created_at", { ascending: false }).limit(10);
      setHistory(data || []);
      setHistoryLoading(false);
    };
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.school || !form.studentName || !form.returnedMaterial || !form.exchangedMaterial) {
      toast.error("Please fill all required fields"); return;
    }
    setLoading(true);

    const { error } = await (supabase.from("returns") as any).insert({
      school: form.school, student_name: form.studentName, student_class: form.class,
      returned_material: form.returnedMaterial, exchanged_material: form.exchangedMaterial,
      date: new Date().toISOString().split("T")[0],
    });
    if (error) { toast.error(error.message); setLoading(false); return; }

    const { data: retRows } = await (supabase.from("stock") as any).select("id, quantity")
      .eq("material", form.returnedMaterial).eq("school", form.school).limit(1);
    if (retRows && retRows.length > 0)
      await (supabase.from("stock") as any).update({ quantity: retRows[0].quantity + 1 }).eq("id", retRows[0].id);

    const { data: excRows } = await (supabase.from("stock") as any).select("id, quantity")
      .eq("material", form.exchangedMaterial).eq("school", form.school).limit(1);
    if (excRows && excRows.length > 0)
      await (supabase.from("stock") as any).update({ quantity: Math.max(0, excRows[0].quantity - 1) }).eq("id", excRows[0].id);

    setLoading(false);
    setSubmitted(true);
    toast.success("Return processed and stock updated!");

    const newRecord: ReturnRecord = {
      id: Date.now(), school: form.school, student_name: form.studentName,
      student_class: form.class, returned_material: form.returnedMaterial,
      exchanged_material: form.exchangedMaterial, date: new Date().toISOString().split("T")[0],
    };
    setHistory([newRecord, ...history.slice(0, 9)]);

    setTimeout(() => {
      setSubmitted(false);
      setForm({ school: "", studentName: "", class: "", returnedMaterial: "", exchangedMaterial: "" });
    }, 2000);
  };

  const todayCount = history.filter((r) => r.date === new Date().toISOString().split("T")[0]).length;

  return (
    <DashboardLayout role="worker">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-300 to-yellow-200 p-8 text-yellow-900 shadow-xl shadow-yellow-100 opacity-0 animate-fade-in">
            <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-white/20" />
            <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/15" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-yellow-800" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-yellow-900">Returns & Exchange</h1>
                  <p className="text-yellow-700 text-sm mt-0.5">Process uniform returns and exchanges with live stock updates</p>
                </div>
              </div>
              <div className="flex items-center gap-8 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-900">{history.length}</p>
                  <p className="text-yellow-700 text-xs mt-0.5">Total Returns</p>
                </div>
                <div className="w-px h-10 bg-amber-600/20" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-900">{todayCount}</p>
                  <p className="text-yellow-700 text-xs mt-0.5">Today</p>
                </div>
                <div className="w-px h-10 bg-amber-600/20" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-900">{MATERIALS.length}</p>
                  <p className="text-yellow-700 text-xs mt-0.5">Item Types</p>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
            {[
              { step: "01", title: "Student Returns Item", desc: "The returned uniform is logged and added back to inventory automatically.", icon: PackageCheck },
              { step: "02", title: "Exchange Processed", desc: "A replacement item is issued to the student and deducted from stock.", icon: ArrowLeftRight },
              { step: "03", title: "Stock Auto-Updated", desc: "Inventory is adjusted in real-time — no manual entry needed.", icon: RefreshCw },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-xs font-bold text-yellow-500 mb-1">STEP {s.step}</div>
                <p className="font-semibold text-base mb-2">{s.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-100 shadow-sm p-8 opacity-0 animate-fade-in" style={{ animationDelay: "160ms" }}>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Return Processed!</h3>
                  <p className="text-muted-foreground">Stock has been updated successfully.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Return Details</h2>
                      <p className="text-xs text-muted-foreground">Fill in the student and item information</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="font-semibold text-sm">School Name <span className="text-red-400">*</span></Label>
                        <Input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })}
                          placeholder="e.g. St. Mary's School" className="h-12 rounded-xl text-base" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold text-sm">Student Name <span className="text-red-400">*</span></Label>
                        <Input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                          placeholder="Full name" className="h-12 rounded-xl text-base" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="font-semibold text-sm">Class / Section</Label>
                        <Input value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}
                          placeholder="e.g. 5th A" className="h-12 rounded-xl text-base" />
                      </div>
                    </div>

                    {/* Exchange visual */}
                    <div className="rounded-2xl border-2 border-dashed border-yellow-200 bg-yellow-50/40 p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <ArrowLeftRight className="w-4 h-4 text-yellow-600" />
                        <p className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Exchange Details</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-white rotate-180" />
                            </div>
                            <Label className="font-semibold text-sm text-green-700">Returned Item</Label>
                          </div>
                          <Select value={form.returnedMaterial} onValueChange={(v) => setForm({ ...form, returnedMaterial: v })}>
                            <SelectTrigger className="h-12 rounded-xl text-base border-green-200 bg-green-50/60">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {MATERIALS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <PackageCheck className="w-3 h-3" /> Added back to stock
                          </p>
                        </div>

                        <div className="flex flex-col items-center gap-1 pt-4">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-yellow-600" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                            <Label className="font-semibold text-sm text-yellow-700">Exchanged Item</Label>
                          </div>
                          <Select value={form.exchangedMaterial} onValueChange={(v) => setForm({ ...form, exchangedMaterial: v })}>
                            <SelectTrigger className="h-12 rounded-xl text-base border-yellow-200 bg-yellow-50/60">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {MATERIALS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-yellow-600 flex items-center gap-1">
                            <Boxes className="w-3 h-3" /> Deducted from stock
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading}
                      className="w-full h-14 text-base rounded-2xl bg-yellow-300 hover:bg-yellow-500 text-yellow-900 font-bold border-0 shadow-xl shadow-yellow-100">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      {loading ? "Processing..." : "Process Return & Exchange"}
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Recent history */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 opacity-0 animate-fade-in" style={{ animationDelay: "240ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <History className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="font-bold text-base">Recent Returns</h2>
                  <p className="text-xs text-muted-foreground">Last 10 transactions</p>
                </div>
              </div>

              {historyLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <RefreshCw className="w-8 h-8 animate-spin mb-3 opacity-40" />
                  <p className="text-sm">Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mb-4">
                    <History className="w-7 h-7 text-yellow-400" />
                  </div>
                  <p className="font-semibold text-sm mb-1">No returns yet</p>
                  <p className="text-xs text-muted-foreground">Processed returns will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {history.map((r) => (
                    <div key={r.id} className="rounded-xl border border-stone-100 p-4 hover:bg-yellow-50/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">{r.student_name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.school}{r.student_class ? ` · ${r.student_class}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                          <Clock className="w-3 h-3" />
                          {r.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                          <PackageCheck className="w-3 h-3" /> {r.returned_material}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                          <Boxes className="w-3 h-3" /> {r.exchanged_material}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Returns;
