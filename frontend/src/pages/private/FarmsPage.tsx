import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUsers, faSeedling, faTractor, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
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
import { farmService } from "../../services/farmService";
import { cropService } from "../../services/cropService";
import { employeeService } from "../../services/employeeService";
import type { Farm } from "../../types/farm";
import type { StatCardData } from "../../types/dashboard";

const STATUS_FILTERS: Array<Farm["farmStatus"] | "ALL"> = [
  "ALL",
  "ACTIVE",
  "SEASONAL",
  "INACTIVE",
  "FALLOW",
];

const FARM_FIELDS: FieldConfig[] = [
  { name: "farmName", label: "Farm Name", type: "text", required: true, placeholder: "e.g. Green Valley Estate" },
  { name: "location", label: "Location", type: "text", required: true, placeholder: "e.g. Kumasi, Ashanti Region" },
  { name: "size", label: "Size (hectares)", type: "number", required: true, step: "0.01" },
  {
    name: "farmStatus",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "SEASONAL", label: "Seasonal" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "FALLOW", label: "Fallow" },
    ],
  },
];

type ModalState = { mode: "create" | "edit" | "view"; record?: Farm };

export default function FarmsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Farm["farmStatus"] | "ALL">("ALL");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Farm | null>(null);

  const loadFarms = useCallback(() => {
    return Promise.all([farmService.findAll(), cropService.findAll(), employeeService.findAll()])
      .then(([farmList, crops, employments]) => {
        setFarms(
          farmList.map((farm) => ({
            ...farm,
            cropCount: crops.filter((c) => c.farmId === farm.farmId).length,
            employeeCount: employments.filter(
              (e) => e.farmId === farm.farmId && e.employmentStatus === "ACTIVE"
            ).length,
          }))
        );
      })
      .catch(() => setFarms([]));
  }, []);

  useEffect(() => {
    loadFarms().finally(() => setIsLoading(false));
  }, [loadFarms]);

  const handleSubmit = async (values: Record<string, FieldValue>) => {
    const payload = {
      farmName: String(values.farmName),
      location: String(values.location),
      size: Number(values.size),
      farmStatus: values.farmStatus as Farm["farmStatus"],
    };
    if (modal?.mode === "edit" && modal.record) {
      await farmService.update(modal.record.farmId, payload);
    } else {
      await farmService.create(payload);
    }
    await loadFarms();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await farmService.remove(deleteTarget.farmId);
    await loadFarms();
  };

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const totalArea = farms.reduce((sum, f) => sum + f.size, 0);
    return [
      { id: "total-farms", title: "Total Farms", value: farms.length, subtitle: "Registered in the system", icon: faTractor, accentColor: "teal", trend: "neutral" },
      { id: "active-farms", title: "Active Farms", value: farms.filter((f) => f.farmStatus === "ACTIVE").length, trend: "neutral", subtitle: "Currently operational", icon: faMapLocationDot, accentColor: "amber" },
      { id: "total-employees", title: "Farm Employees", value: farms.reduce((sum, f) => sum + (f.employeeCount ?? 0), 0), trend: "neutral", subtitle: "Across all farms", icon: faUsers, accentColor: "blue" },
      { id: "total-area", title: "Total Area", value: `${totalArea.toLocaleString()} ha`, subtitle: "Combined farm size", icon: faSeedling, accentColor: "purple", trend: "neutral" },
    ];
  }, [farms]);

  const filteredFarms = useMemo(() => {
    return farms.filter((farm) => {
      const matchesSearch =
        farm.farmName.toLowerCase().includes(search.toLowerCase()) ||
        farm.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || farm.farmStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [farms, search, statusFilter]);

  return (
    <>
      <PageHeader
        title="Farms"
        subtitle="Manage your registered farms and their operational status."
        actionLabel="Add Farm"
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
                    <RowActions
                      canManage={canManage}
                      entityLabel="farm"
                      onView={() => setModal({ mode: "view", record: farm })}
                      onEdit={() => setModal({ mode: "edit", record: farm })}
                      onDelete={() => setDeleteTarget(farm)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredFarms.length === 0 && <EmptyState title="No farms found" />}
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
            onView={() => setModal({ mode: "view", record: farm })}
            onEdit={() => setModal({ mode: "edit", record: farm })}
            onDelete={() => setDeleteTarget(farm)}
            fields={[
              { label: "Size", value: `${farm.size} ha` },
              { label: "Employees", value: farm.employeeCount ?? 0 },
              { label: "Crops", value: farm.cropCount ?? 0 },
              { label: "Updated", value: formatDate(farm.updatedAt) },
            ]}
          />
        ))}
        {!isLoading && filteredFarms.length === 0 && <EmptyState title="No farms found" />}
      </div>

      <EntityFormModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Edit Farm" : modal?.mode === "view" ? "Farm Details" : "Add Farm"}
        fields={FARM_FIELDS}
        initialValues={
          modal?.record
            ? {
                farmName: modal.record.farmName,
                location: modal.record.location,
                size: modal.record.size,
                farmStatus: modal.record.farmStatus,
              }
            : { farmName: "", location: "", size: "", farmStatus: "ACTIVE" }
        }
        onSubmit={handleSubmit}
        submitLabel={modal?.mode === "edit" ? "Save Changes" : "Create Farm"}
        readOnly={modal?.mode === "view"}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Farm"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.farmName}"? This cannot be undone.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </>
  );
}
