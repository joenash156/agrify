import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench, faTractor, faCalendarDay, faCircleCheck, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
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
import { equipmentService } from "../../services/equipmentService";
import { farmService } from "../../services/farmService";
import type { Equipment } from "../../types/equipment";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Equipment["equipmentStatus"] | "ALL"> = [
  "ALL",
  "AVAILABLE",
  "IN_USE",
  "MAINTENANCE",
  "BROKEN",
  "RETIRED",
];

export default function EquipmentPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Equipment["equipmentStatus"] | "ALL">("ALL");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([equipmentService.findAll(), farmService.findAll()])
      .then(([equipmentList, farms]) => {
        const farmNameById = new Map(farms.map((f) => [f.farmId, f.farmName]));
        setEquipment(
          equipmentList.map((item) => ({
            ...item,
            farmName: farmNameById.get(item.farmId) ?? "Unknown Farm",
          }))
        );
      })
      .catch(() => setEquipment([]))
      .finally(() => setIsLoading(false));
  }, []);

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const totalValue = equipment.reduce((sum, e) => sum + e.purchaseCost, 0);
    return [
      { id: "total", title: "Total Equipment", value: equipment.length, trend: "neutral", subtitle: "Registered assets", icon: faWrench, accentColor: "teal" },
      { id: "operational", title: "Operational", value: equipment.filter((e) => e.equipmentStatus === "AVAILABLE" || e.equipmentStatus === "IN_USE").length, trend: "neutral", subtitle: "Ready for use", icon: faCircleCheck, accentColor: "blue" },
      { id: "maintenance", title: "In Maintenance", value: equipment.filter((e) => e.equipmentStatus === "MAINTENANCE").length, trend: "neutral", subtitle: "Currently serviced", icon: faScrewdriverWrench, accentColor: "amber" },
      { id: "value", title: "Total Asset Value", value: `₵ ${totalValue.toLocaleString()}`, trend: "neutral", subtitle: "Combined purchase cost", icon: faTractor, accentColor: "purple" },
    ];
  }, [equipment]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
        item.equipmentType.toLowerCase().includes(search.toLowerCase()) ||
        item.farmName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || item.equipmentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [equipment, search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Equipment & Usage"
        subtitle="Track farm equipment, purchase records, and operational status."
        actionLabel="Add Equipment"
        showAction={canManage}
        onAction={() => alert("Equipment registration will be available once the backend is connected.")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by equipment, type, or farm..."
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
                {["Equipment", "Type", "Farm", "Purchased", "Cost", "Status"].map((col) => (
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
              {filteredEquipment.map((item) => (
                <tr
                  key={item.equipmentId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faWrench} className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${sectionTitle}`}>{item.equipmentName}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-medium ${subText}`}>{item.equipmentType}</td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                      <FontAwesomeIcon icon={faTractor} className="w-3 h-3" />
                      {item.farmName}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                      {formatDate(item.purchaseDate)}
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    ₵ {item.purchaseCost.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={item.equipmentStatus} variant="equipment" />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="equipment item" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredEquipment.length === 0 && <EmptyState title="No equipment found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredEquipment.map((item) => (
          <EntityCard
            key={item.equipmentId}
            icon={faWrench}
            title={item.equipmentName}
            subtitle={`${item.equipmentType} · ${item.farmName}`}
            badge={<StatusBadge status={item.equipmentStatus} variant="equipment" />}
            canManage={canManage}
            entityLabel="equipment item"
            fields={[
              { label: "Purchased", value: formatDate(item.purchaseDate) },
              { label: "Cost", value: `₵ ${item.purchaseCost.toLocaleString()}` },
            ]}
          />
        ))}
        {!isLoading && filteredEquipment.length === 0 && <EmptyState title="No equipment found" />}
      </div>
    </>
  );
}
