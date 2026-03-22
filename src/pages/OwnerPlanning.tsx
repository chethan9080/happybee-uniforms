import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer, Plus, Trash2, Upload, RotateCcw, ClipboardList } from "lucide-react";
import SizeFrequencyTable from "@/components/SizeFrequencyTable";
import PrintCalculationView from "@/components/PrintCalculationView";

const MATERIALS = ["Shirt", "Pant", "Sweater", "Tie", "Belt", "Socks", "Blazer"];
const AVAILABLE_SIZES = ["22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44"];

interface StudentRow {
  id: string;
  name: string;
  items: Record<string, { size: string; qty: number }>;
}

const OwnerPlanning = () => {
  const [school, setSchool] = useState("");
  const [rows, setRows] = useState<StudentRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const parsed: StudentRow[] = json.map((row, i) => {
        const name = String(row["Name"] || row["name"] || row["Student Name"] || "");
        const items: Record<string, { size: string; qty: number }> = {};
        MATERIALS.forEach((m) => {
          const sizeKey = `${m} Size`;
          const qtyKey = `${m} Qty`;
          items[m] = {
            size: String(row[sizeKey] || row[m + "_Size"] || ""),
            qty: Number(row[qtyKey] || row[m + "_Qty"] || 0),
          };
        });
        return { id: `upload-${Date.now()}-${i}`, name, items };
      });

      setRows((prev) => [...prev, ...parsed]);
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        items: MATERIALS.reduce((acc, m) => ({ ...acc, [m]: { size: "", qty: 0 } }), {}),
      },
    ]);
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const updateName = (id: string, name: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));

  const updateItemSize = (id: string, material: string, size: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, items: { ...r.items, [material]: { ...r.items[material], size } } }
          : r
      )
    );

  const updateItemQty = (id: string, material: string, value: string) => {
    const qty = parseInt(value) || 0;
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, items: { ...r.items, [material]: { ...r.items[material], qty } } }
          : r
      )
    );
  };

  const getRowTotal = (row: StudentRow) =>
    Object.values(row.items || {}).reduce((sum, i) => sum + (i?.qty || 0), 0);

  const getColTotal = (material: string) =>
    rows.reduce((sum, r) => sum + (r.items[material]?.qty || 0), 0);

  const grandTotal = rows.reduce((sum, r) => sum + getRowTotal(r), 0);

  const clearAll = () => {
    setSchool("");
    setRows([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout role="owner">
      {/* Print-only view */}
      <PrintCalculationView school={school} rows={rows} materials={MATERIALS} />

      <div className="no-print min-h-screen bg-[#fffdf5] p-6 md:p-10">
        <div className="max-w-full mx-auto space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 opacity-0 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-100">
              <ClipboardList className="w-7 h-7 text-yellow-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Planning Tool</h1>
              <p className="text-muted-foreground mt-0.5">Plan stock requirements by student — temporary calculation only</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button variant="outline" className="h-11 rounded-xl gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" /> Upload Excel
            </Button>
            <Button className="h-11 rounded-xl gap-2 bg-yellow-300 hover:bg-yellow-500 text-yellow-900 font-bold border-0" onClick={addRow}>
              <Plus className="w-4 h-4" /> Add Student
            </Button>
            <Button variant="outline" className="h-11 rounded-xl gap-2 text-destructive hover:text-destructive"
              onClick={clearAll} disabled={rows.length === 0 && !school}>
              <RotateCcw className="w-4 h-4" /> Clear All
            </Button>
            <Button variant="outline" className="h-11 rounded-xl gap-2" onClick={handlePrint} disabled={rows.length === 0}>
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        </div>

        {/* School input */}
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 max-w-sm opacity-0 animate-fade-in" style={{ animationDelay: "60ms" }}>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">School Name</Label>
            <Input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Enter school name"
              className="h-12 rounded-xl text-base"
            />
          </div>
        </div>

        {rows.length > 0 ? (
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {school && (
              <div className="p-4 bg-yellow-50 border-b border-yellow-100">
                <h3 className="font-semibold text-base text-yellow-700">{school}</h3>
              </div>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="min-w-[150px] align-bottom border-r border-border/30">
                      Student Name
                    </TableHead>
                    {MATERIALS.map((m) => (
                      <TableHead key={m} colSpan={2} className="text-center border-r border-border/30 border-b-0">
                        {m}
                      </TableHead>
                    ))}
                    <TableHead rowSpan={2} className="text-center align-bottom font-semibold">
                      Total Qty
                    </TableHead>
                    <TableHead rowSpan={2} className="w-[50px] align-bottom" />
                  </TableRow>
                  <TableRow>
                    {MATERIALS.map((m) => (
                      <TableHead key={`${m}-sub`} colSpan={2} className="border-r border-border/30 p-0">
                        <div className="flex">
                          <span className="flex-1 text-center text-xs py-1 border-r border-border/20">Size</span>
                          <span className="flex-1 text-center text-xs py-1">Qty</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="p-1 border-r border-border/30">
                        <Input
                          value={row.name}
                          onChange={(e) => updateName(row.id, e.target.value)}
                          placeholder="Name"
                          className="h-9"
                        />
                      </TableCell>
                      {MATERIALS.map((m) => (
                        <TableCell key={m} colSpan={2} className="p-0 border-r border-border/30">
                          <div className="flex">
                            <div className="flex-1 p-1 border-r border-border/20">
                              <Select
                                value={row.items[m]?.size || ""}
                                onValueChange={(v) => updateItemSize(row.id, m, v)}
                              >
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue placeholder="—" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AVAILABLE_SIZES.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex-1 p-1">
                              <Input
                                type="number"
                                min={0}
                                value={row.items[m]?.qty || ""}
                                onChange={(e) => updateItemQty(row.id, m, e.target.value)}
                                className="h-9 text-center"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold text-primary">
                        {getRowTotal(row)}
                      </TableCell>
                      <TableCell className="p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeRow(row.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/40 font-semibold">
                    <TableCell className="border-r border-border/30">Total</TableCell>
                    {MATERIALS.map((m) => (
                      <TableCell key={m} colSpan={2} className="text-center border-r border-border/30">
                        {getColTotal(m)}
                      </TableCell>
                    ))}
                    <TableCell className="text-center text-primary">{grandTotal}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-16 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-lg font-semibold mb-1">No students added yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Student" to start planning</p>
          </div>
        )}

        <SizeFrequencyTable rows={rows} materials={MATERIALS} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerPlanning;
