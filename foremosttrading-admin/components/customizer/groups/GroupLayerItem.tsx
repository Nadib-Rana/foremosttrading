"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit3, Check, Trash2 } from "lucide-react";
import { GroupLayer } from "./types";

interface GroupLayerItemProps {
  layer: GroupLayer;
  color?: string;
  isSelected: boolean;
  onSelect: (layerId: string) => void;
  onRename: (layerId: string, newName: string) => void;
  onRemove: (layerId: string) => void;
}

export function GroupLayerItem({
  layer,
  color = "#FFFFFF",
  isSelected,
  onSelect,
  onRename,
  onRemove,
}: GroupLayerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(layer.displayLabel || layer.id);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onRename(layer.id, nameInput.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => onSelect(layer.id)}
      className={`flex items-center justify-between p-2 pl-6 text-xs rounded-md transition-colors cursor-pointer border ${
        isSelected ? "bg-blue-50/80 border-blue-200 text-blue-900 font-semibold" : "bg-white border-transparent hover:bg-gray-50 text-gray-700"
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(layer.id)}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="w-4 h-4 rounded border border-gray-300 shadow-2xs flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1 max-w-[160px]" onClick={(e) => e.stopPropagation()}>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="h-6 text-xs px-1.5 py-0"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
            />
            <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-600" onClick={handleSaveName}>
              <Check className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <span className="truncate font-medium text-gray-800">{layer.displayLabel || layer.id}</span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-80 hover:opacity-100" onClick={(e) => e.stopPropagation()}>
        {!isEditing && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-gray-400 hover:text-gray-700"
            onClick={() => setIsEditing(true)}
            title="Rename Layer"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-gray-400 hover:text-red-600"
          onClick={() => onRemove(layer.id)}
          title="Remove from group"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
