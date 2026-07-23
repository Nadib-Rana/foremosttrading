"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Image as ImageIcon, X, Check } from "lucide-react";
import { SvgStructureObject } from "./types";

interface ImageObjectSettingsModalProps {
  isOpen: boolean;
  imageObj: SvgStructureObject | null;
  onClose: () => void;
  onSave: (updatedObj: SvgStructureObject) => void;
}

export function ImageObjectSettingsModal({
  isOpen,
  imageObj,
  onClose,
  onSave,
}: ImageObjectSettingsModalProps) {
  const [label, setLabel] = useState(imageObj?.name || "");
  const [allowedFormats, setAllowedFormats] = useState<string[]>(
    imageObj?.allowedFormats || ["PNG", "SVG", "JPG", "WEBP"]
  );
  const [maxSizeMb, setMaxSizeMb] = useState(
    Math.round((imageObj?.maxSizeBytes || 5242880) / (1024 * 1024))
  );
  const [isEditable, setIsEditable] = useState(imageObj?.isEditable !== false);

  if (!isOpen || !imageObj) return null;

  const toggleFormat = (format: string) => {
    setAllowedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const handleSave = () => {
    onSave({
      ...imageObj,
      name: label.trim() || imageObj.id,
      allowedFormats,
      maxSizeBytes: maxSizeMb * 1024 * 1024,
      isEditable,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-gray-900">Configure Image Placeholder ({imageObj.id})</h3>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Placeholder Display Label</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Sponsor Logo, Chest Badge"
              className="text-xs h-8"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1.5">Allowed Image Formats</label>
            <div className="flex flex-wrap gap-3 p-2 bg-gray-50 rounded-md border border-gray-200">
              {["PNG", "SVG", "JPG", "WEBP"].map((format) => (
                <label key={format} className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-800">
                  <Checkbox
                    checked={allowedFormats.includes(format)}
                    onCheckedChange={() => toggleFormat(format)}
                  />
                  <span>{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Max Upload File Size (MB)</label>
            <Input
              type="number"
              value={maxSizeMb}
              onChange={(e) => setMaxSizeMb(parseInt(e.target.value, 10) || 5)}
              className="text-xs h-8"
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
              <Checkbox checked={isEditable} onCheckedChange={(c) => setIsEditable(Boolean(c))} />
              <span>Allow customer logo replacement</span>
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
