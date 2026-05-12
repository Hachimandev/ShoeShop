"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/order.service";
import { Order, OrderStatus } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      // Sort orders by date descending (newest first)
      const sortedData = data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      setOrders(sortedData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      // Refresh after update
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case OrderStatus.SHIPPING:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case OrderStatus.CANCELLED:
      case OrderStatus.RETURNED:
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case OrderStatus.AWAITING_CANCELLATION:
        return "bg-orange-100 text-orange-800 hover:bg-orange-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage customer orders and their statuses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Total Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.orderId} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {order.orderId.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{order.customer?.fullName || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{order.customer?.email || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        ${order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={`px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(order.orderStatus)} border-none shadow-none`}>
                          {order.orderStatus.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                          disabled={updatingId === order.orderId}
                        >
                          {Object.values(OrderStatus).map((status) => (
                            <option key={status} value={status}>
                              {status.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
