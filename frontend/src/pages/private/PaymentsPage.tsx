import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCalendarDay, faReceipt, faTriangleExclamation, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
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
import { paymentService } from "../../services/paymentService";
import { saleService } from "../../services/saleService";
import type { Payment } from "../../types/payment";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Payment["paymentStatus"] | "ALL"> = ["ALL", "CONFIRMED", "PENDING", "FAILED", "REFUNDED"];

export default function PaymentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Payment["paymentStatus"] | "ALL">("ALL");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([paymentService.findAll(), saleService.findAll()])
      .then(([paymentList, sales]) => {
        const customerNameBySaleId = new Map(sales.map((s) => [s.saleId, s.customerName]));
        setPayments(
          paymentList.map((payment) => ({
            ...payment,
            customerName: customerNameBySaleId.get(payment.saleId) ?? "Walk-in Customer",
          }))
        );
      })
      .catch(() => setPayments([]))
      .finally(() => setIsLoading(false));
  }, []);

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const now = new Date();
    const collectedThisMonth = payments
      .filter((p) => {
        const d = new Date(p.paymentDate);
        return p.paymentStatus === "CONFIRMED" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = payments.filter((p) => p.paymentStatus === "PENDING");
    return [
      { id: "collected", title: "Collected This Month", value: `₵ ${collectedThisMonth.toLocaleString()}`, trend: "neutral", subtitle: "Across all methods", icon: faCreditCard, accentColor: "teal" },
      { id: "outstanding", title: "Outstanding Payments", value: `₵ ${pending.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`, trend: "neutral", subtitle: `${pending.length} pending settlement${pending.length === 1 ? "" : "s"}`, icon: faReceipt, accentColor: "rose" },
      { id: "failed", title: "Failed Payments", value: payments.filter((p) => p.paymentStatus === "FAILED").length, trend: "neutral", subtitle: "Needs retry or follow-up", icon: faTriangleExclamation, accentColor: "amber" },
      { id: "refunded", title: "Refunded", value: payments.filter((p) => p.paymentStatus === "REFUNDED").length, trend: "neutral", subtitle: "All time", icon: faRotateLeft, accentColor: "blue" },
    ];
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.customerName.toLowerCase().includes(search.toLowerCase()) ||
        payment.saleId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || payment.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Payments & Ledger"
        subtitle="Track payment collections, methods, and settlement status."
        actionLabel="Record Payment"
        showAction={canManage}
        onAction={() => alert("Recording a payment will be available once the backend is connected.")}
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
                {["Payment", "Customer", "Method", "Date", "Amount", "Status"].map((col) => (
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
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.paymentId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faCreditCard} className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${sectionTitle}`}>{payment.paymentId}</p>
                        <p className={`text-[11px] ${subText}`}>{payment.saleId}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>{payment.customerName}</td>
                  <td className={`px-5 py-3.5 text-xs font-medium ${subText}`}>{payment.paymentMethod}</td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                      {formatDate(payment.paymentDate)}
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-black ${sectionTitle}`}>₵ {payment.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={payment.paymentStatus} variant="payment" />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="payment" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredPayments.length === 0 && <EmptyState title="No payments found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredPayments.map((payment) => (
          <EntityCard
            key={payment.paymentId}
            icon={faCreditCard}
            title={payment.customerName}
            subtitle={`${payment.paymentId} · ${payment.saleId}`}
            badge={<StatusBadge status={payment.paymentStatus} variant="payment" />}
            canManage={canManage}
            entityLabel="payment"
            fields={[
              { label: "Date", value: formatDate(payment.paymentDate) },
              { label: "Amount", value: `₵ ${payment.amount.toLocaleString()}` },
              { label: "Method", value: payment.paymentMethod },
            ]}
          />
        ))}
        {!isLoading && filteredPayments.length === 0 && <EmptyState title="No payments found" />}
      </div>
    </>
  );
}
