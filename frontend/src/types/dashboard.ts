import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { UserRole } from "./user";

export interface NavItem {
  label: string;
  href: string;
  icon: IconDefinition;
  badge?: string | number;
  roles?: UserRole[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  icon: IconDefinition;
  accentColor?: string;
}
