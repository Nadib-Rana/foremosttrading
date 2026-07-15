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
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-4 overflow-y-auto mb-6">
        {/* Upload Zone matching screenshot */}
        <div
          onClick={simulateUpload}
          className={`h-48 border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl bg-white flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
            isUploading ? "opacity-70 pointer-events-none" : ""
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
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {isSaved ? "Saved Design Successfully!" : "Player version 1"}
          </span>
          <Button
            variant="outline"
            onClick={onSave}
            className="border-gray-200 hover:bg-gray-100 font-bold text-xs uppercase"
          >
            {isSaved ? "Saved!" : "Save Design"}
          </Button>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-6 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm rounded-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
