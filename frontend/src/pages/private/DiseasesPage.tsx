import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faTractor, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
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
import { MOCK_CROP_DISEASES, DISEASE_STATS } from "../../data/diseasesMockData";
import type { DiseaseSeverity } from "../../types/disease";

const SEVERITY_FILTERS: Array<DiseaseSeverity | "ALL"> = ["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function DiseasesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canManage = canManageRecords(MOCK_USER.role);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<DiseaseSeverity | "ALL">("ALL");

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const filteredRecords = useMemo(() => {
    return MOCK_CROP_DISEASES.filter((record) => {
      const matchesSearch =
        record.cropName.toLowerCase().includes(search.toLowerCase()) ||
        record.diseaseName.toLowerCase().includes(search.toLowerCase()) ||
        record.farmName.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === "ALL" || record.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [search, severityFilter]);

  return (
    <>
      <PageHeader
        title="Crop Diseases"
        subtitle="Monitor disease incidents, severity, and treatment progress across crops."
        actionLabel="Log Disease Case"
        showAction={canManage}
        onAction={() => alert("Logging a disease case will be available once the backend is connected.")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DISEASE_STATS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by crop, disease, or farm..."
        filters={SEVERITY_FILTERS}
        activeFilter={severityFilter}
        onFilterChange={setSeverityFilter}
      />

      {/* Desktop table */}
      <div className={`hidden md:block rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Crop", "Disease", "Farm", "Detected", "Severity", "Treatment"].map((col) => (
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
              {filteredRecords.map((record) => (
                <tr
                  key={record.cropDiseaseId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faBug} className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${sectionTitle}`}>{record.cropName}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>{record.diseaseName}</td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                      <FontAwesomeIcon icon={faTractor} className="w-3 h-3" />
                      {record.farmName}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${sectionTitle}`}>
                      <FontAwesomeIcon icon={faCalendarDay} className={`w-3 h-3 ${subText}`} />
                      {formatDate(record.detectedDate)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={record.severity} variant="severity" />
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-medium max-w-[220px] truncate ${subText}`}>
                    {record.treatment}
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="disease record" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length === 0 && <EmptyState title="No disease records found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredRecords.map((record) => (
          <EntityCard
            key={record.cropDiseaseId}
            icon={faBug}
            title={record.diseaseName}
            subtitle={`${record.cropName} · ${record.farmName}`}
            badge={<StatusBadge status={record.severity} variant="severity" />}
            canManage={canManage}
            entityLabel="disease record"
            fields={[
              { label: "Detected", value: formatDate(record.detectedDate) },
              { label: "Treatment", value: record.treatment },
            ]}
          />
        ))}
        {filteredRecords.length === 0 && <EmptyState title="No disease records found" />}
      </div>
    </>
  );
}
