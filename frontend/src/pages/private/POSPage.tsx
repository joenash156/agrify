import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faCartShopping,
  faMagnifyingGlass,
  faTrash,
  faPlus,
  faMinus,
  faUserPlus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useCurrentUser } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { EntityFormModal, type FieldConfig, type FieldValue } from "../../components/common/EntityFormModal";
import { extractErrorMessage } from "../../utils/errors";
import { inventoryService } from "../../services/inventoryService";
import { customerService, type Customer } from "../../services/customerService";
import { employeeService } from "../../services/employeeService";
import { appUserService } from "../../services/appUserService";
import { saleService } from "../../services/saleService";
import { saleItemService } from "../../services/saleItemService";
import type { Inventory } from "../../types/inventory";
import type { Sale } from "../../types/sale";

interface CartLine {
  inventoryId: string;
  itemName: string;
  unit: string;
  availableQty: number;
  quantity: number;
  unitPrice: number;
}

interface StoredCart {
  cart: CartLine[];
  customerId: string;
  saleStatus: Sale["saleStatus"];
}

const CUSTOMER_FIELDS: FieldConfig[] = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
  { name: "email", label: "Email", type: "text" },
  { name: "address", label: "Address", type: "text" },
];

const SALE_STATUS_OPTIONS: Array<{ value: Sale["saleStatus"]; label: string }> = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "PAID", label: "Paid" },
];

function cartStorageKey(userId: string): string {
  return `agrify:pos-cart:${userId}`;
}

// employment.role is a free-text job title ("Sales Associate", "Field Worker", ...) rather
// than the strict account-role enum, so "Sold By" matches on it loosely — this still excludes
// non-sales staff (workers, managers, equipment operators) from the picker, which is the goal.
function isSalesRole(role: string): boolean {
  return role.toUpperCase().includes("SALES");
}

