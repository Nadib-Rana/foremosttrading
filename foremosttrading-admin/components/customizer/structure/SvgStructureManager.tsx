"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Layers,
  Type,
  Image as ImageIcon,
  Settings2,
  SlidersHorizontal,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  FolderTree,
  CheckCircle2,
} from "lucide-react";
import { SvgStructureObject } from "./types";
import { TextObjectSettingsModal } from "./TextObjectSettingsModal";
import { ImageObjectSettingsModal } from "./ImageObjectSettingsModal";

interface SvgStructureManagerProps {
  objects: SvgStructureObject[];
  onUpdateObject: (updatedObj: SvgStructureObject) => void;
  onSelectObject?: (objId: string, isMulti?: boolean) => void;
  onSelectAllObjects?: (objectIds: string[]) => void;
  onClearSelection?: () => void;
  onColorChange?: (objId: string, color: string) => void;
  selectedObjectIds?: string[];
  onToggleLock?: (objId: string) => void;
  onToggleVisibility?: (objId: string) => void;
}

export function SvgStructureManager({
  objects,
  onUpdateObject,
  onSelectObject,
  onSelectAllObjects,
  onClearSelection,
  onColorChange,
  selectedObjectIds = [],
  onToggleLock,
  onToggleVisibility,
}: SvgStructureManagerProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "TEXT" | "IMAGE" | "LAYERS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTextObj, setEditingTextObj] = useState<SvgStructureObject | null>(null);
  const [editingImageObj, setEditingImageObj] = useState<SvgStructureObject | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const colorInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset page to 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  // Auto-scroll selected layer row into view inside SvgStructureManager
  useEffect(() => {
    if (selectedObjectIds.length > 0) {
      const lastSelectedId = selectedObjectIds[selectedObjectIds.length - 1];
      const targetEl = itemRefs.current[lastSelectedId];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedObjectIds]);

  const filteredObjects = objects.filter((obj) => {
    const matchesSearch =
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === "TEXT") {
      const lower = (obj.id + " " + obj.name).toLowerCase();
      return obj.type === "TEXT" || lower.includes("text") || lower.includes("name") || lower.includes("number") || lower.includes("player");
    }
    if (activeFilter === "IMAGE") {
      const lower = (obj.id + " " + obj.name).toLowerCase();
      return obj.type === "IMAGE" || lower.includes("image") || lower.includes("logo") || lower.includes("badge");
    }
    if (activeFilter === "LAYERS") return obj.type === "FILL" || obj.type === "STROKE" || obj.type === "GROUP";
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredObjects.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedObjects = filteredObjects.slice(startIndex, startIndex + pageSize);

  const handleSelectAll = () => {
    if (onSelectAllObjects) {
      const idsToSelect = filteredObjects.map((o) => o.id);
      onSelectAllObjects(idsToSelect);
    }
  };

  const textCount = objects.filter((o) => {
    const lower = (o.id + " " + o.name).toLowerCase();
    return o.type === "TEXT" || lower.includes("text") || lower.includes("name") || lower.includes("number") || lower.includes("player");
  }).length;
  const imageCount = objects.filter((o) => {
    const lower = (o.id + " " + o.name).toLowerCase();
    return o.type === "IMAGE" || lower.includes("image") || lower.includes("logo") || lower.includes("badge");
  }).length;
  const layerCount = objects.filter((o) => o.type === "FILL" || o.type === "STROKE" || o.type === "GROUP").length;

  return (
    <div className="space-y-3 bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
      {/* Header & Selection Actions */}
      <div className="flex flex-col gap-2 pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <FolderTree className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-tight text-gray-900 truncate">
              SVG Structure ({objects.length})
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2 py-0.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
              title="Select all filtered layers"
            >
              Select All
            </button>
            {selectedObjectIds.length > 0 && (
              <button
                type="button"
                onClick={onClearSelection}
                className="px-2 py-0.5 text-[11px] font-semibold text-gray-500 hover:bg-gray-100 rounded transition-colors"
                title="Clear layer selection"
              >
                Clear ({selectedObjectIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold overflow-x-auto">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeFilter === "ALL" ? "bg-white text-gray-900 shadow-3xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({objects.length})
          </button>
          <button
            onClick={() => setActiveFilter("TEXT")}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeFilter === "TEXT" ? "bg-white text-blue-600 shadow-3xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Type className="h-3 w-3" /> Text ({textCount})
          </button>
          <button
            onClick={() => setActiveFilter("IMAGE")}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeFilter === "IMAGE" ? "bg-white text-emerald-600 shadow-3xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ImageIcon className="h-3 w-3" /> Images ({imageCount})
          </button>
          <button
            onClick={() => setActiveFilter("LAYERS")}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeFilter === "LAYERS" ? "bg-white text-gray-900 shadow-3xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Layers className="h-3 w-3" /> Shapes ({layerCount})
          </button>
        </div>
      </div>

      {/* Search & Page Size Bar */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search layers by name or elementId…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs pl-8 h-8 bg-gray-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 text-[10px] text-gray-400 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="h-8 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-700 px-1 font-medium cursor-pointer"
          title="Items per page"
        >
          <option value={15}>15/pg</option>
          <option value={25}>25/pg</option>
          <option value={50}>50/pg</option>
          <option value={100}>100/pg</option>
        </select>
      </div>

      {/* Object List */}
      <div ref={containerRef} className="max-h-72 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
        {paginatedObjects.length === 0 ? (
          <div className="text-xs text-gray-400 italic text-center py-6">No matching SVG layers found</div>
        ) : (
          paginatedObjects.map((obj) => {
            const isSelected = selectedObjectIds.includes(obj.id);
            const layerColor = obj.color || "#FFFFFF";

            return (
              <div
                key={obj.id}
                ref={(el) => {
                  itemRefs.current[obj.id] = el;
                }}
                onClick={(e) => {
                  const isMulti = e.ctrlKey || e.metaKey;
                  onSelectObject && onSelectObject(obj.id, isMulti);
                }}
                className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition-all ${
                  isSelected
                    ? "bg-blue-50/90 border-blue-400 text-blue-900 font-semibold shadow-2xs border-l-4 border-l-blue-600"
                    : "bg-white border-gray-100 hover:bg-gray-50 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Layer Color Badge (Click to Recolor) */}
                  <div className="relative shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <span
                      onClick={() => colorInputRefs.current[obj.id]?.click()}
                      className="w-4 h-4 rounded-full border border-black/30 shrink-0 shadow-xs cursor-pointer hover:scale-110 transition-transform block"
                      style={{ backgroundColor: layerColor }}
                      title={`Recolor #${obj.id} (Current: ${layerColor})`}
                    />
                    {onColorChange && (
                      <input
                        ref={(el) => { colorInputRefs.current[obj.id] = el; }}
                        type="color"
                        value={layerColor}
                        onChange={(e) => onColorChange(obj.id, e.target.value)}
                        className="sr-only"
                      />
                    )}
                  </div>

                  {obj.type === "TEXT" && <Type className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />}
                  {obj.type === "IMAGE" && <ImageIcon className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />}
                  {obj.type === "GROUP" && <FolderTree className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />}
                  {(obj.type === "FILL" || obj.type === "STROKE") && (
                    <Layers className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  )}

                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium leading-tight">{obj.name || obj.id}</span>
                    <span className="text-[9px] font-mono text-gray-400 leading-none mt-0.5">#{obj.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  {/* Visibility Toggle */}
                  {onToggleVisibility && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 ${obj.isHidden ? "text-gray-400 hover:bg-gray-100" : "text-blue-600 hover:bg-blue-50"}`}
                      onClick={() => onToggleVisibility(obj.id)}
                      title={obj.isHidden ? "Show Layer on Canvas" : "Hide Layer on Canvas"}
                    >
                      {obj.isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  )}

                  {/* Lock Toggle */}
                  {onToggleLock && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 ${obj.isLocked ? "text-amber-600 hover:bg-amber-50" : "text-gray-400 hover:bg-gray-100"}`}
                      onClick={() => onToggleLock(obj.id)}
                      title={obj.isLocked ? "Unlock Layer" : "Lock Layer"}
                    >
                      {obj.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                    </Button>
                  )}

                  {/* Text Settings */}
                  {obj.type === "TEXT" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-blue-600 hover:bg-blue-100"
                      onClick={() => setEditingTextObj(obj)}
                      title="Configure Text Settings"
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  {/* Image Settings */}
                  {obj.type === "IMAGE" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-emerald-600 hover:bg-emerald-100"
                      onClick={() => setEditingImageObj(obj)}
                      title="Configure Image Placeholder"
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <span className="text-[11px] text-gray-500 font-medium">
            {startIndex + 1}–{Math.min(startIndex + pageSize, filteredObjects.length)} of {filteredObjects.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-6 px-2 text-[11px]"
            >
              Prev
            </Button>
            <span className="text-[11px] font-bold text-gray-700 px-1">
              {validPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-6 px-2 text-[11px]"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Configuration Modals */}
      <TextObjectSettingsModal
        isOpen={Boolean(editingTextObj)}
        textObj={editingTextObj}
        onClose={() => setEditingTextObj(null)}
        onSave={onUpdateObject}
      />

      <ImageObjectSettingsModal
        isOpen={Boolean(editingImageObj)}
        imageObj={editingImageObj}
        onClose={() => setEditingImageObj(null)}
        onSave={onUpdateObject}
      />
    </div>
  );
}

