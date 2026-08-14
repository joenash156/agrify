import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardUser,
  faCalendarDay,
  faCircleCheck,
  faClock,
  faTriangleExclamation,
  faUserClock,
  faFingerprint,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { PageHeader } from "../../components/common/PageHeader";
import { ListToolbar } from "../../components/common/ListToolbar";
import { EntityCard } from "../../components/common/EntityCard";
import { RowActions } from "../../components/common/RowActions";
import { EmptyState } from "../../components/common/EmptyState";
import { EntityFormModal, type FieldConfig, type FieldValue } from "../../components/common/EntityFormModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { formatDate } from "../../utils/formatDate";
import { canManageRecords } from "../../utils/permissions";
import { useCurrentUser } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { attendanceService } from "../../services/attendanceService";
import { employeeService } from "../../services/employeeService";
import { appUserService } from "../../services/appUserService";
import type { Attendance } from "../../types/attendance";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Attendance["attendanceStatus"] | "ALL"> = ["ALL", "PRESENT", "LATE", "ABSENT", "LEAVE"];
const ATTENDANCE_STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present" },
  { value: "LATE", label: "Late" },
  { value: "ABSENT", label: "Absent" },
  { value: "LEAVE", label: "Leave" },
];
const USERNAME_FIELD: FieldConfig[] = [
  { name: "username", label: "Username", type: "text", required: true, placeholder: "e.g. field.worker" },
];

type ModalState = { mode: "create" | "view"; record?: Attendance };

