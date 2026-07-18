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
}

export function TabElements({
  onSave,
  onNext,
  isSaved,
  uploadedFiles,
  onUploadFile,
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
      <div className="pt-4 flex flex-col gap-3 mt-auto bg-gray-50 sticky bottom-0 z-20 flex-shrink-0">
        <div className="flex gap-3 items-stretch">
          <div className="flex-1 h-11 flex items-center px-4 bg-[#E2E8F0] rounded-lg text-xs font-bold text-gray-700 select-none">
            {isSaved ? "Saved Successfully!" : "Player version 1"}
          </div>
          <Button
            onClick={onSave}
            className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase h-11 px-5 rounded-lg border-0 cursor-pointer flex-shrink-0"
          >
            {isSaved ? "Saved!" : "Save Design"}
          </Button>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-[#EF892A] hover:bg-[#EA580C] text-white h-11 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm rounded-lg border-0 flex items-center justify-center"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
