"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderPlus, X, GripHorizontal, Check, Eye } from "lucide-react";
import { CustomizablePart } from "./types";

interface CreateGroupModalProps {
  isOpen: boolean;
  unassignedParts: CustomizablePart[];
  activeSvgClickedId?: string | null;
  onClose: () => void;
  onCreate: (groupName: string, selectedLayerIds: string[]) => void;
  onLiveSelectionChange?: (selectedIds: string[]) => void;
  onHoverLayer?: (layerId: string | null) => void;
}

export function CreateGroupModal({
  isOpen,
  unassignedParts,
  activeSvgClickedId,
  onClose,
  onCreate,
  onLiveSelectionChange,
  onHoverLayer,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Draggable position state
  const [pos, setPos] = useState({ x: 80, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const itemRefs = useRef<Record<string, HTMLLabelElement | null>>({});

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      // Default to right side floating position to keep left SVG canvas 100% visible
      setPos({ x: Math.max(20, window.innerWidth - 480), y: 120 });
    }
  }, [isOpen]);

  // Sync SVG direct clicks -> check modal item & scroll into view
  useEffect(() => {
    if (!isOpen || !activeSvgClickedId) return;
    if (!selectedIds.includes(activeSvgClickedId)) {
      const next = [...selectedIds, activeSvgClickedId];
      setSelectedIds(next);
      if (onLiveSelectionChange) onLiveSelectionChange(next);
    }
    const targetEl = itemRefs.current[activeSvgClickedId];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeSvgClickedId, isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(next);
    if (onLiveSelectionChange) {
      onLiveSelectionChange(next);
    }
  };

  const handleCreate = () => {
    if (!groupName.trim() || selectedIds.length === 0) return;
    onCreate(groupName.trim(), selectedIds);
    setGroupName("");
    setSelectedIds([]);
    if (onLiveSelectionChange) onLiveSelectionChange([]);
    onClose();
  };

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: pos.x,
      posY: pos.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPos({
      x: Math.max(10, dragStartRef.current.posX + dx),
      y: Math.max(10, dragStartRef.current.posY + dy),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      <div
        style={{ left: pos.x, top: pos.y }}
        className="absolute w-full max-w-sm bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 pointer-events-auto overflow-hidden transition-shadow"
      >
        {/* Draggable Header */}
        <div
          onMouseDown={handleMouseDown}
          className="flex items-center justify-between px-3.5 py-2.5 bg-gray-900 text-white cursor-move select-none"
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="h-4 w-4 text-gray-400" />
            <FolderPlus className="h-4 w-4 text-blue-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">
              Create Layer Group
            </h3>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => {
              if (onLiveSelectionChange) onLiveSelectionChange([]);
              onClose();
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-3.5 space-y-3">
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 block mb-1">
              Group Name *
            </label>
            <Input
              placeholder="e.g. Body, Sleeves, Collar, Logo"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="text-xs h-8 bg-white border-gray-200"
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600">
                Select Layers ({selectedIds.length})
              </label>
              <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                <Eye className="h-3 w-3" /> Live Canvas Preview
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-1.5 space-y-1 bg-gray-50/50 custom-scrollbar">
              {unassignedParts.length === 0 ? (
                <div className="text-xs text-gray-400 italic text-center py-2">
                  All detected layers are assigned to groups.
                </div>
              ) : (
                unassignedParts.map((part) => {
                  const isChecked = selectedIds.includes(part.id);
                  return (
                    <label
                      key={part.id}
                      ref={(el) => { itemRefs.current[part.id] = el; }}
                      onMouseEnter={() => onHoverLayer && onHoverLayer(part.id)}
                      onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
                      className={`flex items-center justify-between p-1.5 rounded-md cursor-pointer text-xs font-medium transition-colors ${
                        isChecked
                          ? "bg-blue-50 border border-blue-200 text-blue-900 font-semibold"
                          : "hover:bg-white text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSelect(part.id)}
                        />
                        <span className="truncate">{part.label || part.id}</span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Live Group Summary */}
          {selectedIds.length > 0 && (
            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs space-y-1">
              <div className="font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                Summary: {groupName || "Untitled Group"} ({selectedIds.length} layers)
              </div>
              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                {selectedIds.map((id) => {
                  const label = unassignedParts.find((p) => p.id === id)?.label || id;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs"
                    >
                      <Check className="h-2.5 w-2.5 text-blue-600" /> {label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-3.5 py-2.5 border-t border-gray-100 bg-gray-50/80">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onLiveSelectionChange) onLiveSelectionChange([]);
              onClose();
            }}
            className="h-8 text-xs bg-white"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedIds.length === 0}
            className="h-8 text-xs font-semibold"
          >
            <Check className="h-3.5 w-3.5 mr-1" /> Create Group
          </Button>
        </div>
      </div>
    </div>
  );
}