export default function AttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Attendance["attendanceStatus"] | "ALL">("ALL");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);

  const [clockInOpen, setClockInOpen] = useState(false);
  const [confirmClockIn, setConfirmClockIn] = useState<{ username: string; previewTime: Date } | null>(null);

  const loadAttendance = useCallback(() => {
    return Promise.all([attendanceService.findAll(), employeeService.findAll(), appUserService.findAll()])
      .then(([records, employments, users]) => {
        const userIdByEmploymentId = new Map(employments.map((e) => [e.employmentId, e.userId]));
        const userById = new Map(users.map((u) => [u.userId, u]));
        const nameByEmploymentId = new Map(
          employments.map((e) => {
            const user = userById.get(e.userId);
            return [e.employmentId, user ? `${user.firstName} ${user.lastName} (${e.role})` : `Unknown (${e.role})`];
          })
        );
        setEmployeeOptions(employments.map((e) => ({ value: e.employmentId, label: nameByEmploymentId.get(e.employmentId) ?? e.employmentId })));
        setAttendance(
          records.map((record) => {
            const userId = userIdByEmploymentId.get(record.employmentId);
            const user = userId ? userById.get(userId) : undefined;
            return {
              ...record,
              employeeName: user ? `${user.firstName} ${user.lastName}` : "Unknown Employee",
            };
          })
        );
      })
      .catch(() => setAttendance([]));
  }, []);

  useEffect(() => {
    loadAttendance().finally(() => setIsLoading(false));
  }, [loadAttendance]);

  const attendanceFields: FieldConfig[] = useMemo(
    () => [
      { name: "employmentId", label: "Employee", type: "select", required: true, options: employeeOptions },
      { name: "attendanceDate", label: "Date", type: "date", required: true },
      { name: "checkIn", label: "Check In", type: "time" },
      { name: "checkOut", label: "Check Out", type: "time" },
      { name: "attendanceStatus", label: "Status", type: "select", required: true, options: ATTENDANCE_STATUS_OPTIONS },
    ],
    [employeeOptions]
  );

  const handleSubmit = async (values: Record<string, FieldValue>) => {
    await attendanceService.create({
      employmentId: String(values.employmentId),
      attendanceDate: String(values.attendanceDate),
      checkIn: values.checkIn ? String(values.checkIn) : null,
      checkOut: values.checkOut ? String(values.checkOut) : null,
      attendanceStatus: values.attendanceStatus as Attendance["attendanceStatus"],
    });
    await loadAttendance();
  };

  const handleUsernameSubmit = async (values: Record<string, FieldValue>) => {
    const typed = String(values.username).trim();
    if (typed.toLowerCase() !== currentUser.username.toLowerCase()) {
      throw new Error(`That's not your username. Please enter your correct username to record your attendance.`);
    }
    setConfirmClockIn({ username: typed, previewTime: new Date() });
  };

  const handleConfirmClockIn = async () => {
    if (!confirmClockIn) return;
    const result = await attendanceService.clockIn(confirmClockIn.username);
    toast.success(`Attendance recorded for ${result.employeeName} at ${result.checkIn}.`);
    await loadAttendance();
  };

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    return [
      { id: "present", title: "Present", value: attendance.filter((a) => a.attendanceStatus === "PRESENT").length, trend: "neutral", subtitle: "All recorded days", icon: faCircleCheck, accentColor: "teal" },
      { id: "late", title: "Late Check-ins", value: attendance.filter((a) => a.attendanceStatus === "LATE").length, trend: "neutral", subtitle: "All recorded days", icon: faClock, accentColor: "amber" },
      { id: "absent", title: "Absent", value: attendance.filter((a) => a.attendanceStatus === "ABSENT").length, trend: "neutral", subtitle: "Unreported absences", icon: faTriangleExclamation, accentColor: "rose" },
      { id: "leave", title: "On Leave", value: attendance.filter((a) => a.attendanceStatus === "LEAVE").length, trend: "neutral", subtitle: "Approved leave", icon: faUserClock, accentColor: "blue" },
    ];
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) => {
      const matchesSearch = record.employeeName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || record.attendanceStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [attendance, search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Attendance Logs"
        subtitle={
          canManage
            ? "Review daily check-ins, check-outs, and attendance status."
            : "Record your attendance for today."
        }
        actionLabel={canManage ? "Log Attendance" : "Record Attendance"}
        showAction
        onAction={() => (canManage ? setModal({ mode: "create" }) : setClockInOpen(true))}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {!canManage && (
        <div className={`rounded-2xl border p-8 flex flex-col items-center justify-center text-center gap-3 ${cardBg}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
            <FontAwesomeIcon icon={faFingerprint} className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-sm font-bold ${sectionTitle}`}>Attendance logs are only visible to admins and farm managers</p>
            <p className={`text-xs mt-1 ${subText}`}>You can still record your attendance.</p>
          </div>
          <button
            type="button"
            onClick={() => setClockInOpen(true)}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm"
          >
            <FontAwesomeIcon icon={faFingerprint} className="w-3.5 h-3.5" />
            Record Attendance
          </button>
        </div>
      )}

      {canManage && (
        <>
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
                        <RowActions
                          canManage={canManage}
                          entityLabel="attendance record"
                          onView={() => setModal({ mode: "view", record })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!isLoading && filteredAttendance.length === 0 && <EmptyState title="No attendance records found" />}
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
                onView={() => setModal({ mode: "view", record })}
                fields={[
                  { label: "Check In", value: record.checkIn ?? "—" },
                  { label: "Check Out", value: record.checkOut ?? "—" },
                ]}
              />
            ))}
            {!isLoading && filteredAttendance.length === 0 && <EmptyState title="No attendance records found" />}
          </div>
        </>
      )}

      <EntityFormModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "view" ? "Attendance Details" : "Log Attendance"}
        fields={attendanceFields}
        initialValues={
          modal?.record
            ? {
                employmentId: modal.record.employmentId,
                attendanceDate: modal.record.attendanceDate,
                checkIn: modal.record.checkIn ?? "",
                checkOut: modal.record.checkOut ?? "",
                attendanceStatus: modal.record.attendanceStatus,
              }
            : { employmentId: "", attendanceDate: "", checkIn: "", checkOut: "", attendanceStatus: "PRESENT" }
        }
        onSubmit={handleSubmit}
        submitLabel="Log Attendance"
        readOnly={modal?.mode === "view"}
      />

      {/* Step 1 — who's clocking in */}
      <EntityFormModal
        isOpen={clockInOpen}
        onClose={() => setClockInOpen(false)}
        title="Record Attendance"
        subtitle="Enter the username of the person clocking in."
        fields={USERNAME_FIELD}
        initialValues={{ username: "" }}
        onSubmit={handleUsernameSubmit}
        submitLabel="Continue"
      />

      {/* Step 2 — confirm before writing to the log */}
      <ConfirmDialog
        isOpen={confirmClockIn !== null}
        onClose={() => setConfirmClockIn(null)}
        title="Confirm Attendance"
        message={
          confirmClockIn
            ? `Record attendance for "${confirmClockIn.username}" at ${confirmClockIn.previewTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}?`
            : ""
        }
        confirmLabel="Confirm"
        danger={false}
        onConfirm={handleConfirmClockIn}
      />
    </>
  );
}
