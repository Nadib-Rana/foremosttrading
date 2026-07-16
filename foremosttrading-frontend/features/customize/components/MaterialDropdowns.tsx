"use client";

import { ChevronDown } from "lucide-react";

interface MaterialDropdownsProps {
  frontClosure: string;
  onChangeFrontClosure: (val: string) => void;
  bodyMaterial: string;
  onChangeBodyMaterial: (val: string) => void;
  sleevesMaterial: string;
  onChangeSleevesMaterial: (val: string) => void;
}

export function MaterialDropdowns({
  frontClosure,
  onChangeFrontClosure,
  bodyMaterial,
  onChangeBodyMaterial,
  sleevesMaterial,
  onChangeSleevesMaterial,
}: MaterialDropdownsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Front Closure */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-500 block">
          Front Clossure
        </label>
        <div className="relative">
          <select
            value={frontClosure}
            onChange={(e) => onChangeFrontClosure(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs appearance-none cursor-pointer"
          >
            <option value="Button">Button</option>
            <option value="Zipper">Zipper</option>
            <option value="Snaps">Snaps</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Body Material */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-500 block">
          Body Material
        </label>
        <div className="relative">
          <select
            value={bodyMaterial}
            onChange={(e) => onChangeBodyMaterial(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs appearance-none cursor-pointer"
          >
            <option value="Wool">Wool</option>
            <option value="Satin">Satin</option>
            <option value="Leather">Leather</option>
            <option value="Cotton">Cotton</option>
            <option value="Fleece">Fleece</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Sleeves Material */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-500 block">
          Sleeves Material
        </label>
        <div className="relative border-b border-gray-100 pb-6">
          <select
            value={sleevesMaterial}
            onChange={(e) => onChangeSleevesMaterial(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs appearance-none cursor-pointer"
          >
            <option value="Cow Hide Leather">Cow Hide Leather</option>
            <option value="Satin">Satin</option>
            <option value="Wool">Wool</option>
            <option value="PU Leather">PU Leather</option>
            <option value="Polyester">Polyester</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
