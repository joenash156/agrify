import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faCalendarDay, faUser, faCartShopping, faClock, faTriangleExclamation, faBan } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useCurrentUser } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { PageHeader } from "../../components/common/PageHeader";
import { ListToolbar } from "../../components/common/ListToolbar";
import { EntityCard } from "../../components/common/EntityCard";
import { RowActions } from "../../components/common/RowActions";
import { EmptyState } from "../../components/common/EmptyState";
import { EntityFormModal, type FieldConfig, type FieldValue } from "../../components/common/EntityFormModal";
import { formatDate } from "../../utils/formatDate";
import { canManageOwnedRecord, canCreateSales } from "../../utils/permissions";
import { saleService } from "../../services/saleService";
import { customerService, type Customer } from "../../services/customerService";
import { employeeService } from "../../services/employeeService";
import { appUserService } from "../../services/appUserService";
import type { Sale } from "../../types/sale";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Sale["saleStatus"] | "ALL"> = ["ALL", "PAID", "PARTIALLY_PAID", "UNPAID", "CANCELLED"];
const SALE_STATUS_OPTIONS = [
  { value: "PAID", label: "Paid" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "CANCELLED", label: "Cancelled" },
];
const VOID_REASON_FIELD: FieldConfig[] = [
  { name: "reason", label: "Reason for Voiding", type: "textarea", required: true, placeholder: "e.g. Customer cancelled the order" },
];

type ModalState = { mode: "create" | "edit" | "view"; record?: Sale };

