import * as XLSX from "xlsx";
import type { DashboardRawData, KpiCardData, CategorySlice } from "@/types/dashboard";

export function exportDashboardToExcel(
  raw: DashboardRawData,
  kpis: KpiCardData[],
  categorySlices: CategorySlice[],
  year: number,
  revenueSeries: number[]
) {
  const wb = XLSX.utils.book_new();

  // 1. Tổng quan (KPIs)
  const kpiData = kpis.map((kpi) => ({
    "Chỉ số": kpi.title,
    "Giá trị": kpi.value,
    "Tăng trưởng": `${kpi.trend.percent !== null ? kpi.trend.percent + "%" : "N/A"} (${kpi.trend.label})`,
  }));
  const wsKpi = XLSX.utils.json_to_sheet(kpiData);
  XLSX.utils.book_append_sheet(wb, wsKpi, "Tổng quan");

  // 2. Doanh thu theo tháng
  const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const revenueData = months.map((m, idx) => ({
    "Tháng": m,
    "Doanh thu (VNĐ)": revenueSeries[idx] || 0,
  }));
  const wsRevenue = XLSX.utils.json_to_sheet(revenueData);
  XLSX.utils.book_append_sheet(wb, wsRevenue, `Doanh thu ${year}`);

  // 3. Danh mục
  const catData = categorySlices.map((c) => ({
    "Danh mục": c.name,
    "Số lượng đơn": c.count,
    "Tỷ lệ (%)": c.percent,
  }));
  const wsCat = XLSX.utils.json_to_sheet(catData);
  XLSX.utils.book_append_sheet(wb, wsCat, "Danh mục bán chạy");

  // 4. Tất cả đơn hàng
  const orderData = raw.orders.map((o) => ({
    "Mã đơn hàng": o.orderId,
    "Ngày đặt": o.orderDate ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(o.orderDate)) : "",
    "Trạng thái": o.orderStatus,
    "Thanh toán": o.paymentMethod,
    "Khách hàng": o.customer?.fullName || "",
    "SĐT": o.customer?.phoneNumber || "",
    "Tổng tiền (VNĐ)": o.totalAmount,
    "Điểm sử dụng": o.usedPoints || 0,
  }));
  const wsOrders = XLSX.utils.json_to_sheet(orderData);
  XLSX.utils.book_append_sheet(wb, wsOrders, "Tất cả đơn hàng");

  // Export
  XLSX.writeFile(wb, `Thong_Ke_Kien_Truc_${year}.xlsx`);
}
