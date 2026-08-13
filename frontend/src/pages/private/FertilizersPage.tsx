import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { PageHeader } from "../../components/common/PageHeader";
import { ListToolbar } from "../../components/common/ListToolbar";
import { EntityCard } from "../../components/common/EntityCard";
import { RowActions } from "../../components/common/RowActions";
import { EmptyState } from "../../components/common/EmptyState";
import { canManageRecords } from "../../utils/permissions";
import { useCurrentUser } from "../../contexts/AuthContext";
import { MOCK_FERTILIZERS, FERTILIZER_STATS } from "../../data/fertilizersMockData";

const TYPE_FILTERS = ["ALL", "Compound", "Nitrogen", "Potassium", "Phosphorus", "Organic"] as const;

export default function FertilizersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<(typeof TYPE_FILTERS)[number]>("ALL");

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const typeTag = isDark
    ? "bg-zinc-800 text-zinc-300 border-zinc-700"
    : "bg-zinc-100 text-zinc-700 border-zinc-200";

  const filteredFertilizers = useMemo(() => {
    return MOCK_FERTILIZERS.filter((item) => {
      const matchesSearch = item.fertilizerName.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "ALL" || item.fertilizerType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  return (
    <>
      <PageHeader
        title="Fertilizers"
        subtitle="Manage fertilizer stock, pricing, and product types."
        actionLabel="Add Fertilizer"
        showAction={canManage}
        onAction={() => alert("Fertilizer registration will be available once the backend is connected.")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FERTILIZER_STATS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by fertilizer name..."
        filters={TYPE_FILTERS}
        activeFilter={typeFilter}
        onFilterChange={setTypeFilter}
        formatLabel={(f) => (f === "ALL" ? "All" : f)}
      />

      {/* Desktop table */}
      <div className={`hidden md:block rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Fertilizer", "Type", "Unit Price", "Quantity"].map((col) => (
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
              {filteredFertilizers.map((item) => (
                <tr
                  key={item.fertilizerId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faFlask} className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${sectionTitle}`}>{item.fertilizerName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeTag}`}>
                      {item.fertilizerType}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    ₵ {item.unitPrice.toLocaleString()}
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    {item.quantity.toLocaleString()} kg
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="fertilizer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredFertilizers.length === 0 && <EmptyState title="No fertilizers found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredFertilizers.map((item) => (
          <EntityCard
            key={item.fertilizerId}
            icon={faFlask}
            title={item.fertilizerName}
            badge={
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeTag}`}>
                {item.fertilizerType}
              </span>
            }
            canManage={canManage}
            entityLabel="fertilizer"
            fields={[
              { label: "Unit Price", value: `₵ ${item.unitPrice.toLocaleString()}` },
              { label: "Quantity", value: `${item.quantity.toLocaleString()} kg` },
            ]}
          />
        ))}
        {filteredFertilizers.length === 0 && <EmptyState title="No fertilizers found" />}
      </div>
    </>
  );
}
