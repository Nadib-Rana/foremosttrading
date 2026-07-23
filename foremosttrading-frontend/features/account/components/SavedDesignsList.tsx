"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { KitPreview } from "../../customize/components/KitPreview";
import { DEFAULT_COLORS } from "../../customize/constants";
import { DesignPattern } from "../../customize/types";
import { api } from "@/services/apiService";

export function SavedDesignsList() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSavedDesigns?.()
      .then((res: any) => {
        setDesigns(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleEdit = (id: string) => {
    window.location.href = `/customize?designId=${id}`;
  };

  const handleCheckout = (id: string) => {
    window.location.href = `/checkout?designId=${id}`;
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSavedDesign?.(id);
      setDesigns((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      alert("Failed to delete design");
    }
  };

  return (
    <div className="flex-1 bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col select-none">
      {/* Title */}
      <h2 className="font-heading text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
        Saved Designs
      </h2>

      {/* Designs List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#EF892A]" />
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-12 text-xs text-gray-500 font-semibold border border-dashed rounded-2xl">
          No saved custom designs found yet. Customize a kit to save your design!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {designs.map((design) => (
            <div
              key={design.id}
              className="flex flex-col sm:flex-row items-center justify-between bg-[#F9F9F9] border border-gray-50 rounded-2xl p-4 sm:p-5 gap-6"
            >
              {/* Visualizer Thumbnail */}
              <div className="bg-white border border-gray-100 rounded-xl p-2.5 flex items-center justify-center w-full sm:w-44 h-28 overflow-hidden shadow-3xs flex-shrink-0">
                <KitPreview
                  colors={design.colors}
                  pattern={design.pattern}
                  playerText={design.playerText}
                  visibleParts={design.visibleParts}
                  isThumbnail={true}
                  className="w-full h-full grid grid-cols-4 gap-1.5 bg-transparent border-0 shadow-none p-0 scale-90"
                />
              </div>

              {/* Design Info */}
              <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                <h3 className="font-heading text-sm font-black text-gray-900 leading-tight">
                  {design.title}
                </h3>
                <span className="text-xs font-bold text-gray-500 mb-2.5">
                  ${design.price}
                </span>
                <Button
                  variant="default"
                  onClick={() => handleEdit(design.id)}
                  className="bg-black hover:bg-neutral-800 text-white font-bold py-4 px-5 rounded-lg text-[10px] tracking-wide cursor-pointer transition-colors border-0 h-auto"
                >
                  Edit Design
                </Button>
              </div>

              {/* Action Buttons Stack */}
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto items-stretch">
                <Button
                  variant="default"
                  onClick={() => handleCheckout(design.id)}
                  className="flex-1 sm:flex-none bg-[#EF892A] hover:bg-[#D97310] text-white font-bold py-4 px-6 rounded-lg text-[10px] tracking-wide cursor-pointer transition-colors border-0 h-auto text-center"
                >
                  Checkout
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleDelete(design.id)}
                  className="flex-1 sm:flex-none bg-[#EF4444] hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg text-[10px] tracking-wide cursor-pointer transition-colors border-0 h-auto text-center"
                >
                  Delate
                </Button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
