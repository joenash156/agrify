import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faTractor, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
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
import { MOCK_CROPS, CROP_STATS } from "../../data/cropsMockData";
import type { Crop } from "../../types/crop";

const STATUS_FILTERS: Array<Crop["cropStatus"] | "ALL"> = [
  "ALL",
  "GROWING",
  "READY",
  "HARVESTED",
  "DISEASED",
  "DORMANT",
];

export default function CropsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canManage = canManageRecords(MOCK_USER.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Crop["cropStatus"] | "ALL">("ALL");

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const filteredCrops = useMemo(() => {
    return MOCK_CROPS.filter((crop) => {
      const matchesSearch =
        crop.cropName.toLowerCase().includes(search.toLowerCase()) ||
        crop.cropVariety.toLowerCase().includes(search.toLowerCase()) ||
        crop.farmName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || crop.cropStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Crops & Cultivation"
        subtitle="Track planting, growth stages, and harvest schedules across all farms."
        actionLabel="Add Crop"
        showAction={canManage}
        onAction={() => alert("Crop creation will be available once the backend is connected.")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CROP_STATS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by crop, variety, or farm..."
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
                {["Crop", "Farm", "Planted", "Expected Harvest", "Status"].map((col) => (
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
              {filteredCrops.map((crop) => (
                <tr
                  key={crop.cropId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faSeedling} className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${sectionTitle}`}>{crop.cropName}</p>
                        <p className={`text-[11px] ${subText}`}>{crop.cropVariety}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                      <FontAwesomeIcon icon={faTractor} className="w-3 h-3" />
                      {crop.farmName}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                      {formatDate(crop.plantingDate)}
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    {formatDate(crop.expectedHarvestDate)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={crop.cropStatus} variant="crop" />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="crop" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCrops.length === 0 && <EmptyState title="No crops found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredCrops.map((crop) => (
          <EntityCard
            key={crop.cropId}
            icon={faSeedling}
            title={crop.cropName}
            subtitle={`${crop.cropVariety} · ${crop.farmName}`}
            badge={<StatusBadge status={crop.cropStatus} variant="crop" />}
            canManage={canManage}
            entityLabel="crop"
            fields={[
              { label: "Planted", value: formatDate(crop.plantingDate) },
              { label: "Expected Harvest", value: formatDate(crop.expectedHarvestDate) },
            ]}
          />
        ))}
        {filteredCrops.length === 0 && <EmptyState title="No crops found" />}
      </div>
    </>
  );
}
