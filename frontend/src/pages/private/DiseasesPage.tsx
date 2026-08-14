import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faTractor, faCalendarDay, faTriangleExclamation, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
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
import { cropDiseaseService } from "../../services/cropDiseaseService";
import { diseaseCatalogService, type DiseaseCatalogEntry } from "../../services/diseaseCatalogService";
import { cropService } from "../../services/cropService";
import { farmService } from "../../services/farmService";
import type { Crop } from "../../types/crop";
import type { CropDiseaseRecord, DiseaseSeverity } from "../../types/disease";
import type { StatCardData } from "../../types/dashboard";

const SEVERITY_FILTERS: Array<DiseaseSeverity | "ALL"> = ["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"];
const SEVERITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

type ModalState = { mode: "create" | "view"; record?: CropDiseaseRecord };

export default function DiseasesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<DiseaseSeverity | "ALL">("ALL");
  const [records, setRecords] = useState<CropDiseaseRecord[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [diseases, setDiseases] = useState<DiseaseCatalogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CropDiseaseRecord | null>(null);

  const loadRecords = useCallback(() => {
    return Promise.all([
      cropDiseaseService.findAll(),
      diseaseCatalogService.findAll(),
      cropService.findAll(),
      farmService.findAll(),
    ])
      .then(([incidents, diseaseList, cropList, farms]) => {
        setCrops(cropList);
        setDiseases(diseaseList);
        const diseaseNameById = new Map(diseaseList.map((d) => [d.diseaseId, d.diseaseName]));
        const cropById = new Map(cropList.map((c) => [c.cropId, c]));
        const farmNameById = new Map(farms.map((f) => [f.farmId, f.farmName]));
        setRecords(
          incidents.map((record) => {
            const crop = cropById.get(record.cropId);
            return {
              ...record,
              cropName: crop?.cropName ?? "Unknown Crop",
              farmName: (crop && farmNameById.get(crop.farmId)) ?? "Unknown Farm",
              diseaseName: diseaseNameById.get(record.diseaseId) ?? "Unknown Disease",
            };
          })
        );
      })
      .catch(() => setRecords([]));
  }, []);

  useEffect(() => {
    loadRecords().finally(() => setIsLoading(false));
  }, [loadRecords]);

  const recordFields: FieldConfig[] = useMemo(
    () => [
      {
        name: "cropId",
        label: "Crop",
        type: "select",
        required: true,
        options: crops.map((c) => ({ value: c.cropId, label: `${c.cropName} (${c.cropVariety})` })),
      },
      {
        name: "diseaseId",
        label: "Disease",
        type: "select",
        required: true,
        options: diseases.map((d) => ({ value: d.diseaseId, label: d.diseaseName })),
      },
      { name: "detectedDate", label: "Detected Date", type: "date", required: true },
      { name: "severity", label: "Severity", type: "select", required: true, options: SEVERITY_OPTIONS },
      { name: "treatment", label: "Treatment", type: "textarea", required: true, placeholder: "e.g. Fungicide application" },
    ],
    [crops, diseases]
  );

  const handleSubmit = async (values: Record<string, FieldValue>) => {
    await cropDiseaseService.create({
      cropId: String(values.cropId),
      diseaseId: String(values.diseaseId),
      detectedDate: String(values.detectedDate),
      severity: values.severity as DiseaseSeverity,
      treatment: String(values.treatment),
    });
    await loadRecords();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await cropDiseaseService.remove(deleteTarget.cropDiseaseId);
    await loadRecords();
  };

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const now = new Date();
    const detectedThisMonth = records.filter((r) => {
      const d = new Date(r.detectedDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return [
      { id: "active-cases", title: "Active Cases", value: records.length, trend: "neutral", subtitle: "Across all farms", icon: faBug, accentColor: "rose" },
      { id: "critical", title: "Critical Severity", value: records.filter((r) => r.severity === "CRITICAL").length, trend: "neutral", subtitle: "Needs immediate action", icon: faTriangleExclamation, accentColor: "rose" },
      { id: "high", title: "High Severity", value: records.filter((r) => r.severity === "HIGH").length, trend: "neutral", subtitle: "Under close monitoring", icon: faTriangleExclamation, accentColor: "amber" },
      { id: "detected-this-month", title: "Detected This Month", value: detectedThisMonth, trend: "neutral", subtitle: "New cases logged", icon: faCalendarCheck, accentColor: "teal" },
    ];
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.cropName.toLowerCase().includes(search.toLowerCase()) ||
        record.diseaseName.toLowerCase().includes(search.toLowerCase()) ||
        record.farmName.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === "ALL" || record.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [records, search, severityFilter]);

  return (
    <>
      <PageHeader
        title="Crop Diseases"
        subtitle="Monitor disease incidents, severity, and treatment progress across crops."
        actionLabel="Log Disease Case"
        showAction={canManage}
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
                    <RowActions
                      canManage={canManage}
                      entityLabel="disease record"
                      onView={() => setModal({ mode: "view", record })}
                      onDelete={() => setDeleteTarget(record)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredRecords.length === 0 && <EmptyState title="No disease records found" />}
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
            onView={() => setModal({ mode: "view", record })}
            onDelete={() => setDeleteTarget(record)}
            fields={[
              { label: "Detected", value: formatDate(record.detectedDate) },
              { label: "Treatment", value: record.treatment },
            ]}
          />
        ))}
        {!isLoading && filteredRecords.length === 0 && <EmptyState title="No disease records found" />}
      </div>

      <EntityFormModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "view" ? "Disease Record Details" : "Log Disease Case"}
        fields={recordFields}
        initialValues={
          modal?.record
            ? {
                cropId: modal.record.cropId,
                diseaseId: modal.record.diseaseId,
                detectedDate: modal.record.detectedDate,
                severity: modal.record.severity,
                treatment: modal.record.treatment,
              }
            : { cropId: "", diseaseId: "", detectedDate: "", severity: "LOW", treatment: "" }
        }
        onSubmit={handleSubmit}
        submitLabel="Log Case"
        readOnly={modal?.mode === "view"}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Disease Record"
        message={
          deleteTarget
            ? `Are you sure you want to delete the ${deleteTarget.diseaseName} record for ${deleteTarget.cropName}? This cannot be undone.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </>
  );
}
