import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faLocationDot, faWarehouse, faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { PageHeader } from "../../components/common/PageHeader";
import { ListToolbar } from "../../components/common/ListToolbar";
import { EntityCard } from "../../components/common/EntityCard";
import { RowActions } from "../../components/common/RowActions";
import { EmptyState } from "../../components/common/EmptyState";
import { canManageRecords } from "../../utils/permissions";
import { useCurrentUser } from "../../contexts/AuthContext";
import { inventoryService } from "../../services/inventoryService";
import type { Inventory } from "../../types/inventory";
import type { StatCardData } from "../../types/dashboard";

const LOCATION_FILTERS = ["ALL", "Warehouse A", "Warehouse B", "Warehouse C"] as const;

export default function InventoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const canManage = canManageRecords(currentUser.role);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<(typeof LOCATION_FILTERS)[number]>("ALL");
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    inventoryService
      .findAll()
      .then(setInventory)
      .catch(() => setInventory([]))
      .finally(() => setIsLoading(false));
  }, []);

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  const stats: StatCardData[] = useMemo(() => {
    const totalStored = inventory.reduce((sum, i) => sum + i.quantity, 0);
    const locations = new Set(inventory.map((i) => i.storageLocation.split(" - ")[0]));
    const avgBatch = inventory.length > 0 ? Math.round(totalStored / inventory.length) : 0;
    return [
      { id: "items", title: "Inventory Items", value: inventory.length, trend: "neutral", subtitle: "Stored batches", icon: faBoxesStacked, accentColor: "purple" },
      { id: "total-qty", title: "Total Stored", value: `${totalStored.toLocaleString()} kg`, trend: "neutral", subtitle: "Combined weight in storage", icon: faWarehouse, accentColor: "teal" },
      { id: "locations", title: "Storage Locations", value: locations.size, trend: "neutral", subtitle: "Active warehouses", icon: faLocationDot, accentColor: "blue" },
      { id: "avg-batch", title: "Avg. Batch Size", value: `${avgBatch.toLocaleString()} kg`, trend: "neutral", subtitle: "Per stored batch", icon: faScaleBalanced, accentColor: "amber" },
    ];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = locationFilter === "ALL" || item.storageLocation.startsWith(locationFilter);
      return matchesSearch && matchesLocation;
    });
  }, [inventory, search, locationFilter]);

  return (
    <>
      <PageHeader
        title="Inventory Storage"
        subtitle="Track stored harvest inventory and warehouse locations."
        actionLabel="Add Inventory Item"
        showAction={canManage}
        onAction={() => alert("Adding inventory items will be available once the backend is connected.")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by item name..."
        filters={LOCATION_FILTERS}
        activeFilter={locationFilter}
        onFilterChange={setLocationFilter}
        formatLabel={(f) => (f === "ALL" ? "All" : f)}
      />

      {/* Desktop table */}
      <div className={`hidden md:block rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Item", "Quantity", "Storage Location"].map((col) => (
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
              {filteredInventory.map((item) => (
                <tr
                  key={item.inventoryId}
                  className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faBoxesStacked} className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${sectionTitle}`}>{item.itemName}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${sectionTitle}`}>
                    {item.quantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${subText}`}>
                      <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3" />
                      {item.storageLocation}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions canManage={canManage} entityLabel="inventory item" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredInventory.length === 0 && <EmptyState title="No inventory items found" />}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredInventory.map((item) => (
          <EntityCard
            key={item.inventoryId}
            icon={faBoxesStacked}
            title={item.itemName}
            canManage={canManage}
            entityLabel="inventory item"
            fields={[
              { label: "Quantity", value: `${item.quantity.toLocaleString()} ${item.unit}` },
              { label: "Location", value: item.storageLocation },
            ]}
          />
        ))}
        {!isLoading && filteredInventory.length === 0 && <EmptyState title="No inventory items found" />}
      </div>
    </>
  );
}
