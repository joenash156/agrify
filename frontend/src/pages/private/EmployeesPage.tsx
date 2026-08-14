import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTractor, faCalendarDay, faCircleCheck, faClock, faCreditCard, faUserCheck } from "@fortawesome/free-solid-svg-icons";
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
import { employeeService } from "../../services/employeeService";
import { appUserService, type AppUser } from "../../services/appUserService";
import { farmService } from "../../services/farmService";
import { accountService, type AccountResponse } from "../../services/accountService";
import type { Farm } from "../../types/farm";
import type { Employee } from "../../types/employee";
import type { StatCardData } from "../../types/dashboard";

const ACCOUNT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

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

const ROLE_OPTIONS = [
  { value: "WORKER", label: "Worker" },
  { value: "SALES_PERSON", label: "Sales Person" },
  { value: "FARM_MANAGER", label: "Farm Manager" },
];

function formatRole(role: string): string {
  return ROLE_OPTIONS.find((r) => r.value === role)?.label ?? role;
}

/** A row in the Employees table. Sourced from every registered person (app_user — the backend
 * already excludes ADMIN there), so a freshly self-registered account shows up immediately even
 * before any employment record exists — employmentId is null until an admin activates it, at
 * which point the employment-specific fields populate. accountStatus ("Account Access") only
 * populates for ADMIN viewers, since /api/accounts is admin-only; workingStatus ("Status") comes
 * straight off app_user and is kept in sync with the employment record by the backend, so it's
 * visible to everyone with page access. */
interface EmployeeRow {
  employmentId: string | null;
  accountId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmName: string | null;
  jobTitle: string | null;
  salary: number | null;
  hireDate: string | null;
  workingStatus: AppUser["workingStatus"];
  accountStatus: AccountResponse["accountStatus"] | null;
}

type ModalState = { mode: "edit" | "view"; record: EmployeeRow };

