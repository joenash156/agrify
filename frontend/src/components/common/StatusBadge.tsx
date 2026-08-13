import { useTheme } from "../../contexts/ThemeContext";

interface StatusBadgeProps {
  status: string;
  variant?:
    | "farm"
    | "crop"
    | "sale"
    | "equipment"
    | "payment"
    | "attendance"
    | "employment"
    | "severity"
    | "grade";
  className?: string;
}

interface StatusColor {
  light: string;
  dark: string;
}

type ColorMap = Record<string, StatusColor>;

const neutral: StatusColor = {
  light: "bg-zinc-200 text-zinc-600 border-zinc-300",
  dark: "bg-zinc-800 text-zinc-400 border-zinc-700",
};
const emerald: StatusColor = {
  light: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
  dark: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
};
const amber: StatusColor = {
  light: "bg-amber-500/10 text-amber-700 border-amber-500/25",
  dark: "bg-amber-500/10 text-amber-400 border-amber-500/25",
};
const red: StatusColor = {
  light: "bg-red-500/10 text-red-700 border-red-500/25",
  dark: "bg-red-500/10 text-red-400 border-red-500/25",
};
const orange: StatusColor = {
  light: "bg-orange-500/10 text-orange-700 border-orange-500/25",
  dark: "bg-orange-500/10 text-orange-400 border-orange-500/25",
};
const blue: StatusColor = {
  light: "bg-blue-500/10 text-blue-700 border-blue-500/25",
  dark: "bg-blue-500/10 text-blue-400 border-blue-500/25",
};
const teal: StatusColor = {
  light: "bg-teal-500/10 text-teal-700 border-teal-500/25",
  dark: "bg-teal-500/10 text-teal-400 border-teal-500/25",
};
const purple: StatusColor = {
  light: "bg-purple-500/10 text-purple-700 border-purple-500/25",
  dark: "bg-purple-500/10 text-purple-400 border-purple-500/25",
};

const farmStatusColors: ColorMap = {
  ACTIVE: emerald,
  SEASONAL: amber,
  INACTIVE: neutral,
  FALLOW: blue,
};

const cropStatusColors: ColorMap = {
  GROWING: teal,
  READY: amber,
  HARVESTED: purple,
  DISEASED: red,
  DORMANT: neutral,
};

const saleStatusColors: ColorMap = {
  PAID: emerald,
  PARTIALLY_PAID: amber,
  UNPAID: red,
  CANCELLED: neutral,
};

const equipmentStatusColors: ColorMap = {
  AVAILABLE: emerald,
  IN_USE: blue,
  MAINTENANCE: amber,
  BROKEN: red,
  RETIRED: neutral,
};

const paymentStatusColors: ColorMap = {
  CONFIRMED: emerald,
  PENDING: amber,
  FAILED: red,
  REFUNDED: blue,
};

const attendanceStatusColors: ColorMap = {
  PRESENT: emerald,
  ABSENT: red,
  LATE: amber,
  LEAVE: blue,
};

const employmentStatusColors: ColorMap = {
  ACTIVE: emerald,
  TERMINATED: red,
  ON_LEAVE: amber,
  SUSPENDED: neutral,
};

const severityColors: ColorMap = {
  LOW: emerald,
  MEDIUM: amber,
  HIGH: orange,
  CRITICAL: red,
};

const gradeColors: ColorMap = {
  PREMIUM: purple,
  STANDARD: teal,
  SUBSTANDARD: neutral,
};

const variantMap: Record<string, ColorMap> = {
  farm: farmStatusColors,
  crop: cropStatusColors,
  sale: saleStatusColors,
  equipment: equipmentStatusColors,
  payment: paymentStatusColors,
  attendance: attendanceStatusColors,
  employment: employmentStatusColors,
  severity: severityColors,
  grade: gradeColors,
};

export function StatusBadge({ status, variant = "farm", className = "" }: StatusBadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const key = status.toUpperCase().replace(/ /g, "_");
  const map = variantMap[variant] ?? farmStatusColors;
  const colors = map[key] ?? neutral;
  const finalColors = isDark ? colors.dark : colors.light;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${finalColors} ${className}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
