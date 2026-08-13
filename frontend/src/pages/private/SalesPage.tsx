import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faCalendarDay, faUser, faCartShopping, faClock, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useCurrentUser } from "../../contexts/AuthContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { PageHeader } from "../../components/common/PageHeader";
import { ListToolbar } from "../../components/common/ListToolbar";
import { EntityCard } from "../../components/common/EntityCard";
import { RowActions } from "../../components/common/RowActions";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate } from "../../utils/formatDate";
import { canManageOwnedRecord, canCreateSales } from "../../utils/permissions";
import { saleService } from "../../services/saleService";
import type { Sale } from "../../types/sale";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Sale["saleStatus"] | "ALL"> = ["ALL", "PAID", "PARTIALLY_PAID", "UNPAID", "CANCELLED"];

export default function SalesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const currentUserName = `${currentUser.firstName} ${currentUser.lastName}`;
  const canCreate = canCreateSales(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Sale["saleStatus"] | "ALL">("ALL");
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    saleService
      .findAll()
      .then(setSales)
      .catch(() => setSales([]))
      .finally(() => setIsLoading(false));
  }, []);

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const now = new Date();
    const salesThisMonth = sales.filter((s) => {
      const d = new Date(s.saleDate);
      return (
        (s.saleStatus === "PAID" || s.saleStatus === "PARTIALLY_PAID") &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
    return [
      { id: "sales", title: "Sales This Month", value: `₵ ${salesThisMonth.reduce((sum, s) => sum + s.total, 0).toLocaleString()}`, trend: "neutral", subtitle: `${salesThisMonth.length} completed order${salesThisMonth.length === 1 ? "" : "s"}`, icon: faReceipt, accentColor: "teal" },
      { id: "orders", title: "Total Orders", value: sales.length, trend: "neutral", subtitle: "All time", icon: faCartShopping, accentColor: "blue" },
      { id: "pending", title: "Unpaid Orders", value: sales.filter((s) => s.saleStatus === "UNPAID").length, trend: "neutral", subtitle: "Awaiting payment", icon: faClock, accentColor: "amber" },
      { id: "overdue", title: "Partially Paid Orders", value: sales.filter((s) => s.saleStatus === "PARTIALLY_PAID").length, trend: "neutral", subtitle: "Requires follow-up", icon: faTriangleExclamation, accentColor: "rose" },
    ];
  }, [sales]);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.customerName.toLowerCase().includes(search.toLowerCase()) ||
        sale.saleId.toLowerCase().includes(search.toLowerCase());
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
        onAction={() => alert("Creating a sale will be available once the backend is connected.")}
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
              {filteredSales.map((sale) => (
                <tr
                  key={sale.saleId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
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
                        <p className={`text-xs font-bold ${sectionTitle}`}>{sale.saleId}</p>
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
                    <StatusBadge status={sale.saleStatus} variant="sale" />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions
                      canManage={canManageOwnedRecord(currentUser.role, sale.soldBy === currentUserName)}
                      entityLabel="sale"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredSales.length === 0 && <EmptyState title="No sales found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredSales.map((sale) => (
          <EntityCard
            key={sale.saleId}
            icon={faReceipt}
            title={sale.customerName}
            subtitle={`${sale.saleId} · ${sale.itemCount} item${sale.itemCount > 1 ? "s" : ""}`}
            badge={<StatusBadge status={sale.saleStatus} variant="sale" />}
            canManage={canManageOwnedRecord(currentUser.role, sale.soldBy === currentUserName)}
            entityLabel="sale"
            fields={[
              { label: "Date", value: formatDate(sale.saleDate) },
              { label: "Total", value: `₵ ${sale.total.toLocaleString()}` },
              { label: "Sold By", value: sale.soldBy === currentUserName ? `${sale.soldBy} (You)` : sale.soldBy },
            ]}
          />
        ))}
        {!isLoading && filteredSales.length === 0 && <EmptyState title="No sales found" />}
      </div>
    </>
  );
}
