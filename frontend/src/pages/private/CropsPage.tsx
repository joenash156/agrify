import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faTractor, faCalendarDay, faWheatAwn, faBug, faLeaf } from "@fortawesome/free-solid-svg-icons";
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
import { cropService } from "../../services/cropService";
import { farmService } from "../../services/farmService";
import type { Crop } from "../../types/crop";
import type { Farm } from "../../types/farm";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Crop["cropStatus"] | "ALL"> = [
  "ALL",
  "GROWING",
  "READY",
  "HARVESTED",
  "DISEASED",
  "DORMANT",
];

const CROP_STATUS_OPTIONS = [
  { value: "GROWING", label: "Growing" },
  { value: "READY", label: "Ready" },
  { value: "HARVESTED", label: "Harvested" },
  { value: "DISEASED", label: "Diseased" },
  { value: "DORMANT", label: "Dormant" },
];

type ModalState = { mode: "create" | "edit" | "view"; record?: Crop };

export default function CropsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Crop["cropStatus"] | "ALL">("ALL");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Crop | null>(null);

  const loadCrops = useCallback(() => {
    return Promise.all([cropService.findAll(), farmService.findAll()])
      .then(([cropList, farmList]) => {
        setFarms(farmList);
        const farmNameById = new Map(farmList.map((f) => [f.farmId, f.farmName]));
        setCrops(
          cropList.map((crop) => ({
            ...crop,
            farmName: farmNameById.get(crop.farmId) ?? "Unknown Farm",
          }))
        );
      })
      .catch(() => setCrops([]));
  }, []);

  useEffect(() => {
    loadCrops().finally(() => setIsLoading(false));
  }, [loadCrops]);

  const cropFields: FieldConfig[] = useMemo(
    () => [
      {
        name: "farmId",
        label: "Farm",
        type: "select",
        required: true,
        options: farms.map((f) => ({ value: f.farmId, label: f.farmName })),
      },
      { name: "cropName", label: "Crop Name", type: "text", required: true, placeholder: "e.g. Tomatoes" },
      { name: "cropVariety", label: "Variety", type: "text", required: true, placeholder: "e.g. Roma F1" },
      { name: "plantingDate", label: "Planting Date", type: "date", required: true },
      { name: "expectedHarvestDate", label: "Expected Harvest Date", type: "date", required: true },
      { name: "cropStatus", label: "Status", type: "select", required: true, options: CROP_STATUS_OPTIONS },
    ],
    [farms]
  );

  const handleSubmit = async (values: Record<string, FieldValue>) => {
    const payload = {
      farmId: String(values.farmId),
      cropName: String(values.cropName),
      cropVariety: String(values.cropVariety),
      plantingDate: String(values.plantingDate),
      expectedHarvestDate: String(values.expectedHarvestDate),
      cropStatus: values.cropStatus as Crop["cropStatus"],
    };
    if (modal?.mode === "edit" && modal.record) {
      await cropService.update(modal.record.cropId, payload);
    } else {
      await cropService.create(payload);
    }
    await loadCrops();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await cropService.remove(deleteTarget.cropId);
    await loadCrops();
  };

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const varieties = new Set(crops.map((c) => c.cropVariety)).size;
    return [
      { id: "active-crops", title: "Active Crops", value: crops.filter((c) => c.cropStatus === "GROWING").length, trend: "neutral", subtitle: "Currently growing", icon: faSeedling, accentColor: "teal" },
      { id: "ready-harvest", title: "Ready to Harvest", value: crops.filter((c) => c.cropStatus === "READY").length, trend: "neutral", subtitle: "Awaiting harvest", icon: faWheatAwn, accentColor: "amber" },
      { id: "diseased", title: "Diseased Crops", value: crops.filter((c) => c.cropStatus === "DISEASED").length, trend: "neutral", subtitle: "Requiring treatment", icon: faBug, accentColor: "rose" },
      { id: "varieties", title: "Total Varieties", value: varieties, trend: "neutral", subtitle: "Unique crop varieties", icon: faLeaf, accentColor: "purple" },
    ];
  }, [crops]);

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch =
        crop.cropName.toLowerCase().includes(search.toLowerCase()) ||
        crop.cropVariety.toLowerCase().includes(search.toLowerCase()) ||
        crop.farmName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || crop.cropStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [crops, search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Crops & Cultivation"
        subtitle="Track planting, growth stages, and harvest schedules across all farms."
        actionLabel="Add Crop"
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
                    <RowActions
                      canManage={canManage}
                      entityLabel="crop"
                      onView={() => setModal({ mode: "view", record: crop })}
                      onEdit={() => setModal({ mode: "edit", record: crop })}
                      onDelete={() => setDeleteTarget(crop)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredCrops.length === 0 && <EmptyState title="No crops found" />}
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
            onView={() => setModal({ mode: "view", record: crop })}
            onEdit={() => setModal({ mode: "edit", record: crop })}
            onDelete={() => setDeleteTarget(crop)}
            fields={[
              { label: "Planted", value: formatDate(crop.plantingDate) },
              { label: "Expected Harvest", value: formatDate(crop.expectedHarvestDate) },
            ]}
          />
        ))}
        {!isLoading && filteredCrops.length === 0 && <EmptyState title="No crops found" />}
      </div>

      <EntityFormModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit Crop" : modal?.mode === "view" ? "Crop Details" : "Add Crop"}
        fields={cropFields}
        initialValues={
          modal?.record
            ? {
                farmId: modal.record.farmId,
                cropName: modal.record.cropName,
                cropVariety: modal.record.cropVariety,
                plantingDate: modal.record.plantingDate,
                expectedHarvestDate: modal.record.expectedHarvestDate,
                cropStatus: modal.record.cropStatus,
              }
            : { farmId: "", cropName: "", cropVariety: "", plantingDate: "", expectedHarvestDate: "", cropStatus: "GROWING" }
        }
        onSubmit={handleSubmit}
        submitLabel={modal?.mode === "edit" ? "Save Changes" : "Create Crop"}
        readOnly={modal?.mode === "view"}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Crop"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.cropName}"? This cannot be undone.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </>
  );
}