export default function POSPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentUser = useCurrentUser();
  const toast = useToast();
  const canPickSoldBy = currentUser.role === "ADMIN" || currentUser.role === "FARM_MANAGER";

  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<{ value: string; label: string }[]>([]);
  const [soldByEmploymentId, setSoldByEmploymentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasHydratedCart, setHasHydratedCart] = useState(false);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [saleStatus, setSaleStatus] = useState<Sale["saleStatus"]>("UNPAID");
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const loadData = useCallback(() => {
    return Promise.all([
      inventoryService.findAll(),
      customerService.findAll(),
      employeeService.findAll(),
      appUserService.findAll(),
    ])
      .then(([inventoryList, customerList, employments, users]) => {
        const inStock = inventoryList.filter((i) => i.quantity > 0);
        setInventory(inStock);
        setCustomers(customerList);

        const userById = new Map(users.map((u) => [u.userId, u]));
        const salesEmployments = employments.filter((e) => isSalesRole(e.role));
        setEmployeeOptions(
          salesEmployments.map((e) => {
            const user = userById.get(e.userId);
            return { value: e.employmentId, label: user ? `${user.firstName} ${user.lastName} (${e.role})` : e.role };
          })
        );
        // Only pre-select "my own employment" if I'm actually a sales person — a farm
        // manager or admin covering the till still has to explicitly pick who it's for.
        const mine = salesEmployments.find((e) => e.userId === currentUser.userId && e.employmentStatus === "ACTIVE");
        if (mine) setSoldByEmploymentId(mine.employmentId);

        // Restore any in-progress cart for this user, re-validated against current stock —
        // an item may have sold out or shrunk since it was last saved to localStorage.
        if (!hasHydratedCart) {
          setHasHydratedCart(true);
          const raw = localStorage.getItem(cartStorageKey(currentUser.userId));
          if (raw) {
            try {
              const stored = JSON.parse(raw) as StoredCart;
              const availableById = new Map(inStock.map((i) => [i.inventoryId, i]));
              const restoredCart = stored.cart
                .map((line) => {
                  const current = availableById.get(line.inventoryId);
                  if (!current) return null;
                  return { ...line, availableQty: current.quantity, quantity: Math.min(line.quantity, current.quantity) };
                })
                .filter((l): l is CartLine => l !== null);
              setCart(restoredCart);
              setCustomerId(stored.customerId);
              setSaleStatus(stored.saleStatus);
            } catch {
              // Corrupt/old-shape localStorage entry — ignore and start fresh.
            }
          }
        }
      })
      .catch(() => {
        setInventory([]);
        setCustomers([]);
      });
  }, [currentUser.userId, hasHydratedCart]);

  useEffect(() => {
    loadData().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the in-progress cart per user so it survives navigation, reload, and even
  // logging out and back in — cleared only after a successful checkout.
  useEffect(() => {
    if (!hasHydratedCart) return;
    if (cart.length === 0 && customerId === "") {
      localStorage.removeItem(cartStorageKey(currentUser.userId));
      return;
    }
    const payload: StoredCart = { cart, customerId, saleStatus };
    localStorage.setItem(cartStorageKey(currentUser.userId), JSON.stringify(payload));
  }, [cart, customerId, saleStatus, hasHydratedCart, currentUser.userId]);

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";
  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
    isDark
      ? "bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-teal-500"
      : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500"
  }`;

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => item.itemName.toLowerCase().includes(search.toLowerCase()));
  }, [inventory, search]);

  const cartTotal = useMemo(() => cart.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0), [cart]);

  const addToCart = (item: Inventory) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.inventoryId === item.inventoryId);
      if (existing) {
        if (existing.quantity >= item.quantity) return prev;
        return prev.map((l) => (l.inventoryId === item.inventoryId ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { inventoryId: item.inventoryId, itemName: item.itemName, unit: item.unit, availableQty: item.quantity, quantity: 1, unitPrice: 0 }];
    });
  };

  const updateLine = (inventoryId: string, patch: Partial<Pick<CartLine, "quantity" | "unitPrice">>) => {
    setCart((prev) =>
      prev.map((l) => {
        if (l.inventoryId !== inventoryId) return l;
        const next = { ...l, ...patch };
        if (next.quantity < 1) next.quantity = 1;
        if (next.quantity > next.availableQty) next.quantity = next.availableQty;
        if (next.unitPrice < 0) next.unitPrice = 0;
        return next;
      })
    );
  };

  const removeLine = (inventoryId: string) => {
    setCart((prev) => prev.filter((l) => l.inventoryId !== inventoryId));
  };

  const canCheckout =
    cart.length > 0 &&
    customerId !== "" &&
    soldByEmploymentId !== "" &&
    cart.every((l) => l.quantity > 0 && l.quantity <= l.availableQty && l.unitPrice > 0);

  const handleCreateCustomer = async (values: Record<string, FieldValue>) => {
    const created = await customerService.create({
      firstName: String(values.firstName),
      lastName: String(values.lastName),
      phoneNumber: String(values.phoneNumber),
      email: String(values.email ?? ""),
      address: String(values.address ?? ""),
    });
    setCustomers((prev) => [...prev, created]);
    setCustomerId(created.customerId);
  };

  const handleCheckout = async () => {
    if (!canCheckout) return;
    setIsCheckingOut(true);
    try {
      const sale = await saleService.create({
        customerId,
        employmentId: soldByEmploymentId,
        total: 0,
        saleStatus,
      });
      for (const line of cart) {
        await saleItemService.create({
          saleId: sale.saleId,
          inventoryId: line.inventoryId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
        });
      }
      setCart([]);
      setCustomerId("");
      setSaleStatus("UNPAID");
      localStorage.removeItem(cartStorageKey(currentUser.userId));
      toast.success("Sale recorded. Inventory has been updated.");
      await loadData();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Something went wrong while completing the sale. Please try again."));
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <PageHeader title="POS Terminal" subtitle="Ring up a sale from live inventory." showAction={false} />

      {!canPickSoldBy && soldByEmploymentId === "" && !isLoading && (
        <div className={`rounded-2xl border p-5 flex items-center gap-3 ${isDark ? "bg-amber-950/30 border-amber-800" : "bg-amber-50 border-amber-200"}`}>
          <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 text-amber-500 shrink-0" />
          <p className={`text-xs font-semibold ${isDark ? "text-amber-300" : "text-amber-800"}`}>
            Your account has no active employment record, so sales can't be attributed to you yet. Ask an admin to
            set one up before using the POS terminal.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Left: item grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <FontAwesomeIcon icon={faMagnifyingGlass} className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${subText}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className={`${inputCls} pl-10`}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredInventory.map((item) => {
              const inCart = cart.find((l) => l.inventoryId === item.inventoryId);
              const soldOut = inCart ? inCart.quantity >= item.quantity : false;
              return (
                <button
                  key={item.inventoryId}
                  type="button"
                  onClick={() => addToCart(item)}
                  disabled={soldOut}
                  className={`text-left rounded-2xl border p-4 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${cardBg} ${
                    isDark ? "hover:border-teal-600" : "hover:border-teal-400"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"}`}>
                    <FontAwesomeIcon icon={faBoxesStacked} className="w-4 h-4" />
                  </div>
                  <p className={`text-xs font-bold truncate ${sectionTitle}`}>{item.itemName}</p>
                  <p className={`text-[11px] mt-0.5 ${subText}`}>
                    {item.quantity.toLocaleString()} {item.unit} available
                  </p>
                  {inCart && (
                    <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-1">
                      {inCart.quantity} {item.unit} in cart
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          {!isLoading && filteredInventory.length === 0 && <EmptyState title="No inventory available" />}
        </div>

        {/* Right: cart panel */}
        <div className={`rounded-2xl border p-4 space-y-4 lg:sticky lg:top-4 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-extrabold flex items-center gap-2 ${sectionTitle}`}>
              <FontAwesomeIcon icon={faCartShopping} className="w-4 h-4 text-teal-600" />
              Cart
            </h3>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setCart([])}
                className="text-[11px] font-bold text-red-500 hover:text-red-600"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {cart.length === 0 && <p className={`text-xs text-center py-6 ${subText}`}>Cart is empty — tap an item to add it.</p>}
            {cart.map((line) => (
              <div key={line.inventoryId} className={`p-3 rounded-xl border ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-bold truncate ${sectionTitle}`}>{line.itemName}</p>
                  <button type="button" onClick={() => removeLine(line.inventoryId)} className="text-zinc-400 hover:text-red-500 shrink-0">
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateLine(line.inventoryId, { quantity: line.quantity - 1 })}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"}`}
                    >
                      <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                    </button>
                    <input
                      type="number"
                      value={line.quantity}
                      onChange={(e) => updateLine(line.inventoryId, { quantity: Number(e.target.value) })}
                      className={`w-12 text-center text-xs font-bold rounded-lg py-1 ${isDark ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"}`}
                    />
                    <button
                      type="button"
                      onClick={() => updateLine(line.inventoryId, { quantity: line.quantity + 1 })}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"}`}
                    >
                      <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                    </button>
                    <span className={`text-[10px] ${subText}`}>{line.unit}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <span className={`text-[10px] ${subText}`}>₵</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.unitPrice || ""}
                      onChange={(e) => updateLine(line.inventoryId, { unitPrice: Number(e.target.value) })}
                      placeholder="Price"
                      className={`w-full text-xs font-semibold rounded-lg py-1 px-2 ${isDark ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"}`}
                    />
                  </div>
                </div>
                {line.quantity * line.unitPrice > 0 && (
                  <p className={`text-[11px] text-right mt-1 font-bold ${sectionTitle}`}>
                    ₵ {(line.quantity * line.unitPrice).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className={`pt-3 border-t space-y-3 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${subText}`}>Total</span>
              <span className={`text-lg font-black ${sectionTitle}`}>₵ {cartTotal.toLocaleString()}</span>
            </div>

            {canPickSoldBy && (
              <div>
                <label className={`block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ${subText}`}>Sold By</label>
                <select value={soldByEmploymentId} onChange={(e) => setSoldByEmploymentId(e.target.value)} className={inputCls}>
                  <option value="" disabled>
                    Select who's selling...
                  </option>
                  {employeeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={`block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ${subText}`}>Customer</label>
              <div className="flex items-center gap-2">
                <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={inputCls}>
                  <option value="" disabled>
                    Select customer...
                  </option>
                  {customers.map((c) => (
                    <option key={c.customerId} value={c.customerId}>
                      {c.firstName} {c.lastName} · {c.phoneNumber}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setNewCustomerOpen(true)}
                  title="Create new customer"
                  className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-colors ${
                    isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ${subText}`}>Payment Status</label>
              <select value={saleStatus} onChange={(e) => setSaleStatus(e.target.value as Sale["saleStatus"])} className={inputCls}>
                {SALE_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canCheckout || isCheckingOut}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Processing..." : "Complete Sale"}
            </button>
          </div>
        </div>
      </div>

      <EntityFormModal
        isOpen={newCustomerOpen}
        onClose={() => setNewCustomerOpen(false)}
        title="New Customer"
        fields={CUSTOMER_FIELDS}
        initialValues={{ firstName: "", lastName: "", phoneNumber: "", email: "", address: "" }}
        onSubmit={handleCreateCustomer}
        submitLabel="Create Customer"
      />
    </>
  );
}
