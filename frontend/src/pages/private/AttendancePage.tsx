import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardUser, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { PageHeader } from "../../components/common/PageHeader";
import { ListToolbar } from "../../components/common/ListToolbar";
import { EntityCard } from "../../components/common/EntityCard";
import { RowActions } from "../../components/common/RowActions";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate } from "../../utils/formatDate";
import { canManageRecords } from "../../utils/permissions";
import { MOCK_USER } from "../../data/dashboardMockData";
import { MOCK_ATTENDANCE, ATTENDANCE_STATS } from "../../data/attendanceMockData";
import type { Attendance } from "../../types/attendance";

const STATUS_FILTERS: Array<Attendance["attendanceStatus"] | "ALL"> = ["ALL", "PRESENT", "LATE", "ABSENT", "LEAVE"];

export default function AttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canManage = canManageRecords(MOCK_USER.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Attendance["attendanceStatus"] | "ALL">("ALL");

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const filteredAttendance = useMemo(() => {
    return MOCK_ATTENDANCE.filter((record) => {
      const matchesSearch = record.employeeName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || record.attendanceStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Attendance Logs"
        subtitle="Review daily check-ins, check-outs, and attendance status."
        actionLabel="Log Attendance"
        showAction={canManage}
        onAction={() => alert("Logging attendance will be available once the backend is connected.")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ATTENDANCE_STATS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by employee name..."
        filters={STATUS_FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Desktop table */}
      <div className={`hidden md:block rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Employee", "Date", "Check In", "Check Out", "Status"].map((col) => (
                  <th
                    key={col}
                    className={`text-left px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    {col}
                  </th>
                ))}
                <th className={`px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-right ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-zinc-800" : "divide-zinc-100"}`}>
              {filteredAttendance.map((record) => (
                <tr
                  key={record.attendanceId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faClipboardUser} className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${sectionTitle}`}>{record.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                      {formatDate(record.attendanceDate)}
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-medium ${subText}`}>{record.checkIn ?? "—"}</td>
                  <td className={`px-5 py-3.5 text-xs font-medium ${subText}`}>{record.checkOut ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={record.attendanceStatus} variant="attendance" />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="attendance record" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAttendance.length === 0 && <EmptyState title="No attendance records found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredAttendance.map((record) => (
          <EntityCard
            key={record.attendanceId}
            icon={faClipboardUser}
            title={record.employeeName}
            subtitle={formatDate(record.attendanceDate)}
            badge={<StatusBadge status={record.attendanceStatus} variant="attendance" />}
            canManage={canManage}
            entityLabel="attendance record"
            fields={[
              { label: "Check In", value: record.checkIn ?? "—" },
              { label: "Check Out", value: record.checkOut ?? "—" },
            ]}
          />
        ))}
        {filteredAttendance.length === 0 && <EmptyState title="No attendance records found" />}
      </div>
    </>
  );
}
