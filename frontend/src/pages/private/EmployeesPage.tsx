import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTractor, faCalendarDay, faCircleCheck, faClock, faCreditCard } from "@fortawesome/free-solid-svg-icons";
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
import { employeeService, type EmploymentRecordDto } from "../../services/employeeService";
import { appUserService, type AppUser } from "../../services/appUserService";
import { farmService } from "../../services/farmService";
import type { Farm } from "../../types/farm";
import type { Employee } from "../../types/employee";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Employee["employmentStatus"] | "ALL"> = [
  "ALL",
  "ACTIVE",
  "ON_LEAVE",
  "SUSPENDED",
  "TERMINATED",
];

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "ON_LEAVE", label: "On Leave" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "TERMINATED", label: "Terminated" },
];

type ModalState = { mode: "create" | "edit" | "view"; record?: Employee };

export default function EmployeesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Employee["employmentStatus"] | "ALL">("ALL");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employments, setEmployments] = useState<EmploymentRecordDto[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const loadEmployees = useCallback(() => {
    return Promise.all([employeeService.findAll(), appUserService.findAll(), farmService.findAll()])
      .then(([employmentList, userList, farmList]) => {
        setEmployments(employmentList);
        setUsers(userList);
        setFarms(farmList);
        const userById = new Map(userList.map((u) => [u.userId, u]));
        const farmNameById = new Map(farmList.map((f) => [f.farmId, f.farmName]));
        setEmployees(
          employmentList.map((employment) => {
            const user = userById.get(employment.userId);
            return {
              employmentId: employment.employmentId,
              userId: employment.userId,
              firstName: user?.firstName ?? "Unknown",
              lastName: user?.lastName ?? "User",
              email: user?.email ?? "—",
              phoneNumber: user?.phoneNumber ?? "—",
              farmName: farmNameById.get(employment.farmId) ?? "Unknown Farm",
              jobTitle: employment.role,
              salary: employment.salary,
              hireDate: employment.hireDate,
              employmentStatus: employment.employmentStatus,
            };
          })
        );
      })
      .catch(() => setEmployees([]));
  }, []);

  useEffect(() => {
    loadEmployees().finally(() => setIsLoading(false));
  }, [loadEmployees]);

  const employeeFields: FieldConfig[] = useMemo(
    () => [
      {
        name: "userId",
        label: "Person",
        type: "select",
        required: true,
        options: users.map((u) => ({ value: u.userId, label: `${u.firstName} ${u.lastName} (${u.email})` })),
      },
      {
        name: "farmId",
        label: "Farm",
        type: "select",
        required: true,
        options: farms.map((f) => ({ value: f.farmId, label: f.farmName })),
      },
      { name: "role", label: "Job Title", type: "text", required: true, placeholder: "e.g. Field Supervisor" },
      { name: "salary", label: "Salary (₵)", type: "number", required: true, step: "0.01" },
      { name: "hireDate", label: "Hire Date", type: "date", required: true },
      { name: "employmentStatus", label: "Status", type: "select", required: true, options: EMPLOYMENT_STATUS_OPTIONS },
    ],
    [users, farms]
  );

  const handleSubmit = async (values: Record<string, FieldValue>) => {
    const payload = {
      userId: String(values.userId),
      farmId: String(values.farmId),
      role: String(values.role),
      salary: Number(values.salary),
      hireDate: String(values.hireDate),
      employmentStatus: values.employmentStatus as Employee["employmentStatus"],
    };
    if (modal?.mode === "edit" && modal.record) {
      await employeeService.update(modal.record.employmentId, payload);
    } else {
      await employeeService.create(payload);
    }
    await loadEmployees();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await employeeService.remove(deleteTarget.employmentId);
    await loadEmployees();
  };

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const active = employees.filter((e) => e.employmentStatus === "ACTIVE");
    const payroll = active.reduce((sum, e) => sum + e.salary, 0);
    return [
      { id: "total", title: "Total Employees", value: employees.length, trend: "neutral", subtitle: "Across all farms", icon: faUsers, accentColor: "blue" },
      { id: "active", title: "Active Employees", value: active.length, trend: "neutral", subtitle: "Currently employed", icon: faCircleCheck, accentColor: "teal" },
      { id: "on-leave", title: "On Leave", value: employees.filter((e) => e.employmentStatus === "ON_LEAVE").length, trend: "neutral", subtitle: "Temporarily away", icon: faClock, accentColor: "amber" },
      { id: "payroll", title: "Monthly Payroll", value: `₵ ${payroll.toLocaleString()}`, trend: "neutral", subtitle: "Combined active salaries", icon: faCreditCard, accentColor: "purple" },
    ];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        employee.farmName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || employee.employmentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle="Manage farm staff, roles, and employment status."
        actionLabel="Add Employee"
        showAction={canManage}
        onAction={() => setModal({ mode: "create" })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, job title, or farm..."
        filters={STATUS_FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Desktop table */}
      <div className={`hidden md:block rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Employee", "Job Title", "Farm", "Hired", "Salary", "Status"].map((col) => (
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
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.employmentId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black text-white bg-teal-600`}
                      >
                        {employee.firstName[0]}
                        {employee.lastName[0]}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${sectionTitle}`}>
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className={`text-[11px] ${subText}`}>{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-medium ${subText}`}>{employee.jobTitle}</td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                      <FontAwesomeIcon icon={faTractor} className="w-3 h-3" />
                      {employee.farmName}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                      {formatDate(employee.hireDate)}
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    ₵ {employee.salary.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={employee.employmentStatus} variant="employment" />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions
                      canManage={canManage}
                      entityLabel="employee"
                      onView={() => setModal({ mode: "view", record: employee })}
                      onEdit={() => setModal({ mode: "edit", record: employee })}
                      onDelete={() => setDeleteTarget(employee)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredEmployees.length === 0 && <EmptyState title="No employees found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredEmployees.map((employee) => (
          <EntityCard
            key={employee.employmentId}
            icon={faUsers}
            title={`${employee.firstName} ${employee.lastName}`}
            subtitle={`${employee.jobTitle} · ${employee.farmName}`}
            badge={<StatusBadge status={employee.employmentStatus} variant="employment" />}
            canManage={canManage}
            entityLabel="employee"
            onView={() => setModal({ mode: "view", record: employee })}
            onEdit={() => setModal({ mode: "edit", record: employee })}
            onDelete={() => setDeleteTarget(employee)}
            fields={[
              { label: "Hired", value: formatDate(employee.hireDate) },
              { label: "Salary", value: `₵ ${employee.salary.toLocaleString()}` },
            ]}
          />
        ))}
        {!isLoading && filteredEmployees.length === 0 && <EmptyState title="No employees found" />}
      </div>

      <EntityFormModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit Employee" : modal?.mode === "view" ? "Employee Details" : "Add Employee"}
        fields={employeeFields}
        initialValues={
          modal?.record
            ? {
                userId: modal.record.userId,
                farmId: employments.find((e) => e.employmentId === modal.record?.employmentId)?.farmId ?? "",
                role: modal.record.jobTitle,
                salary: modal.record.salary,
                hireDate: modal.record.hireDate,
                employmentStatus: modal.record.employmentStatus,
              }
            : { userId: "", farmId: "", role: "", salary: "", hireDate: "", employmentStatus: "ACTIVE" }
        }
        onSubmit={handleSubmit}
        submitLabel={modal?.mode === "edit" ? "Save Changes" : "Add Employee"}
        readOnly={modal?.mode === "view"}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Employee"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}'s employment record? This cannot be undone.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </>
  );
}
