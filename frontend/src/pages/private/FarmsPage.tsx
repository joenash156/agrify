import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUsers, faSeedling, faTractor } from "@fortawesome/free-solid-svg-icons";
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
import { MOCK_FARMS, FARM_STATS } from "../../data/farmsMockData";
import type { Farm } from "../../types/farm";

const STATUS_FILTERS: Array<Farm["farmStatus"] | "ALL"> = [
  "ALL",
  "ACTIVE",
  "SEASONAL",
  "INACTIVE",
  "FALLOW",
];

export default function FarmsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Farm["farmStatus"] | "ALL">("ALL");

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const filteredFarms = useMemo(() => {
    return MOCK_FARMS.filter((farm) => {
      const matchesSearch =
        farm.farmName.toLowerCase().includes(search.toLowerCase()) ||
        farm.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || farm.farmStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Farms"
        subtitle="Manage your registered farms and their operational status."
        actionLabel="Add Farm"
        showAction={canManage}
        onAction={() => alert("Farm creation will be available once the backend is connected.")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FARM_STATS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by farm name or location..."
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
                {["Farm", "Location", "Size", "Status", "Employees", "Crops", "Updated"].map((col) => (
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
              {filteredFarms.map((farm) => (
                <tr
                  key={farm.farmId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faTractor} className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${sectionTitle}`}>{farm.farmName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                      <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3" />
                      {farm.location}
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    {farm.size} ha
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={farm.farmStatus} variant="farm" />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faUsers} className={`w-3 h-3 ${subText}`} />
                      {farm.employeeCount ?? 0}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faSeedling} className={`w-3 h-3 ${subText}`} />
                      {farm.cropCount ?? 0}
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-medium ${subText}`}>
                    {formatDate(farm.updatedAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="farm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredFarms.length === 0 && <EmptyState title="No farms found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredFarms.map((farm) => (
          <EntityCard
            key={farm.farmId}
            icon={faTractor}
            title={farm.farmName}
            subtitle={farm.location}
            badge={<StatusBadge status={farm.farmStatus} variant="farm" />}
            canManage={canManage}
            entityLabel="farm"
            fields={[
              { label: "Size", value: `${farm.size} ha` },
              { label: "Employees", value: farm.employeeCount ?? 0 },
              { label: "Crops", value: farm.cropCount ?? 0 },
              { label: "Updated", value: formatDate(farm.updatedAt) },
            ]}
          />
        ))}
        {filteredFarms.length === 0 && <EmptyState title="No farms found" />}
      </div>
    </>
  );
}
