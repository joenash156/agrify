import { useCallback, useEffect, useMemo, useState } from "react";
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
import { EntityFormModal, type FieldConfig, type FieldValue } from "../../components/common/EntityFormModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { formatDate } from "../../utils/formatDate";
import { canManageRecords } from "../../utils/permissions";
import { useCurrentUser } from "../../contexts/AuthContext";
import { equipmentService } from "../../services/equipmentService";
import { farmService } from "../../services/farmService";
import type { Equipment } from "../../types/equipment";
import type { Farm } from "../../types/farm";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Equipment["equipmentStatus"] | "ALL"> = [
  "ALL",
  "AVAILABLE",
  "IN_USE",
  "MAINTENANCE",
  "BROKEN",
  "RETIRED",
];

const EQUIPMENT_STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "IN_USE", label: "In Use" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "BROKEN", label: "Broken" },
  { value: "RETIRED", label: "Retired" },
];

type ModalState = { mode: "create" | "edit" | "view"; record?: Equipment };

export default function EquipmentPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Equipment["equipmentStatus"] | "ALL">("ALL");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);

  const loadEquipment = useCallback(() => {
    return Promise.all([equipmentService.findAll(), farmService.findAll()])
      .then(([equipmentList, farmList]) => {
        setFarms(farmList);
        const farmNameById = new Map(farmList.map((f) => [f.farmId, f.farmName]));
        setEquipment(
          equipmentList.map((item) => ({
            ...item,
            farmName: farmNameById.get(item.farmId) ?? "Unknown Farm",
          }))
        );
      })
      .catch(() => setEquipment([]));
  }, []);

  useEffect(() => {
    loadEquipment().finally(() => setIsLoading(false));
  }, [loadEquipment]);

  const equipmentFields: FieldConfig[] = useMemo(
    () => [
      {
        name: "farmId",
        label: "Farm",
        type: "select",
        required: true,
        options: farms.map((f) => ({ value: f.farmId, label: f.farmName })),
      },
      { name: "equipmentName", label: "Equipment Name", type: "text", required: true, placeholder: "e.g. John Deere 5075E" },
      { name: "equipmentType", label: "Type", type: "text", required: true, placeholder: "e.g. Tractor" },
      { name: "purchaseDate", label: "Purchase Date", type: "date", required: true },
      { name: "purchaseCost", label: "Purchase Cost (₵)", type: "number", required: true, step: "0.01" },
      { name: "equipmentStatus", label: "Status", type: "select", required: true, options: EQUIPMENT_STATUS_OPTIONS },
    ],
    [farms]
  );

  const handleSubmit = async (values: Record<string, FieldValue>) => {
    const payload = {
      farmId: String(values.farmId),
      equipmentName: String(values.equipmentName),
      equipmentType: String(values.equipmentType),
      purchaseDate: String(values.purchaseDate),
      purchaseCost: Number(values.purchaseCost),
      equipmentStatus: values.equipmentStatus as Equipment["equipmentStatus"],
    };
    if (modal?.mode === "edit" && modal.record) {
      await equipmentService.update(modal.record.equipmentId, payload);
    } else {
      await equipmentService.create(payload);
    }
    await loadEquipment();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await equipmentService.remove(deleteTarget.equipmentId);
    await loadEquipment();
  };

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
                    <RowActions
                      canManage={canManage}
                      entityLabel="equipment item"
                      onView={() => setModal({ mode: "view", record: item })}
                      onEdit={() => setModal({ mode: "edit", record: item })}
                      onDelete={() => setDeleteTarget(item)}
                    />
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
            onView={() => setModal({ mode: "view", record: item })}
            onEdit={() => setModal({ mode: "edit", record: item })}
            onDelete={() => setDeleteTarget(item)}
            fields={[
              { label: "Purchased", value: formatDate(item.purchaseDate) },
              { label: "Cost", value: `₵ ${item.purchaseCost.toLocaleString()}` },
            ]}
          />
        ))}
        {!isLoading && filteredEquipment.length === 0 && <EmptyState title="No equipment found" />}
      </div>

      <EntityFormModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit Equipment" : modal?.mode === "view" ? "Equipment Details" : "Add Equipment"}
        fields={equipmentFields}
        initialValues={
          modal?.record
            ? {
                farmId: modal.record.farmId,
                equipmentName: modal.record.equipmentName,
                equipmentType: modal.record.equipmentType,
                purchaseDate: modal.record.purchaseDate,
                purchaseCost: modal.record.purchaseCost,
                equipmentStatus: modal.record.equipmentStatus,
              }
            : { farmId: "", equipmentName: "", equipmentType: "", purchaseDate: "", purchaseCost: "", equipmentStatus: "AVAILABLE" }
        }
        onSubmit={handleSubmit}
        submitLabel={modal?.mode === "edit" ? "Save Changes" : "Add Equipment"}
        readOnly={modal?.mode === "view"}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Equipment"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.equipmentName}"? This cannot be undone.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </>
  );
}
