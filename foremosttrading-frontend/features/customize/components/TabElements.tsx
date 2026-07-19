"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabElementsProps {
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
  uploadedFiles: string[];
  onUploadFile: (url: string) => void;
  versionName: string;
  onVersionNameChange: (name: string) => void;
}

export function TabElements({
  onSave,
  onNext,
  isSaved,
  uploadedFiles,
  onUploadFile,
  versionName,
  onVersionNameChange,
}: TabElementsProps) {
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onUploadFile(`Logo-${uploadedFiles.length + 1}.png`);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1 flex flex-col gap-4">
        {/* Upload Zone matching screenshot */}
        <div
          onClick={simulateUpload}
          className={`h-48 border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl bg-white flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${isUploading ? "opacity-70 pointer-events-none" : ""
            }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Uploading Badge...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center select-none">
              <UploadCloud className="w-8 h-8 text-gray-400" />
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Upload drag badges here
              </p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">
                (front, back, left, right)
              </p>
            </div>
          )}
        </div>

        {/* Uploaded Files list */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              Placed Badge Items
            </span>
            <div className="flex flex-col gap-1.5">
              {uploadedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 uppercase"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{file}</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-0 z-20 mt-auto bg-gray-50 pt-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={versionName}
            onChange={(e) => onVersionNameChange(e.target.value)}
            placeholder="Version Name"
            className="
        min-w-0
        flex-1
        h-11
        sm:h-12
        w-full
        rounded-lg
        border-0
        bg-[#E2E8F0]
        px-4
        text-sm
        sm:text-sm
        font-semibold
        text-gray-700
        placeholder:text-gray-500
        focus:outline-none
        focus:ring-2
        focus:ring-orange-400
      "
          />

          <Button
            onClick={onSave}
            className="
        h-11
        sm:h-12
        w-full
        sm:w-auto
        sm:min-w-[140px]
        px-5
        rounded-lg
        bg-black
        text-white
        text-sm
        font-bold
        uppercase
        hover:bg-neutral-800
        flex-shrink-0
      "
          >
            {isSaved ? "Saved!" : "Save Design"}
          </Button>
        </div>

        <Button
          onClick={onNext}
          className="
      mt-3
      h-11
      sm:h-12
      w-full
      rounded-lg
      bg-[#EF892A]
      text-white
      text-sm
      sm:text-base
      font-bold
      uppercase
      tracking-wide
      shadow-sm
      hover:bg-[#EA580C]
    "
        >
          Next
        </Button>
      </div>
    </div>
  );
}
