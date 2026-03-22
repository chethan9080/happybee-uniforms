import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Send, Check, X, Users, UserCheck, UserX, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Employee { id: string; name: string; status: "present" | "absent" | null; }

const Attendance = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const dayName = new Date().toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await (supabase.from("employees") as any).select("*").order("created_at");
      if (error) toast.error(error.message);
      else setEmployees((data || []).map((e: any) => ({ ...e, status: null })));
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const markStatus = (id: string, status: "present" | "absent") =>
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));

  const addEmployee = async () => {
    if (!newName.trim()) return;
    const { data, error } = await (supabase.from("employees") as any).insert({ name: newName.trim() }).select().single();
    if (error) { toast.error(error.message); return; }
    setEmployees((prev) => [...prev, { ...(data as any), status: null }]);
    setNewName(""); setShowAdd(false);
  };

  const handleSubmit = async () => {
    const unmarked = employees.filter((e) => e.status === null);
    if (unmarked.length > 0) { toast.error("Please mark attendance for all employees"); return; }
    setSubmitting(true);
    const todayDate = new Date().toISOString().split("T")[0];
    const { error } = await (supabase.from("attendance") as any).insert(
      employees.map((e) => ({ employee_name: e.name, status: e.status!, date: todayDate }))
    );
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    const present = employees.filter((e) => e.status === "present").length;
    const absent = employees.filter((e) => e.status === "absent").length;
    toast.success(`Attendance submitted! Present: ${present}, Absent: ${absent}`);
    setEmployees((prev) => prev.map((e) => ({ ...e, status: null })));
  };

  const presentCount = employees.filter((e) => e.status === "present").length;
  const absentCount = employees.filter((e) => e.status === "absent").length;
  const unmarkedCount = employees.filter((e) => e.status === null).length;
  const progressPct = employees.length > 0 ? ((employees.length - unmarkedCount) / employees.length) * 100 : 0;

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const avatarGradients = [
    "from-yellow-400 to-yellow-500","from-stone-400 to-stone-500","from-yellow-300 to-yellow-400",
    "from-stone-300 to-stone-400","from-yellow-500 to-yellow-600","from-stone-500 to-stone-600",
    "from-yellow-200 to-yellow-300","from-stone-200 to-stone-300",
  ];

  return (
    <DashboardLayout role="worker">
      <div className="min-h-screen bg-[#fffdf5] p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-300 to-yellow-200 p-8 text-yellow-900 shadow-xl shadow-yellow-100 opacity-0 animate-fade-in">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-8 w-40 h-40 rounded-full bg-white/30 blur-2xl" />
              <div className="absolute bottom-0 left-16 w-32 h-32 rounded-full bg-white/20 blur-xl" />
            </div>
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/30 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-yellow-700" />
                  </div>
                  <span className="text-yellow-700 text-sm font-medium">{dayName}</span>
                </div>
                <h1 className="text-4xl font-bold mb-1">Daily Attendance</h1>
                <p className="text-yellow-700 text-base">{dateStr}</p>
                <div className="flex items-center gap-6 mt-5">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-900">{employees.length}</p>
                    <p className="text-yellow-700 text-xs mt-0.5">Total Staff</p>
                  </div>
                  <div className="w-px h-10 bg-amber-600/20" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-800">{presentCount}</p>
                    <p className="text-yellow-700 text-xs mt-0.5">Present</p>
                  </div>
                  <div className="w-px h-10 bg-amber-600/20" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-800">{absentCount}</p>
                    <p className="text-yellow-700 text-xs mt-0.5">Absent</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-white/30 border-amber-600/30 text-yellow-800 hover:bg-white/40 h-11 rounded-xl gap-2 shrink-0"
                onClick={() => setShowAdd(!showAdd)}
              >
                <UserPlus className="w-4 h-4" /> Add Employee
              </Button>
            </div>

            {/* Progress bar inside hero */}
            {employees.length > 0 && (
              <div className="relative mt-6">
                <div className="flex justify-between text-xs text-yellow-700/70 mb-2">
                  <span>Marking Progress</span>
                  <span>{employees.length - unmarkedCount}/{employees.length} marked</span>
                </div>
                <div className="h-2 bg-amber-600/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-700/60 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Add employee panel */}
          {showAdd && (
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-5 flex gap-3 items-center opacity-0 animate-fade-in">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-green-500" />
              </div>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter employee name" className="h-12 rounded-xl text-base flex-1"
                onKeyDown={(e) => e.key === "Enter" && addEmployee()} />
              <Button onClick={addEmployee} className="h-12 px-6 rounded-xl bg-green-500 hover:bg-green-600">Add</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)} className="h-12 rounded-xl">Cancel</Button>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
            {[
              { label: "Total Staff", value: employees.length, icon: Users, gradient: "from-yellow-300 to-yellow-200", light: "bg-yellow-50", text: "text-yellow-700" },
              { label: "Present Today", value: presentCount, icon: UserCheck, gradient: "from-yellow-400 to-yellow-500", light: "bg-yellow-50", text: "text-yellow-700" },
              { label: "Absent Today", value: absentCount, icon: UserX, gradient: "from-stone-400 to-stone-500", light: "bg-stone-50", text: "text-stone-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md shrink-0`}>
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-bold">{s.value}</p>
                  <p className={`text-sm font-medium mt-0.5 ${s.text}`}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance rate card */}
          {employees.length > 0 && (
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 opacity-0 animate-fade-in" style={{ animationDelay: "120ms" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                    <TrendingUp className="w-4.5 h-4.5 text-yellow-500" style={{ width: "18px", height: "18px" }} />
                  </div>
                  <div>
                    <p className="font-semibold">Attendance Rate</p>
                    <p className="text-xs text-muted-foreground">Based on marked employees</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {employees.length - unmarkedCount > 0
                    ? Math.round((presentCount / (employees.length - unmarkedCount)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-300 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{employees.length - unmarkedCount} marked</span>
                <span>{unmarkedCount} remaining</span>
              </div>
            </div>
          )}

          {/* Employee grid */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "160ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Staff Members</h2>
              {unmarkedCount > 0 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                  {unmarkedCount} not marked
                </span>
              )}
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-border/50 p-16 text-center text-muted-foreground">
                Loading employees...
              </div>
            ) : employees.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border/50 p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-lg mb-1">No employees yet</p>
                <p className="text-muted-foreground text-sm">Click "Add Employee" to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employees.map((emp, i) => (
                  <div
                    key={emp.id}
                    className={`bg-white rounded-2xl border-2 shadow-sm p-5 flex items-center gap-4 transition-all duration-300 opacity-0 animate-fade-in ${
                      emp.status === "present"
                        ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50/50 shadow-green-100"
                        : emp.status === "absent"
                        ? "border-red-300 bg-gradient-to-r from-red-50 to-rose-50/50 shadow-red-100"
                        : "border-border/50 hover:border-border"
                    }`}
                    style={{ animationDelay: `${200 + i * 40}ms` }}
                  >
                    {/* Avatar */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md`}>
                      {getInitials(emp.name)}
                    </div>

                    {/* Name & status */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base truncate">{emp.name}</p>
                      <div className={`inline-flex items-center gap-1.5 mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        emp.status === "present"
                          ? "bg-green-100 text-green-700"
                          : emp.status === "absent"
                          ? "bg-red-100 text-red-700"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {emp.status === "present" ? "Present" : emp.status === "absent" ? "Absent" : "Not marked"}
                      </div>
                    </div>

                    {/* Toggle buttons */}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => markStatus(emp.id, "present")}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 font-medium ${
                          emp.status === "present"
                            ? "bg-green-500 text-white shadow-lg shadow-green-200 scale-105"
                            : "bg-muted text-muted-foreground hover:bg-green-100 hover:text-green-600 hover:scale-105"
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => markStatus(emp.id, "absent")}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          emp.status === "absent"
                            ? "bg-red-500 text-white shadow-lg shadow-red-200 scale-105"
                            : "bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-600 hover:scale-105"
                        }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit button */}
          {employees.length > 0 && (
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <Button
                onClick={handleSubmit}
                disabled={submitting || unmarkedCount > 0}
                className="w-full h-16 text-lg rounded-2xl bg-yellow-300 hover:bg-yellow-500 text-yellow-900 font-bold border-0 shadow-xl shadow-yellow-100 disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="w-5 h-5 mr-3" />
                {submitting
                  ? "Submitting attendance..."
                  : unmarkedCount > 0
                  ? `Mark ${unmarkedCount} more employee${unmarkedCount > 1 ? "s" : ""} to submit`
                  : "Submit Attendance"}
              </Button>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