export default function EmployeesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const isAdmin = currentUser.role === "ADMIN";
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Employee["employmentStatus"] | "ALL">("ALL");
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [employments, setEmployments] = useState<{ employmentId: string; userId: string; farmId: string }[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeRow | null>(null);
  const [onboarding, setOnboarding] = useState<AccountResponse | null>(null);
  const [confirmOnboard, setConfirmOnboard] = useState<{
    account: AccountResponse;
    farmId: string;
    role: string;
    salary: number;
    hireDate: string;
  } | null>(null);

  const loadEmployees = useCallback(() => {
    return Promise.all([
      employeeService.findAll(),
      appUserService.findAll(),
      farmService.findAll(),
      isAdmin ? accountService.findAll() : Promise.resolve<AccountResponse[]>([]),
    ])
      .then(([employmentList, userList, farmList, accountList]) => {
        setEmployments(employmentList);
        setFarms(farmList);
        setAccounts(accountList);

        const farmNameById = new Map(farmList.map((f) => [f.farmId, f.farmName]));
        const employmentByUserId = new Map(employmentList.map((e) => [e.userId, e]));
        const accountByUserIdLocal = new Map(accountList.map((a) => [a.userId, a]));

        setEmployees(
          userList.map((user) => {
            const employment = employmentByUserId.get(user.userId);
            const account = accountByUserIdLocal.get(user.userId);
            return {
              employmentId: employment?.employmentId ?? null,
              accountId: account?.accountId ?? "",
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              farmName: employment ? farmNameById.get(employment.farmId) ?? "Unknown Farm" : null,
              jobTitle: employment?.role ?? null,
              salary: employment?.salary ?? null,
              hireDate: employment?.hireDate ?? null,
              workingStatus: user.workingStatus,
              accountStatus: account?.accountStatus ?? null,
            };
          })
        );
      })
      .catch(() => setEmployees([]));
  }, [isAdmin]);

  useEffect(() => {
    loadEmployees().finally(() => setIsLoading(false));
  }, [loadEmployees]);

  const canChangeRole = currentUser.role === "ADMIN";

  const accountByUserId = useMemo(() => new Map(accounts.map((a) => [a.userId, a])), [accounts]);

  const employeeFields: FieldConfig[] = useMemo(() => {
    const farmField: FieldConfig = {
      name: "farmId",
      label: "Farm",
      type: "select",
      required: true,
      options: farms.map((f) => ({ value: f.farmId, label: f.farmName })),
    };
    const salaryHireStatus: FieldConfig[] = [
      { name: "salary", label: "Salary (₵)", type: "number", required: true, step: "0.01" },
      { name: "hireDate", label: "Hire Date", type: "date", required: true },
      { name: "employmentStatus", label: "Status", type: "select", required: true, options: EMPLOYMENT_STATUS_OPTIONS },
    ];

    if (modal?.mode === "edit") {
      return [
        { name: "firstName", label: "First Name", type: "text", disabled: true },
        { name: "lastName", label: "Last Name", type: "text", disabled: true },
        { name: "email", label: "Email", type: "text", disabled: true },
        farmField,
        ...(canChangeRole
          ? [
              { name: "role", label: "Change Role", type: "select" as const, required: true, options: ROLE_OPTIONS },
              { name: "accountStatus", label: "Account Access", type: "select" as const, required: true, options: ACCOUNT_STATUS_OPTIONS },
            ]
          : []),
        ...salaryHireStatus,
      ];
    }

    // view
    return [
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "phoneNumber", label: "Phone Number", type: "text" },
      farmField,
      { name: "role", label: "Role", type: "select", options: ROLE_OPTIONS },
      ...salaryHireStatus,
    ];
  }, [farms, modal?.mode, canChangeRole]);

  const onboardFields: FieldConfig[] = useMemo(
    () => [
      {
        name: "farmId",
        label: "Farm",
        type: "select",
        required: true,
        options: farms.map((f) => ({ value: f.farmId, label: f.farmName })),
      },
      { name: "role", label: "Role", type: "select", required: true, options: ROLE_OPTIONS },
      { name: "salary", label: "Salary (₵)", type: "number", required: true, step: "0.01" },
      { name: "hireDate", label: "Hire Date", type: "date", required: true },
    ],
    [farms]
  );

  const handleSubmit = async (values: Record<string, FieldValue>) => {
    if (!modal?.record || !modal.record.employmentId) return;
    const role = canChangeRole && values.role ? String(values.role) : modal.record.jobTitle ?? "WORKER";
    const payload = {
      userId: modal.record.userId,
      farmId: String(values.farmId),
      role,
      salary: Number(values.salary),
      hireDate: String(values.hireDate),
      employmentStatus: values.employmentStatus as Employee["employmentStatus"],
    };
    await employeeService.update(modal.record.employmentId, payload);

    if (canChangeRole) {
      const account = accountByUserId.get(modal.record.userId);
      if (account) {
        await accountService.update(account.accountId, {
          accountStatus: String(values.accountStatus) as AccountResponse["accountStatus"],
          role: role as AccountResponse["role"],
        });
      }
    }
    toast.success("Employee updated.");
    await loadEmployees();
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget.employmentId) return;
    await employeeService.remove(deleteTarget.employmentId);
    toast.success("Employee removed.");
    await loadEmployees();
  };

  const handleOnboardSubmit = async (values: Record<string, FieldValue>) => {
    if (!onboarding) return;
    setConfirmOnboard({
      account: onboarding,
      farmId: String(values.farmId),
      role: String(values.role),
      salary: Number(values.salary),
      hireDate: String(values.hireDate),
    });
  };

  const handleConfirmOnboard = async () => {
    if (!confirmOnboard) return;
    const { account, farmId, role, salary, hireDate } = confirmOnboard;
    // Employment first, then the account flips ACTIVE — if employment creation fails, the
    // account stays exactly as it was (retryable) instead of landing in a half-activated state
    // where the account can sign in but has no employment record to work with.
    await employeeService.create({
      userId: account.userId,
      farmId,
      role,
      salary,
      hireDate,
      employmentStatus: "ACTIVE",
    });
    await accountService.update(account.accountId, { accountStatus: "ACTIVE", role: role as AccountResponse["role"] });
    toast.success("Account activated.");
    await loadEmployees();
  };

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const realEmployees = employees.filter((e) => e.workingStatus !== null);
    const active = realEmployees.filter((e) => e.workingStatus === "ACTIVE");
    const payroll = active.reduce((sum, e) => sum + (e.salary ?? 0), 0);
    return [
      { id: "total", title: "Total Employees", value: realEmployees.length, trend: "neutral", subtitle: "Across all farms", icon: faUsers, accentColor: "blue" },
      { id: "active", title: "Active Employees", value: active.length, trend: "neutral", subtitle: "Currently employed", icon: faCircleCheck, accentColor: "teal" },
      { id: "on-leave", title: "On Leave", value: realEmployees.filter((e) => e.workingStatus === "ON_LEAVE").length, trend: "neutral", subtitle: "Temporarily away", icon: faClock, accentColor: "amber" },
      { id: "payroll", title: "Monthly Payroll", value: `₵ ${payroll.toLocaleString()}`, trend: "neutral", subtitle: "Combined active salaries", icon: faCreditCard, accentColor: "purple" },
    ];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        (employee.jobTitle ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (employee.farmName ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || employee.workingStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  return (
    <>
      <PageHeader title="Employees" subtitle="Manage farm staff, roles, and employment status." />

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
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Employee", "Farm", "Hired", "Account Access", "Salary", "Status"].map((col) => (
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
                  key={employee.userId}
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
                        <p className={`text-[11px] ${subText}`}>
                          {employee.jobTitle ? formatRole(employee.jobTitle) : "Pending activation"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                      <FontAwesomeIcon icon={faTractor} className="w-3 h-3" />
                      {employee.farmName ?? "—"}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                      {employee.hireDate ? formatDate(employee.hireDate) : "—"}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {employee.accountStatus ? (
                      <StatusBadge status={employee.accountStatus} variant="account" />
                    ) : (
                      <span className={`text-xs ${subText}`}>—</span>
                    )}
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    {employee.salary !== null ? `₵ ${employee.salary.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {employee.workingStatus ? (
                      <StatusBadge status={employee.workingStatus} variant="employment" />
                    ) : (
                      <span className={`text-xs ${subText}`}>—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {employee.employmentId ? (
                      <RowActions
                        canManage={canManage}
                        entityLabel="employee"
                        onView={() => setModal({ mode: "view", record: employee })}
                        onEdit={() => setModal({ mode: "edit", record: employee })}
                        onDelete={() => setDeleteTarget(employee)}
                      />
                    ) : (
                      isAdmin && (
                        <RowActions
                          canManage={canManage}
                          entityLabel="account"
                          onEdit={() => {
                            const account = accountByUserId.get(employee.userId);
                            if (account) setOnboarding(account);
                          }}
                          editLabel="Activate"
                          editIcon={faUserCheck}
                        />
                      )
                    )}
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
        {filteredEmployees.map((employee) =>
          employee.employmentId ? (
            <EntityCard
              key={employee.employmentId}
              icon={faUsers}
              title={`${employee.firstName} ${employee.lastName}`}
              subtitle={`${formatRole(employee.jobTitle ?? "")} · ${employee.farmName ?? "—"}`}
              badge={<StatusBadge status={employee.workingStatus ?? "ACTIVE"} variant="employment" />}
              canManage={canManage}
              entityLabel="employee"
              onView={() => setModal({ mode: "view", record: employee })}
              onEdit={() => setModal({ mode: "edit", record: employee })}
              onDelete={() => setDeleteTarget(employee)}
              fields={[
                { label: "Hired", value: formatDate(employee.hireDate ?? "") },
                { label: "Account Access", value: <StatusBadge status={employee.accountStatus ?? "ACTIVE"} variant="account" /> },
                { label: "Salary", value: `₵ ${(employee.salary ?? 0).toLocaleString()}` },
              ]}
            />
          ) : (
            <EntityCard
              key={employee.userId}
              icon={faUsers}
              title={`${employee.firstName} ${employee.lastName}`}
              subtitle="Pending activation"
              badge={<StatusBadge status={employee.accountStatus ?? "INACTIVE"} variant="account" />}
              canManage={canManage && isAdmin}
              entityLabel="account"
              onEdit={
                isAdmin
                  ? () => {
                      const account = accountByUserId.get(employee.userId);
                      if (account) setOnboarding(account);
                    }
                  : undefined
              }
              editLabel="Activate"
              editIcon={faUserCheck}
              fields={[
                { label: "Email", value: employee.email },
                { label: "Phone", value: employee.phoneNumber },
              ]}
            />
          )
        )}
        {!isLoading && filteredEmployees.length === 0 && <EmptyState title="No employees found" />}
      </div>

      <EntityFormModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit Employee" : "Employee Details"}
        fields={employeeFields}
        initialValues={
          modal?.record
            ? {
                firstName: modal.record.firstName,
                lastName: modal.record.lastName,
                email: modal.record.email,
                phoneNumber: modal.record.phoneNumber,
                farmId: employments.find((e) => e.employmentId === modal.record?.employmentId)?.farmId ?? "",
                role: modal.record.jobTitle ?? "WORKER",
                accountStatus: accountByUserId.get(modal.record.userId)?.accountStatus ?? "ACTIVE",
                salary: modal.record.salary ?? 0,
                hireDate: modal.record.hireDate ?? "",
                employmentStatus: modal.record.workingStatus ?? "ACTIVE",
              }
            : { firstName: "", lastName: "", email: "", phoneNumber: "", farmId: "", role: "WORKER", accountStatus: "ACTIVE", salary: 0, hireDate: "", employmentStatus: "ACTIVE" }
        }
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
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

      <EntityFormModal
        isOpen={onboarding !== null}
        onClose={() => setOnboarding(null)}
        title="Activate Account"
        subtitle={onboarding ? `@${onboarding.username}` : undefined}
        fields={onboardFields}
        initialValues={{ farmId: "", role: "WORKER", salary: "", hireDate: "" }}
        onSubmit={handleOnboardSubmit}
        submitLabel="Continue"
      />

      <ConfirmDialog
        isOpen={confirmOnboard !== null}
        onClose={() => setConfirmOnboard(null)}
        title="Confirm Activation"
        danger={false}
        confirmLabel="Activate"
        message={
          confirmOnboard
            ? `Activate this account as ${formatRole(confirmOnboard.role)} at ${
                farms.find((f) => f.farmId === confirmOnboard.farmId)?.farmName ?? "the selected farm"
              }? They'll be able to sign in and start working immediately.`
            : ""
        }
        onConfirm={handleConfirmOnboard}
      />
    </>
  );
}
