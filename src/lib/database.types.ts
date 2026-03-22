export type Database = {
  public: {
    Tables: {
      stock: {
        Row: { id: number; school: string; gender: string; material: string; size: string; quantity: number; created_at: string };
        Insert: { school: string; gender: string; material: string; size: string; quantity: number };
        Update: { school?: string; gender?: string; material?: string; size?: string; quantity?: number };
      };
      bills: {
        Row: { id: string; invoice_no: string; customer_name: string; customer_class: string; school: string; phone: string; billed_by: string; subtotal: number; gst: number; total: number; payment_mode: string; date: string; created_at: string };
        Insert: { invoice_no: string; customer_name: string; customer_class?: string; school?: string; phone?: string; billed_by?: string; subtotal: number; gst: number; total: number; payment_mode: string; date: string };
        Update: { invoice_no?: string; customer_name?: string; customer_class?: string; school?: string; phone?: string; billed_by?: string; subtotal?: number; gst?: number; total?: number; payment_mode?: string; date?: string };
      };
      bill_items: {
        Row: { id: number; bill_id: string; material: string; quantity: number; rate: number; amount: number };
        Insert: { bill_id: string; material: string; quantity: number; rate: number; amount: number };
        Update: { bill_id?: string; material?: string; quantity?: number; rate?: number; amount?: number };
      };
      attendance: {
        Row: { id: number; employee_name: string; status: "present" | "absent"; date: string; created_at: string };
        Insert: { employee_name: string; status: "present" | "absent"; date: string };
        Update: { employee_name?: string; status?: "present" | "absent"; date?: string };
      };
      employees: {
        Row: { id: string; name: string; created_at: string };
        Insert: { name: string };
        Update: { name?: string };
      };
      returns: {
        Row: { id: number; school: string; student_name: string; student_class: string | null; returned_material: string; exchanged_material: string; date: string; created_at: string };
        Insert: { school: string; student_name: string; student_class?: string; returned_material: string; exchanged_material: string; date: string };
        Update: { school?: string; student_name?: string; student_class?: string; returned_material?: string; exchanged_material?: string; date?: string };
      };
    };
  };
};
