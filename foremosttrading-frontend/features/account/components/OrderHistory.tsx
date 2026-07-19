"use client";

import { Check, Truck, Package, Box } from "lucide-react";
import { KitPreview } from "../../customize/components/KitPreview";
import { DEFAULT_COLORS } from "../../customize/constants";
import { DesignPattern } from "../../customize/types";

export function OrderHistory() {
  const mockOrder = {
    id: "22545481112254",
    title: "EVOLUTION FOOTBALL KIT",
    designName: "Player version 1",
    quantity: 10,
    price: 700.00,
    colors: DEFAULT_COLORS,
    pattern: "classic" as DesignPattern,
    playerText: {
      name: "RODRO KHAN",
      number: "07",
      fontFamily: "font-heading",
      fontSize: 24,
      textColor: "#FFFFFF",
    },
    visibleParts: {
      jerseyBody: true,
      pantBody: true,
      collar: true,
      socks: true,
      borders: true,
    },
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Order History Panel */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col">
        <h2 className="font-heading text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
          Order History
        </h2>

        {/* Order Card Item */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#F9F9F9] border border-gray-50 rounded-2xl p-4 sm:p-5 gap-6">
          {/* Thumbnail */}
          <div className="bg-white border border-gray-100 rounded-xl p-2.5 flex items-center justify-center w-full md:w-44 h-28 overflow-hidden shadow-3xs flex-shrink-0">
            <KitPreview
              colors={mockOrder.colors}
              pattern={mockOrder.pattern}
              playerText={mockOrder.playerText}
              visibleParts={mockOrder.visibleParts}
              isThumbnail={true}
              className="w-full h-full grid grid-cols-4 gap-1.5 bg-transparent border-0 shadow-none p-0 scale-90"
            />
          </div>

          {/* Info Details */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h3 className="font-heading text-sm font-black text-gray-900 uppercase tracking-wide">
              {mockOrder.title}
            </h3>
            <p className="text-xs font-semibold text-gray-500 mt-1">
              Design Name: <span className="text-gray-800 font-bold">{mockOrder.designName}</span>
            </p>
            <p className="text-xs font-semibold text-gray-500">
              Quantity: <span className="text-gray-800 font-bold">{mockOrder.quantity}</span>
            </p>
            <p className="text-xs font-semibold text-gray-500">
              Order ID: <span className="text-gray-800 font-bold">{mockOrder.id}</span>
            </p>
          </div>

          {/* Right Status / Price Block */}
          <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
            <span className="bg-[#10B981] text-white font-bold text-[10px] tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Delivered
            </span>
            <span className="font-heading text-sm font-black text-gray-900">
              ${mockOrder.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Check Order Status Panel */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col">
        <h2 className="font-heading text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
          Check Order Status
        </h2>

        {/* Timeline Status Track */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-2">
          {/* Step 1: Active In Transit */}
          <div className="flex-1 w-full lg:w-auto flex items-center gap-3.5 bg-[#FFF7ED] border border-[#EF892A] rounded-2xl p-4 shadow-3xs">
            <div className="w-10 h-10 rounded-xl bg-[#EF892A] flex items-center justify-center text-white flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900 leading-tight">In transit</h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Awaiting pickup</p>
            </div>
          </div>

          {/* Connector Line 1 */}
          <div className="flex lg:flex-col items-center justify-center w-full lg:w-16 h-8 lg:h-auto relative">
            <div className="w-0.5 lg:w-full h-8 lg:h-0.5 bg-[#EF892A] absolute" />
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#EF892A] bg-white relative z-10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EF892A]" />
            </div>
          </div>

          {/* Step 2: Inactive Shipped */}
          <div className="flex-1 w-full lg:w-auto flex items-center gap-3.5 bg-[#F9F9F9] border border-gray-150 rounded-2xl p-4 shadow-3xs">
            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-400 leading-tight">Shipped</h4>
              <p className="text-[10px] font-semibold text-gray-400 mt-0.5">On delivery</p>
            </div>
          </div>

          {/* Connector Line 2 */}
          <div className="flex lg:flex-col items-center justify-center w-full lg:w-16 h-8 lg:h-auto relative">
            <div className="w-0.5 lg:w-full h-8 lg:h-0.5 bg-gray-200 absolute" />
          </div>

          {/* Step 3: Inactive Delivered */}
          <div className="flex-1 w-full lg:w-auto flex items-center gap-3.5 bg-[#F9F9F9] border border-gray-150 rounded-2xl p-4 shadow-3xs">
            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-400 leading-tight">Delivered</h4>
              <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Customer received</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
