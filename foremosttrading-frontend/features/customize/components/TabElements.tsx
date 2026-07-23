"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle, FileText } from "lucide-react";
import { api } from "@/services/apiService";
import { CustomizerTabFooter } from "./CustomizerTabFooter";

interface TabElementsProps {
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
  uploadedFiles: string[];
  onUploadFile: (url: string) => void;
  versionName: string;
  onVersionNameChange: (name: string) => void;
  imagePlaceholders?: Array<{
    id: string;
    layerName: string;
    allowedFormats?: string[];
    maxSizeBytes?: number;
  }>;
}

export function TabElements({
  onSave,
  onNext,
  isSaved,
  uploadedFiles,
  onUploadFile,
  versionName,
  onVersionNameChange,
  imagePlaceholders = [],
}: TabElementsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await api.uploadFile(file);
      if (url) {
        onUploadFile(url);
      }
    } catch (err) {
      console.error("File upload failed:", err);
      // Fallback file name display if storage endpoint returns local path
      onUploadFile(URL.createObjectURL(file));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1 flex flex-col gap-4">
        {/* Upload Zone matching screenshot */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.svg"
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
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

      <CustomizerTabFooter
        versionName={versionName}
        onVersionNameChange={onVersionNameChange}
        onSave={onSave}
        onNext={onNext}
        isSaved={isSaved}
      />
    </div>
  );
}
