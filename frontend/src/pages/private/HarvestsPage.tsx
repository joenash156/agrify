import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheatAwn, faTractor, faCalendarDay, faSeedling, faStar, faBoxesStacked } from "@fortawesome/free-solid-svg-icons";
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
import { harvestService } from "../../services/harvestService";
import { cropService } from "../../services/cropService";
import { farmService } from "../../services/farmService";
import { inventoryService } from "../../services/inventoryService";
import type { Harvest } from "../../types/harvest";
import type { StatCardData } from "../../types/dashboard";

const GRADE_FILTERS: Array<Harvest["qualityGrade"] | "ALL"> = ["ALL", "PREMIUM", "STANDARD", "SUBSTANDARD"];

export default function HarvestsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<Harvest["qualityGrade"] | "ALL">("ALL");
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [pendingStorageCount, setPendingStorageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([harvestService.findAll(), cropService.findAll(), farmService.findAll(), inventoryService.findAll()])
      .then(([harvestList, crops, farms, inventory]) => {
        const cropById = new Map(crops.map((c) => [c.cropId, c]));
        const farmNameById = new Map(farms.map((f) => [f.farmId, f.farmName]));
        setHarvests(
          harvestList.map((harvest) => {
            const crop = cropById.get(harvest.cropId);
            return {
              ...harvest,
              cropName: crop?.cropName ?? "Unknown Crop",
              farmName: (crop && farmNameById.get(crop.farmId)) ?? "Unknown Farm",
            };
          })
        );
        const storedHarvestIds = new Set(inventory.map((i) => i.harvestId));
        setPendingStorageCount(harvestList.filter((h) => !storedHarvestIds.has(h.harvestId)).length);
      })
      .catch(() => setHarvests([]))
      .finally(() => setIsLoading(false));
  }, []);

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const now = new Date();
    const thisMonth = harvests.filter((h) => {
      const d = new Date(h.harvestDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalYield = harvests.reduce((sum, h) => sum + h.quantity, 0);
    return [
      { id: "total-harvests", title: "Harvests This Month", value: thisMonth.length, trend: "neutral", subtitle: `${thisMonth.reduce((s, h) => s + h.quantity, 0).toLocaleString()} kg total yield`, icon: faWheatAwn, accentColor: "orange" },
      { id: "total-yield", title: "Total Yield (YTD)", value: `${totalYield.toLocaleString()} kg`, trend: "neutral", subtitle: "Across all farms", icon: faSeedling, accentColor: "teal" },
      { id: "premium", title: "Premium Grade", value: harvests.filter((h) => h.qualityGrade === "PREMIUM").length, trend: "neutral", subtitle: "Top quality harvests", icon: faStar, accentColor: "purple" },
      { id: "pending", title: "Pending Storage", value: pendingStorageCount, trend: "neutral", subtitle: "Not yet in inventory", icon: faBoxesStacked, accentColor: "blue" },
    ];
  }, [harvests, pendingStorageCount]);

  const filteredHarvests = useMemo(() => {
    return harvests.filter((harvest) => {
      const matchesSearch =
        harvest.cropName.toLowerCase().includes(search.toLowerCase()) ||
        harvest.farmName.toLowerCase().includes(search.toLowerCase());
      const matchesGrade = gradeFilter === "ALL" || harvest.qualityGrade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [harvests, search, gradeFilter]);

  return (
    <>
      <PageHeader
        title="Harvest Records"
        subtitle="Log and review harvest yields and quality across all crops."
        actionLabel="Log Harvest"
        showAction={canManage}
        onAction={() => alert("Logging a harvest will be available once the backend is connected.")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by crop or farm..."
        filters={GRADE_FILTERS}
        activeFilter={gradeFilter}
        onFilterChange={setGradeFilter}
      />

      {/* Desktop table */}
      <div className={`hidden md:block rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Crop", "Farm", "Harvested", "Quantity", "Grade"].map((col) => (
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
              {filteredHarvests.map((harvest) => (
                <tr
                  key={harvest.harvestId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faWheatAwn} className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${sectionTitle}`}>{harvest.cropName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                      <FontAwesomeIcon icon={faTractor} className="w-3 h-3" />
                      {harvest.farmName}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                      {formatDate(harvest.harvestDate)}
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    {harvest.quantity} {harvest.unit}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={harvest.qualityGrade} variant="grade" />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="harvest record" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredHarvests.length === 0 && <EmptyState title="No harvest records found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredHarvests.map((harvest) => (
          <EntityCard
            key={harvest.harvestId}
            icon={faWheatAwn}
            title={harvest.cropName}
            subtitle={harvest.farmName}
            badge={<StatusBadge status={harvest.qualityGrade} variant="grade" />}
            canManage={canManage}
            entityLabel="harvest record"
            fields={[
              { label: "Harvested", value: formatDate(harvest.harvestDate) },
              { label: "Quantity", value: `${harvest.quantity} ${harvest.unit}` },
            ]}
          />
        ))}
        {!isLoading && filteredHarvests.length === 0 && <EmptyState title="No harvest records found" />}
      </div>
    </>
  );
}
