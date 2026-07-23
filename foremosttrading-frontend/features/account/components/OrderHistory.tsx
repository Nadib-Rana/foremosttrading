"use client";

import { useEffect, useState } from "react";
import { Check, Truck, Package, Box } from "lucide-react";
import { KitPreview } from "../../customize/components/KitPreview";
import { DEFAULT_COLORS } from "../../customize/constants";
import { DesignPattern } from "../../customize/types";
import { api } from "@/services/apiService";

export function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders()
      .then(res => {
        setOrders(res || []);
        if (res && res.length > 0) {
          setSelectedOrder(res[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch order history:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-white border border-gray-100 rounded-[2rem] p-8 flex items-center justify-center min-h-[300px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#EF892A]"></div>
      </div>
    );
  }

  const getStatusStep = (status: string) => {
    if (status === "DELIVERED") return 3;
    if (status === "SHIPPING" || status === "PRINTING") return 2;
    return 1;
  };

  const activeStep = selectedOrder ? getStatusStep(selectedOrder.orderStatus) : 1;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Order History Panel */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col">
        <h2 className="font-heading text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
          Order History
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 font-semibold border border-dashed rounded-2xl">
            No orders placed yet. Start designing to place your first custom kit order!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const item = order.items?.[0];
              const specs = item?.specifications || {};
              const colors = specs.colors || DEFAULT_COLORS;
              const pattern = specs.pattern || "classic";
              const playerText = specs.playerText || {
                name: "PLAYER",
                number: "00",
                fontFamily: "font-heading",
                fontSize: 24,
                textColor: "#FFFFFF"
              };

              const isSelected = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`flex flex-col md:flex-row items-center justify-between border rounded-2xl p-4 sm:p-5 gap-6 cursor-pointer transition-all ${isSelected ? "bg-orange-50/20 border-[#EF892A]" : "bg-[#F9F9F9] border-gray-100 hover:border-gray-200"
                    }`}
                >
                  {/* Thumbnail */}
                  <div className="bg-white border border-gray-100 rounded-xl p-2.5 flex items-center justify-center w-full md:w-44 h-28 overflow-hidden shadow-3xs flex-shrink-0">
                    <KitPreview
                      colors={colors}
                      pattern={pattern}
                      playerText={playerText}
                      visibleParts={{
                        jerseyBody: true,
                        pantBody: true,
                        collar: true,
                        socks: true,
                        borders: true,
                      }}
                      isThumbnail={true}
                      className="w-full h-full grid grid-cols-4 gap-1.5 bg-transparent border-0 shadow-none p-0 scale-90"
                    />
                  </div>

                  {/* Info Details */}
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-1">
                    <h3 className="font-heading text-sm font-black text-gray-900 uppercase tracking-wide">
                      {item?.product?.name || "EVOLUTION FOOTBALL KIT"}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 mt-1">
                      Material: <span className="text-gray-800 font-bold">{specs.materials?.bodyMaterial || "Premium Wool"}</span>
                    </p>
                    <p className="text-xs font-semibold text-gray-500">
                      Quantity: <span className="text-gray-800 font-bold">{item?.quantity || order.quantity || 10}</span>
                    </p>
                    <p className="text-xs font-semibold text-gray-500">
                      Order ID: <span className="text-gray-800 font-bold font-mono">{order.orderNumber}</span>
                    </p>
                  </div>

                  {/* Right Status / Price Block */}
                  <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
                    <span className={`font-bold text-[10px] tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1 uppercase ${order.orderStatus === "DELIVERED" ? "bg-green-600 text-white" :
                        order.orderStatus === "SHIPPING" ? "bg-blue-600 text-white" :
                          order.orderStatus === "PRINTING" ? "bg-purple-600 text-white" :
                            "bg-yellow-500 text-white"
                      }`}>
                      <Check className="w-3.5 h-3.5" />
                      {order.orderStatus}
                    </span>
                    <span className="font-heading text-sm font-black text-gray-900">
                      {formatCurrency(Number(order.totalAmount))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        /* Check Order Status Panel */
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col">
          <h2 className="font-heading text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
            Track Order Status: <span className="font-mono text-[#EF892A]">{selectedOrder.orderNumber}</span>
          </h2>

          {/* Timeline Status Track */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-2">
            {/* Step 1: Active In Transit */}
            <div className={`flex-1 w-full lg:w-auto flex items-center gap-3.5 border rounded-2xl p-4 shadow-3xs ${activeStep >= 1 ? "bg-[#FFF7ED] border-[#EF892A]" : "bg-[#F9F9F9] border-gray-150"
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activeStep >= 1 ? "bg-[#EF892A] text-white" : "bg-gray-250 text-gray-500"
                }`}>
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs font-black leading-tight ${activeStep >= 1 ? "text-gray-900" : "text-gray-400"}`}>In transit</h4>
                <p className={`text-[10px] font-semibold mt-0.5 ${activeStep >= 1 ? "text-gray-500" : "text-gray-400"}`}>Awaiting pickup</p>
              </div>
            </div>

            {/* Connector Line 1 */}
            <div className="flex lg:flex-col items-center justify-center w-full lg:w-16 h-8 lg:h-auto relative">
              <div className={`w-0.5 lg:w-full h-8 lg:h-0.5 absolute ${activeStep >= 2 ? "bg-[#EF892A]" : "bg-gray-200"}`} />
              <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white relative z-10 flex items-center justify-center ${activeStep >= 2 ? "border-[#EF892A]" : "border-gray-300"
                }`}>
                {activeStep >= 2 && <div className="w-1.5 h-1.5 rounded-full bg-[#EF892A]" />}
              </div>
            </div>

            {/* Step 2: Shipped */}
            <div className={`flex-1 w-full lg:w-auto flex items-center gap-3.5 border rounded-2xl p-4 shadow-3xs ${activeStep >= 2 ? "bg-[#FFF7ED] border-[#EF892A]" : "bg-[#F9F9F9] border-gray-150"
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activeStep >= 2 ? "bg-[#EF892A] text-white" : "bg-gray-200 text-gray-500"
                }`}>
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs font-black leading-tight ${activeStep >= 2 ? "text-gray-900" : "text-gray-400"}`}>Shipped</h4>
                <p className={`text-[10px] font-semibold mt-0.5 ${activeStep >= 2 ? "text-gray-500" : "text-gray-400"}`}>On delivery</p>
              </div>
            </div>

            {/* Connector Line 2 */}
            <div className="flex lg:flex-col items-center justify-center w-full lg:w-16 h-8 lg:h-auto relative">
              <div className={`w-0.5 lg:w-full h-8 lg:h-0.5 absolute ${activeStep >= 3 ? "bg-[#EF892A]" : "bg-gray-200"}`} />
              <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white relative z-10 flex items-center justify-center ${activeStep >= 3 ? "border-[#EF892A]" : "border-gray-300"
                }`}>
                {activeStep >= 3 && <div className="w-1.5 h-1.5 rounded-full bg-[#EF892A]" />}
              </div>
            </div>

            {/* Step 3: Delivered */}
            <div className={`flex-1 w-full lg:w-auto flex items-center gap-3.5 border rounded-2xl p-4 shadow-3xs ${activeStep >= 3 ? "bg-[#FFF7ED] border-[#EF892A]" : "bg-[#F9F9F9] border-gray-150"
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activeStep >= 3 ? "bg-[#EF892A] text-white" : "bg-gray-200 text-gray-500"
                }`}>
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs font-black leading-tight ${activeStep >= 3 ? "text-gray-900" : "text-gray-400"}`}>Delivered</h4>
                <p className={`text-[10px] font-semibold mt-0.5 ${activeStep >= 3 ? "text-gray-500" : "text-gray-400"}`}>Customer received</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
