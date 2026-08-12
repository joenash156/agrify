import type { Employee } from "../types/employee";
import type { StatCardData } from "../types/dashboard";
import { faUsers, faCircleCheck, faClock, faCreditCard } from "@fortawesome/free-solid-svg-icons";

export const MOCK_EMPLOYEES: Employee[] = [
  { employmentId: "emp-101", userId: "usr-101", firstName: "Ama", lastName: "Serwaa", email: "ama.serwaa@agrify.io", phoneNumber: "+233 24 111 2222", farmName: "Green Valley Estate", jobTitle: "Sales Associate", salary: 1800, hireDate: "2023-02-01", employmentStatus: "ACTIVE" },
  { employmentId: "emp-102", userId: "usr-102", firstName: "Yaw", lastName: "Owusu", email: "yaw.owusu@agrify.io", phoneNumber: "+233 24 333 4444", farmName: "North Fields Agriculture", jobTitle: "Sales Associate", salary: 1750, hireDate: "2022-09-15", employmentStatus: "ACTIVE" },
  { employmentId: "emp-103", userId: "usr-103", firstName: "Kwabena", lastName: "Owusu-Ansah", email: "kwabena.oa@agrify.io", phoneNumber: "+233 20 555 6666", farmName: "Green Valley Estate", jobTitle: "Field Supervisor", salary: 2400, hireDate: "2021-05-10", employmentStatus: "ACTIVE" },
  { employmentId: "emp-104", userId: "usr-104", firstName: "Akosua", lastName: "Nyarko", email: "akosua.nyarko@agrify.io", phoneNumber: "+233 27 777 8888", farmName: "East Ridge Farm", jobTitle: "Farm Worker", salary: 1200, hireDate: "2024-01-20", employmentStatus: "ON_LEAVE" },
  { employmentId: "emp-105", userId: "usr-105", firstName: "Kojo", lastName: "Antwi", email: "kojo.antwi@agrify.io", phoneNumber: "+233 20 999 0000", farmName: "North Fields Agriculture", jobTitle: "Equipment Operator", salary: 1600, hireDate: "2022-11-03", employmentStatus: "ACTIVE" },
  { employmentId: "emp-106", userId: "usr-106", firstName: "Adjoa", lastName: "Boateng", email: "adjoa.boateng@agrify.io", phoneNumber: "+233 26 222 3333", farmName: "Sunrise Agro Holdings", jobTitle: "Farm Worker", salary: 1150, hireDate: "2020-08-18", employmentStatus: "TERMINATED" },
];

export const EMPLOYEE_STATS: StatCardData[] = [
  { id: "total", title: "Total Employees", value: 38, change: "+3", trend: "up", subtitle: "Across all farms", icon: faUsers, accentColor: "blue" },
  { id: "active", title: "Active Employees", value: 4, trend: "up", subtitle: "Currently employed", icon: faCircleCheck, accentColor: "teal" },
  { id: "on-leave", title: "On Leave", value: 1, trend: "neutral", subtitle: "Temporarily away", icon: faClock, accentColor: "amber" },
  { id: "payroll", title: "Monthly Payroll", value: "₵ 9,900", trend: "neutral", subtitle: "Combined salaries shown", icon: faCreditCard, accentColor: "purple" },
];