export default function SalesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const currentUserName = `${currentUser.firstName} ${currentUser.lastName}`;
  const canCreate = canCreateSales(currentUser.role);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Sale["saleStatus"] | "ALL">("ALL");
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [voidTarget, setVoidTarget] = useState<Sale | null>(null);

  const loadSales = useCallback(() => {
    return Promise.all([saleService.findAll(), customerService.findAll(), employeeService.findAll(), appUserService.findAll()])
      .then(([saleList, customerList, employments, users]) => {
        setSales(saleList);
        setCustomers(customerList);
        const userById = new Map(users.map((u) => [u.userId, u]));
        setEmployeeOptions(
          employments.map((e) => {
            const user = userById.get(e.userId);
            return { value: e.employmentId, label: user ? `${user.firstName} ${user.lastName} (${e.role})` : e.role };
          })
        );
      })
      .catch(() => setSales([]));
  }, []);

  useEffect(() => {
    loadSales().finally(() => setIsLoading(false));
  }, [loadSales]);

  const saleFields: FieldConfig[] = useMemo(
    () => [
      {
        name: "customerId",
        label: "Customer",
        type: "select",
        required: true,
        options: customers.map((c) => ({ value: c.customerId, label: `${c.firstName} ${c.lastName}` })),
      },
      { name: "employmentId", label: "Sold By", type: "select", required: true, options: employeeOptions },
      { name: "total", label: "Total (₵)", type: "number", required: true, step: "0.01" },
      { name: "saleStatus", label: "Status", type: "select", required: true, options: SALE_STATUS_OPTIONS },
    ],
    [customers, employeeOptions]
  );

  const viewFields: FieldConfig[] = useMemo(() => {
    if (!modal?.record?.isVoided) return saleFields;
    return [
      ...saleFields,
      { name: "voidedReason", label: "Voided Reason", type: "textarea", disabled: true },
      { name: "voidedByName", label: "Voided By", type: "text", disabled: true },
      { name: "voidedAt", label: "Voided At", type: "text", disabled: true },
    ];
  }, [saleFields, modal]);

  const handleSubmit = async (values: Record<string, FieldValue>) => {
    const payload = {
      customerId: String(values.customerId),
      employmentId: String(values.employmentId),
      total: Number(values.total),
      saleStatus: values.saleStatus as Sale["saleStatus"],
    };
    if (modal?.mode === "edit" && modal.record) {
      await saleService.update(modal.record.saleId, payload);
      toast.success("Sale updated.");
    } else {
      await saleService.create(payload);
      toast.success("Sale created.");
    }
    await loadSales();
  };

  const handleVoidSubmit = async (values: Record<string, FieldValue>) => {
    if (!voidTarget) return;
    await saleService.voidSale(voidTarget.saleId, String(values.reason));
    toast.success("Sale voided.");
    await loadSales();
  };

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const active = sales.filter((s) => !s.isVoided);
    const now = new Date();
    const salesThisMonth = active.filter((s) => {
      const d = new Date(s.saleDate);
      return (
        (s.saleStatus === "PAID" || s.saleStatus === "PARTIALLY_PAID") &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
    return [
      { id: "sales", title: "Sales This Month", value: `₵ ${salesThisMonth.reduce((sum, s) => sum + s.total, 0).toLocaleString()}`, trend: "neutral", subtitle: `${salesThisMonth.length} completed order${salesThisMonth.length === 1 ? "" : "s"}`, icon: faReceipt, accentColor: "teal" },
      { id: "orders", title: "Total Orders", value: active.length, trend: "neutral", subtitle: "All time", icon: faCartShopping, accentColor: "blue" },
      { id: "pending", title: "Unpaid Orders", value: active.filter((s) => s.saleStatus === "UNPAID").length, trend: "neutral", subtitle: "Awaiting payment", icon: faClock, accentColor: "amber" },
      { id: "overdue", title: "Partially Paid Orders", value: active.filter((s) => s.saleStatus === "PARTIALLY_PAID").length, trend: "neutral", subtitle: "Requires follow-up", icon: faTriangleExclamation, accentColor: "rose" },
    ];
  }, [sales]);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.customerName.toLowerCase().includes(search.toLowerCase()) ||
        sale.publicId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || sale.saleStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sales, search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Sales & Orders"
        subtitle="Review customer orders, order value, and fulfillment status."
        actionLabel="New Sale"
        showAction={canCreate}
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
        searchPlaceholder="Search by customer or order ID..."
        filters={STATUS_FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Desktop table */}
      <div className={`hidden md:block rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Order", "Customer", "Sold By", "Date", "Total", "Status"].map((col) => (
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
              {filteredSales.map((sale) => {
                const canManage = canManageOwnedRecord(currentUser.role, sale.soldBy === currentUserName);
                return (
                  <tr
                    key={sale.saleId}
                    className={`transition-colors ${sale.isVoided ? "opacity-60" : ""} ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                          }`}
                        >
                          <FontAwesomeIcon icon={faReceipt} className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${sectionTitle}`}>{sale.publicId}</p>
                          <p className={`text-[11px] ${subText}`}>{sale.itemCount} item{sale.itemCount > 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>{sale.customerName}</td>
                    <td className="px-5 py-3.5">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                        <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                        {sale.soldBy}
                        {sale.soldBy === currentUserName && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                        <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                        {formatDate(sale.saleDate)}
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 text-xs font-black ${sectionTitle}`}>₵ {sale.total.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={sale.saleStatus} variant="sale" />
                        {sale.isVoided && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25">
                            Voided
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <RowActions
                        canManage={canManage}
                        entityLabel="sale"
                        onView={() => setModal({ mode: "view", record: sale })}
                        onEdit={sale.isVoided ? undefined : () => setModal({ mode: "edit", record: sale })}
                        onDelete={sale.isVoided ? undefined : () => setVoidTarget(sale)}
                        deleteLabel="Void"
                        deleteIcon={faBan}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredSales.length === 0 && <EmptyState title="No sales found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredSales.map((sale) => {
          const canManage = canManageOwnedRecord(currentUser.role, sale.soldBy === currentUserName);
          return (
            <EntityCard
              key={sale.saleId}
              icon={faReceipt}
              title={sale.customerName}
              subtitle={`${sale.publicId} · ${sale.itemCount} item${sale.itemCount > 1 ? "s" : ""}`}
              badge={
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={sale.saleStatus} variant="sale" />
                  {sale.isVoided && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25">
                      Voided
                    </span>
                  )}
                </div>
              }
              canManage={canManage}
              entityLabel="sale"
              onView={() => setModal({ mode: "view", record: sale })}
              onEdit={sale.isVoided ? undefined : () => setModal({ mode: "edit", record: sale })}
              onDelete={sale.isVoided ? undefined : () => setVoidTarget(sale)}
              deleteLabel="Void"
              deleteIcon={faBan}
              fields={[
                { label: "Date", value: formatDate(sale.saleDate) },
                { label: "Total", value: `₵ ${sale.total.toLocaleString()}` },
                { label: "Sold By", value: sale.soldBy === currentUserName ? `${sale.soldBy} (You)` : sale.soldBy },
              ]}
            />
          );
        })}
        {!isLoading && filteredSales.length === 0 && <EmptyState title="No sales found" />}
      </div>

      <EntityFormModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit Sale" : modal?.mode === "view" ? "Sale Details" : "New Sale"}
        fields={modal?.mode === "view" ? viewFields : saleFields}
        initialValues={
          modal?.record
            ? {
                customerId: modal.record.customerId,
                employmentId: modal.record.employmentId,
                total: modal.record.total,
                saleStatus: modal.record.saleStatus,
                voidedReason: modal.record.voidedReason ?? "",
                voidedByName: modal.record.voidedByName ?? "",
                voidedAt: modal.record.voidedAt ? formatDate(modal.record.voidedAt) : "",
              }
            : { customerId: "", employmentId: "", total: "", saleStatus: "UNPAID" }
        }
        onSubmit={handleSubmit}
        submitLabel={modal?.mode === "edit" ? "Save Changes" : "Create Sale"}
        readOnly={modal?.mode === "view"}
      />

      <EntityFormModal
        isOpen={voidTarget !== null}
        onClose={() => setVoidTarget(null)}
        title="Void Sale"
        subtitle={voidTarget ? `${voidTarget.publicId} · ${voidTarget.customerName}` : undefined}
        fields={VOID_REASON_FIELD}
        initialValues={{ reason: "" }}
        onSubmit={handleVoidSubmit}
        submitLabel="Void Sale"
      />
    </>
  );
}
