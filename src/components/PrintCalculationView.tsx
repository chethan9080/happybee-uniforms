import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StudentRow {
  id: string;
  name: string;
  items: Record<string, { size: string; qty: number }>;
}

interface PrintCalculationViewProps {
  school: string;
  rows: StudentRow[];
  materials: string[];
}

interface FreqEntry {
  itemType: string;
  size: string;
  quantity: number;
}

function computeFlatFrequency(
  rows: StudentRow[],
  materials: string[]
): FreqEntry[] {
  const map: Record<string, Record<string, number>> = {};

  for (const mat of materials) {
    map[mat] = {};
    for (const row of rows) {
      const size = row.items[mat]?.size;
      const qty = row.items[mat]?.qty || 0;
      if (!size || qty === 0) continue;
      map[mat][size] = (map[mat][size] || 0) + qty;
    }
  }

  const entries: FreqEntry[] = [];
  for (const mat of materials) {
    const sizes = Object.keys(map[mat]).sort((a, b) => {
      const na = parseFloat(a);
      const nb = parseFloat(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });
    for (const size of sizes) {
      entries.push({ itemType: mat, size, quantity: map[mat][size] });
    }
  }

  return entries;
}

const PrintCalculationView = ({ school, rows, materials }: PrintCalculationViewProps) => {
  const entries = computeFlatFrequency(rows, materials);
  const grandTotal = entries.reduce((sum, e) => sum + e.quantity, 0);

  if (entries.length === 0) return null;

  // Group by item type for subtotals
  let currentType = "";

  return (
    <div className="hidden print-only print:block" style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
          {school || "School Name"}
        </h1>
        <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>
          Size-wise Quantity Calculation
        </p>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ border: "1px solid #d1d5db", padding: "8px 12px", textAlign: "left" }}>
              Item Type
            </th>
            <th style={{ border: "1px solid #d1d5db", padding: "8px 12px", textAlign: "center" }}>
              Size
            </th>
            <th style={{ border: "1px solid #d1d5db", padding: "8px 12px", textAlign: "center" }}>
              Quantity
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const showType = entry.itemType !== currentType;
            currentType = entry.itemType;
            return (
              <tr key={`${entry.itemType}-${entry.size}`}>
                <td
                  style={{
                    border: "1px solid #d1d5db",
                    padding: "6px 12px",
                    fontWeight: showType ? 600 : 400,
                  }}
                >
                  {showType ? entry.itemType : ""}
                </td>
                <td style={{ border: "1px solid #d1d5db", padding: "6px 12px", textAlign: "center" }}>
                  {entry.size}
                </td>
                <td style={{ border: "1px solid #d1d5db", padding: "6px 12px", textAlign: "center" }}>
                  {entry.quantity}
                </td>
              </tr>
            );
          })}
          <tr style={{ backgroundColor: "#f3f4f6", fontWeight: 700 }}>
            <td
              colSpan={2}
              style={{ border: "1px solid #d1d5db", padding: "8px 12px", textAlign: "right" }}
            >
              Grand Total
            </td>
            <td style={{ border: "1px solid #d1d5db", padding: "8px 12px", textAlign: "center" }}>
              {grandTotal}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Student detail list */}
      <div style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
          Student Details ({rows.length} students)
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "left" }}>#</th>
              <th style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "left" }}>Name</th>
              {materials.map((m) => (
                <th
                  key={m}
                  style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id}>
                <td style={{ border: "1px solid #d1d5db", padding: "4px 8px" }}>{idx + 1}</td>
                <td style={{ border: "1px solid #d1d5db", padding: "4px 8px" }}>
                  {row.name || "—"}
                </td>
                {materials.map((m) => (
                  <td
                    key={m}
                    style={{ border: "1px solid #d1d5db", padding: "4px 8px", textAlign: "center" }}
                  >
                    {row.items[m]?.size && row.items[m]?.qty
                      ? `${row.items[m].size} × ${row.items[m].qty}`
                      : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintCalculationView;
