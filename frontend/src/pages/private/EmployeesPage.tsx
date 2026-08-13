import { useEffect, useMemo, useState } from "react";
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
import { formatDate } from "../../utils/formatDate";
import { canManageRecords } from "../../utils/permissions";
import { useCurrentUser } from "../../contexts/AuthContext";
import { employeeService } from "../../services/employeeService";
import { appUserService } from "../../services/appUserService";
import { farmService } from "../../services/farmService";
import type { Employee } from "../../types/employee";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Employee["employmentStatus"] | "ALL"> = [
  "ALL",
  "ACTIVE",
  "ON_LEAVE",
  "SUSPENDED",
  "TERMINATED",
];

export default function EmployeesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Employee["employmentStatus"] | "ALL">("ALL");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([employeeService.findAll(), appUserService.findAll(), farmService.findAll()])
      .then(([employments, users, farms]) => {
        const userById = new Map(users.map((u) => [u.userId, u]));
        const farmNameById = new Map(farms.map((f) => [f.farmId, f.farmName]));
        setEmployees(
          employments.map((employment) => {
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
      .catch(() => setEmployees([]))
      .finally(() => setIsLoading(false));
  }, []);

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
        onAction={() => alert("Adding an employee will be available once the backend is connected.")}
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
                    <RowActions canManage={canManage} entityLabel="employee" />
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
            fields={[
              { label: "Hired", value: formatDate(employee.hireDate) },
              { label: "Salary", value: `₵ ${employee.salary.toLocaleString()}` },
            ]}
          />
        ))}
        {!isLoading && filteredEmployees.length === 0 && <EmptyState title="No employees found" />}
      </div>
    </>
  );
}
