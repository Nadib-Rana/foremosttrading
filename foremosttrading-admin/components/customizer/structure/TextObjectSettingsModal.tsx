"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Type, X, Check } from "lucide-react";
import { SvgStructureObject } from "./types";

interface TextObjectSettingsModalProps {
  isOpen: boolean;
  textObj: SvgStructureObject | null;
  onClose: () => void;
  onSave: (updatedObj: SvgStructureObject) => void;
}

export function TextObjectSettingsModal({
  isOpen,
  textObj,
  onClose,
  onSave,
}: TextObjectSettingsModalProps) {
  const [label, setLabel] = useState(textObj?.name || "");
  const [placeholder, setPlaceholder] = useState(textObj?.placeholder || "ENTER TEXT");
  const [maxChars, setMaxChars] = useState(textObj?.maxChars || 20);
  const [minChars, setMinChars] = useState(textObj?.minChars || 1);
  const [isEditable, setIsEditable] = useState(textObj?.isEditable !== false);
  const [isLocked, setIsLocked] = useState(Boolean(textObj?.isLocked));

  if (!isOpen || !textObj) return null;

  const handleSave = () => {
    onSave({
      ...textObj,
      name: label.trim() || textObj.id,
      placeholder: placeholder.trim(),
      maxChars: Number(maxChars),
      minChars: Number(minChars),
      isEditable,
      isLocked,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-sm text-gray-900">Configure Text Object ({textObj.id})</h3>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Display Label</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Player Name, Back Number"
              className="text-xs h-8"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Placeholder Text</label>
            <Input
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="e.g. YOUR NAME"
              className="text-xs h-8"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Min Characters</label>
              <Input
                type="number"
                value={minChars}
                onChange={(e) => setMinChars(parseInt(e.target.value, 10) || 1)}
                className="text-xs h-8"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Max Characters</label>
              <Input
                type="number"
                value={maxChars}
                onChange={(e) => setMaxChars(parseInt(e.target.value, 10) || 20)}
                className="text-xs h-8"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
              <Checkbox checked={isEditable} onCheckedChange={(c) => setIsEditable(Boolean(c))} />
              <span>Allow customer to edit text</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
              <Checkbox checked={isLocked} onCheckedChange={(c) => setIsLocked(Boolean(c))} />
              <span>Lock position & font size</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="h-8 text-xs">
            <Check className="h-3.5 w-3.5 mr-1" /> Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
