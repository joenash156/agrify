// "Recent Sales" and "Upcoming Harvests" on the dashboard are display widgets
// with no dedicated joined backend endpoint yet (unlike stats/charts, which
// come from GET /api/dashboard/overview — see services/dashboardService.ts).
export const RECENT_SALES = [
  { id: "SL-001", customer: "Kofi Mensah", items: 3, amount: "₵ 1,240", status: "Paid",            date: "Aug 12" },
  { id: "SL-002", customer: "Ama Boateng",   items: 1, amount: "₵ 580",   status: "Unpaid",         date: "Aug 11" },
  { id: "SL-003", customer: "Kwame Asante",  items: 5, amount: "₵ 2,100", status: "Paid",            date: "Aug 11" },
  { id: "SL-004", customer: "Abena Frimpong",items: 2, amount: "₵ 840",   status: "Partially Paid", date: "Aug 10" },
  { id: "SL-005", customer: "Yaw Darko",     items: 4, amount: "₵ 1,620", status: "Paid",            date: "Aug 10" },
];

export const UPCOMING_HARVESTS = [
  { crop: "Tomatoes",    variety: "Roma",       farm: "Green Valley",  daysLeft: 3,  quantity: "120 kg" },
  { crop: "Maize",       variety: "Yellow Dent",farm: "North Fields",  daysLeft: 8,  quantity: "240 kg" },
  { crop: "Cabbage",     variety: "Savoy",      farm: "Green Valley",  daysLeft: 14, quantity: "80 kg"  },
  { crop: "Sweet Pepper",variety: "Bell",       farm: "East Ridge",    daysLeft: 21, quantity: "60 kg"  },
];
