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

interface SizeFrequencyTableProps {
  rows: StudentRow[];
  materials: string[];
}

/**
 * Computes a frequency map: for each material, count how many students selected each size.
 * Returns { "36": { Shirt: 3, Pant: 1 }, "38": { Shirt: 0, Pant: 2 } ... }
 */
function computeSizeFrequency(
  rows: StudentRow[],
  materials: string[]
): { allSizes: string[]; freq: Record<string, Record<string, number>> } {
  const freq: Record<string, Record<string, number>> = {};

  for (const row of rows) {
    for (const mat of materials) {
      const size = row.items[mat]?.size;
      if (!size) continue;
      if (!freq[size]) {
        freq[size] = {};
      }
      freq[size][mat] = (freq[size][mat] || 0) + (row.items[mat]?.qty || 0);
    }
  }

  const allSizes = Object.keys(freq).sort((a, b) => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });

  return { allSizes, freq };
}

const SizeFrequencyTable = ({ rows, materials }: SizeFrequencyTableProps) => {
  const { allSizes, freq } = computeSizeFrequency(rows, materials);

  if (allSizes.length === 0) {
    return (
      <div className="card-elevated p-8 text-center text-muted-foreground animate-fade-in">
        <p className="text-base">No size data to summarize yet</p>
        <p className="text-sm mt-1">Enter student sizes above to see the frequency breakdown</p>
      </div>
    );
  }

  // Column totals per material
  const materialTotals: Record<string, number> = {};
  materials.forEach((mat) => {
    materialTotals[mat] = allSizes.reduce((sum, s) => sum + (freq[s]?.[mat] || 0), 0);
  });
  const grandTotal = Object.values(materialTotals).reduce((s, v) => s + v, 0);

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      <div className="p-4 bg-muted/30 border-b border-border/50">
        <h3 className="font-semibold text-base">Size-wise Quantity Summary</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Automatic frequency count grouped by size
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[80px] font-semibold">Size</TableHead>
              {materials.map((mat) => (
                <TableHead key={mat} className="text-center font-semibold min-w-[100px]">
                  {mat} Count
                </TableHead>
              ))}
              <TableHead className="text-center font-semibold min-w-[90px]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSizes.map((size) => {
              const rowTotal = materials.reduce((sum, mat) => sum + (freq[size]?.[mat] || 0), 0);
              return (
                <TableRow key={size}>
                  <TableCell className="font-medium">{size}</TableCell>
                  {materials.map((mat) => (
                    <TableCell key={mat} className="text-center">
                      {freq[size]?.[mat] || 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-semibold text-primary">
                    {rowTotal}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-muted/40 font-semibold">
              <TableCell>Total</TableCell>
              {materials.map((mat) => (
                <TableCell key={mat} className="text-center">
                  {materialTotals[mat]}
                </TableCell>
              ))}
              <TableCell className="text-center text-primary">{grandTotal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SizeFrequencyTable;
