import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Trash2, FileText, Printer, ShoppingCart,
  User, School, Phone, BadgeCheck, CreditCard,
  Banknote, ChevronRight, Sparkles, Tag,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { sanitizeInput, checkRateLimit, checkHoneypot, validatePhone, validateName } from "@/lib/security";

interface BillItem { id: string; material: string; quantity: number; rate: number; }

const MATERIALS = ["Shirt","Pant","Tie","Belt","Socks","Sweater","Skirt","Blazer"];
const MATERIAL_RATES: Record<string, number> = {
  Shirt: 350, Pant: 450, Tie: 120, Belt: 150,
  Socks: 80, Sweater: 600, Skirt: 400, Blazer: 900,
};

const Billing = () => {
  const [customer, setCustomer] = useState({ name: "", class: "", school: "", phone: "" });
  const [employee, setEmployee] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [items, setItems] = useState<BillItem[]>([{ id: "1", material: "", quantity: 1, rate: 0 }]);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [billDone, setBillDone] = useState(false);
  const [lastInvoice, setLastInvoice] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

  const addItem = () => setItems([...items, { id: Date.now().toString(), material: "", quantity: 1, rate: 0 }]);
  const removeItem = (id: string) => { if (items.length === 1) return; setItems(items.filter((i) => i.id !== id)); };
  const updateItem = (id: string, field: keyof BillItem, value: string | number) =>
    setItems(items.map((i) => {
      if (i.id !== id) return i;
      const updated = { ...i, [field]: value };
      if (field === "material" && typeof value === "string") updated.rate = MATERIAL_RATES[value] ?? 0;
      return updated;
    }));

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
  const gst = gstEnabled ? subtotal * 0.18 : 0;
  const total = subtotal + gst;
  const filledItems = items.filter((i) => i.material && i.quantity > 0 && i.rate > 0);

  const handleGenerate = async () => {
    // Honeypot check
    if (!checkHoneypot(honeypotRef.current?.value ?? "")) return;
    // Rate limiting
    if (!checkRateLimit("billing", 3000)) { toast.error("Please wait before submitting again."); return; }

    if (!customer.name) { toast.error("Customer name is required"); return; }
    if (filledItems.length === 0) { toast.error("Add at least one item"); return; }
    if (customer.phone && !validatePhone(customer.phone)) { toast.error("Invalid phone number"); return; }
    if (!validateName(customer.name)) { toast.error("Name must be 2–50 letters only"); return; }

    // Sanitize all string inputs
    const safeName    = sanitizeInput(customer.name.trim());
    const safeClass   = sanitizeInput(customer.class.trim());
    const safeSchool  = sanitizeInput(customer.school.trim());
    const safePhone   = sanitizeInput(customer.phone.trim());
    const safeEmployee = sanitizeInput(employee.trim());

    setLoading(true);

    const { data: bill, error: billError } = await (supabase.from("bills") as any).insert({
      invoice_no: invoiceNo, customer_name: safeName, customer_class: safeClass,
      school: safeSchool, phone: safePhone, billed_by: safeEmployee,
      subtotal, gst, total, payment_mode: paymentMode,
      date: new Date().toISOString().split("T")[0],
    }).select().single();

    if (billError) { toast.error(billError.message); setLoading(false); return; }

    await (supabase.from("bill_items") as any).insert(
      filledItems.map((i) => ({ bill_id: bill.id, material: i.material, quantity: i.quantity, rate: i.rate, amount: i.quantity * i.rate }))
    );

    for (const item of filledItems) {
      const { data: stockRows } = await (supabase.from("stock") as any)
        .select("id, quantity").eq("material", item.material).order("quantity", { ascending: false }).limit(1);
      if (stockRows && stockRows.length > 0)
        await (supabase.from("stock") as any).update({ quantity: Math.max(0, stockRows[0].quantity - item.quantity) }).eq("id", stockRows[0].id);
    }

    if (customer.phone) {
      const waMessage = `Hello ${safeName} 👋\n\nThank you for shopping with *HappyB.Pvt.Ltd* 🙏\nWe appreciate your visit and hope you loved our products.\n\nPlease visit us again! 😊\n\n— Team HappyB.Pvt.Ltd`;
      await supabase.functions.invoke("send-whatsapp", { body: { phone: customer.phone, message: waMessage } });
    }

    setLoading(false);
    setLastInvoice(invoiceNo);
    setBillDone(true);
    toast.success("Bill generated successfully!");
  };

  const resetBill = () => {
    setBillDone(false);
    setCustomer({ name: "", class: "", school: "", phone: "" });
    setEmployee("");
    setItems([{ id: "1", material: "", quantity: 1, rate: 0 }]);
    setGstEnabled(false);
    setPaymentMode("Cash");
  };

  return (
    <DashboardLayout role="worker">
      <div className="min-h-screen bg-[#fffdf5] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100">
                <ShoppingCart className="w-7 h-7 text-yellow-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">New Bill</h1>
                <p className="text-muted-foreground text-sm mt-0.5 font-mono">#{invoiceNo}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white border border-stone-100 rounded-2xl px-4 py-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">POS Active</span>
            </div>
          </div>

          {/* Success state */}
          {billDone ? (
            <div className="bg-white rounded-3xl border border-stone-100 shadow-xl p-12 text-center opacity-0 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-100">
                <BadgeCheck className="w-12 h-12 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Bill Generated!</h2>
              <p className="text-muted-foreground mb-1">Invoice <span className="font-mono font-semibold text-foreground">{lastInvoice}</span></p>
              <p className="text-4xl font-bold text-yellow-500 mt-4 mb-8">₹{total.toLocaleString()}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="h-12 px-6 rounded-xl gap-2" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" /> Print Bill
                </Button>
                <Button className="h-12 px-8 rounded-xl bg-yellow-300 hover:bg-yellow-500 text-yellow-900 font-bold border-0 shadow-md gap-2" onClick={resetBill}>
                  <Plus className="w-4 h-4" /> New Bill
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Honeypot — hidden from real users, catches bots */}
              <input ref={honeypotRef} type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {/* Left — Customer + Items */}
              <div className="lg:col-span-3 space-y-5">

                {/* Customer card */}
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 opacity-0 animate-fade-in">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                      <User className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h2 className="font-bold text-base">Customer Details</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          placeholder="Full name" className="h-12 pl-9 rounded-xl text-base" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Class</Label>
                      <Input value={customer.class} onChange={(e) => setCustomer({ ...customer, class: e.target.value })}
                        placeholder="e.g. 5th A" className="h-12 rounded-xl text-base" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">School</Label>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={customer.school} onChange={(e) => setCustomer({ ...customer, school: e.target.value })}
                          placeholder="School name" className="h-12 pl-9 rounded-xl text-base" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX" className="h-12 pl-9 rounded-xl text-base" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items card */}
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 opacity-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-yellow-600" />
                      </div>
                      <h2 className="font-bold text-base">Order Items</h2>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">{filledItems.length} item{filledItems.length !== 1 ? "s" : ""}</span>
                    </div>
                    <Button size="sm" onClick={addItem}
                      className="h-9 rounded-xl bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-0 gap-1.5 font-semibold">
                      <Plus className="w-4 h-4" /> Add Item
                    </Button>
                  </div>

                  <div className="grid grid-cols-12 gap-3 px-1 mb-2">
                    <div className="col-span-5 text-xs font-bold text-muted-foreground uppercase tracking-wide">Item</div>
                    <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide text-center">Qty</div>
                    <div className="col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wide text-right">Rate (₹)</div>
                    <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wide text-right">Total</div>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-3 items-center bg-yellow-50/40 rounded-xl p-3 group">
                        <div className="col-span-5">
                          <Select value={item.material} onValueChange={(v) => updateItem(item.id, "material", v)}>
                            <SelectTrigger className="h-11 rounded-xl bg-white border-stone-200 text-sm">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {MATERIALS.map((m) => (
                                <SelectItem key={m} value={m}>
                                  <span className="flex items-center gap-2">{m}
                                    <span className="text-xs text-muted-foreground">₹{MATERIAL_RATES[m]}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Input type="number" min={1} value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            className="h-11 rounded-xl bg-white text-center text-base font-semibold border-stone-200" />
                        </div>
                        <div className="col-span-3">
                          <Input type="number" value={item.rate}
                            onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                            className="h-11 rounded-xl bg-white text-right text-base border-stone-200" />
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <span className="font-bold text-sm">₹{(item.quantity * item.rate).toLocaleString()}</span>
                          {items.length > 1 && (
                            <button onClick={() => removeItem(item.id)}
                              className="ml-1 w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-100 px-1">
                    <span className="text-sm text-muted-foreground">{filledItems.length} item{filledItems.length !== 1 ? "s" : ""} · {filledItems.reduce((s, i) => s + i.quantity, 0)} units</span>
                    <span className="font-bold text-base">₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Right — Summary */}
              <div className="lg:col-span-2 space-y-5">

                {/* Payment & employee */}
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 opacity-0 animate-fade-in" style={{ animationDelay: "120ms" }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h2 className="font-bold text-base">Payment</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Billed By</Label>
                      <Input value={employee} onChange={(e) => setEmployee(e.target.value)}
                        placeholder="Employee name" className="h-12 rounded-xl text-base" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment Mode</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "Cash", icon: Banknote },
                          { value: "Online", icon: CreditCard },
                        ].map(({ value, icon: Icon }) => (
                          <button key={value} onClick={() => setPaymentMode(value)}
                            className={`h-12 rounded-xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                              paymentMode === value
                                ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                                : "border-stone-200 text-muted-foreground hover:border-yellow-200"
                            }`}>
                            <Icon className="w-4 h-4" /> {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bill summary */}
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 opacity-0 animate-fade-in" style={{ animationDelay: "160ms" }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h2 className="font-bold text-base">Bill Summary</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-10 h-6 rounded-full transition-colors relative ${gstEnabled ? "bg-yellow-300" : "bg-muted"}`}
                          onClick={() => setGstEnabled(!gstEnabled)}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${gstEnabled ? "left-5" : "left-1"}`} />
                        </div>
                        <span className="text-sm text-muted-foreground">GST 18%</span>
                      </label>
                      <span className={`text-sm font-semibold ${gstEnabled ? "text-yellow-600" : "text-muted-foreground"}`}>
                        +₹{gst.toFixed(2)}
                      </span>
                    </div>

                    <div className="h-px bg-stone-100 my-1" />

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base">Total</span>
                      <span className="text-3xl font-bold text-yellow-500">₹{total.toLocaleString()}</span>
                    </div>

                    {paymentMode && (
                      <div className="flex items-center gap-2 bg-yellow-50/60 rounded-xl px-3 py-2">
                        {paymentMode === "Cash" ? <Banknote className="w-4 h-4 text-yellow-600" /> : <CreditCard className="w-4 h-4 text-yellow-600" />}
                        <span className="text-sm font-medium">{paymentMode} payment</span>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleGenerate} disabled={loading}
                    className="w-full h-14 mt-5 text-base rounded-2xl bg-yellow-300 hover:bg-yellow-500 text-yellow-900 font-bold border-0 shadow-xl shadow-yellow-100 gap-2">
                    {loading ? (
                      <><Sparkles className="w-5 h-5 animate-spin" /> Generating...</>
                    ) : (
                      <><FileText className="w-5 h-5" /> Generate Bill <ChevronRight className="w-4 h-4" /></>
                    )}
                  </Button>

                  <Button variant="outline" className="w-full h-11 mt-2 rounded-xl gap-2" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" /> Print Preview
                  </Button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
