"use client";

import { useState, use, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Droplet, 
  Shapes, 
  Type,
  Upload,
  Type as TypeIcon,
  Trash2,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BodyShape3D } from "@/components/customizer/BodyShape3D";
import { ProductCanvas, ProductCanvasRef } from "@/components/customizer/ProductCanvas";

const tabs = [
  { id: "body", label: "Body Shape", icon: Palette },
  { id: "colors", label: "Colors", icon: Droplet },
  { id: "elements", label: "Elements", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
];

const PRESET_COLORS = [
  "transparent",
  "#FF3B30", "#FF9500", "#FFCC00", "#4CD964", 
  "#5AC8FA", "#007AFF", "#5856D6", "#FF2D55", 
  "#000000", "#555555"
];

export default function CustomizerEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState("body");
  const [selectedShape, setSelectedShape] = useState("Full Body");
  const [tintColor, setTintColor] = useState("transparent");
  const [customShapes, setCustomShapes] = useState<Record<string, string>>({});
  
  // Text state
  const [textInput, setTextInput] = useState("TEAM NAME");
  const [textColor, setTextColor] = useState("#000000");

  const canvasRef = useRef<ProductCanvasRef>(null);
  
  const handleAddText = () => {
    if (canvasRef.current) {
      canvasRef.current.addText(textInput, { fill: textColor });
    }
  };

  const handleCustomShapeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomShapes(prev => ({
        ...prev,
        [selectedShape]: url
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvasRef.current) {
      const url = URL.createObjectURL(file);
      canvasRef.current.addImage(url);
    }
  };

  const handleDelete = () => {
    if (canvasRef.current) {
      canvasRef.current.deleteSelected();
    }
  };

  const handleSaveDesign = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.saveCanvas();
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `design-${selectedShape.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f5f7] overflow-hidden -m-8">
      {/* Header */}
      <div className="absolute top-4 left-8 z-10">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight">Evolution Football Kit</h1>
        <p className="font-semibold text-lg">$199 - $699</p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full h-full p-8 pt-24 gap-6">
        
        {/* Left Pane: Preview Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="relative w-full h-full min-h-[500px]">
             <div className="absolute inset-0 bg-gray-50/50 rounded-lg overflow-hidden flex flex-col">
                {/* Delete Tool overlay */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleDelete} className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600 shadow-sm border-gray-200">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <ProductCanvas 
                  ref={canvasRef} 
                  shapeName={selectedShape} 
                  tintColor={tintColor} 
                  customShapeUrl={customShapes[selectedShape]}
                />
             </div>
          </div>
        </div>

        {/* Right Pane: Controls */}
        <div className="w-[400px] flex flex-col gap-4">
          <Card className="flex-1 border-gray-100 shadow-sm flex flex-col overflow-hidden bg-white">
            <CardContent className="p-4 flex flex-col h-full gap-4">
              
              {/* Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex flex-col items-center justify-center py-3 rounded-lg border transition-all text-xs font-medium gap-1.5",
                        isActive 
                          ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* BODY SHAPE TAB */}
                {activeTab === "body" && (
                  <div className="flex flex-col gap-4 pb-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Full Body", 
                        "Full Hand & Body", 
                        "Half Body (Full Hand)", 
                        "Half Body (Half Hand)", 
                        "Legs",
                        "Full Pant",
                        "Half Shirt & Full Pant",
                        "Full Shirt & Pant",
                        "Others"
                      ].map((shapeName, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedShape(shapeName)}
                          className={cn(
                            "relative aspect-square rounded-lg border-2 cursor-pointer overflow-hidden transition-all shadow-sm flex items-center justify-center group",
                            selectedShape === shapeName 
                              ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20" 
                              : "border-gray-100 bg-gray-50 hover:border-blue-400"
                          )}
                        >
                          <div className="absolute inset-0 pb-6 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                            <BodyShape3D shapeName={shapeName} interactive={false} customShapeUrl={customShapes[shapeName]} />
                          </div>
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                          <span className="absolute bottom-2 inset-x-2 text-center text-[11px] font-bold text-gray-800 bg-white/90 px-1.5 py-1 rounded shadow-sm">
                            {shapeName}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex flex-col gap-2 border-t pt-4 border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm">Custom Shape Image</h3>
                      <p className="text-xs text-gray-500">Upload a custom transparent PNG to replace the base image for <strong>{selectedShape}</strong>.</p>
                      <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-semibold text-gray-600"><Upload className="w-4 h-4 inline mr-2 mb-1" />Upload Custom Base</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/png, image/jpeg, image/svg+xml"
                          onChange={handleCustomShapeUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* COLORS TAB */}
                {activeTab === "colors" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-800">Base Color</h3>
                    <p className="text-xs text-gray-500 mb-2">Select a tint color for the clothing.</p>
                    <div className="grid grid-cols-5 gap-3">
                      {PRESET_COLORS.map((color, i) => (
                        <div 
                          key={i}
                          onClick={() => setTintColor(color)}
                          className={cn(
                            "w-full aspect-square rounded-full cursor-pointer shadow-sm border-2 transition-transform hover:scale-110 flex items-center justify-center relative",
                            tintColor === color ? "border-blue-600" : "border-gray-200"
                          )}
                          style={{ backgroundColor: color === 'transparent' ? '#ffffff' : color }}
                        >
                          {color === 'transparent' && (
                            <span className="absolute text-[10px] text-gray-400 font-medium">None</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ELEMENTS TAB */}
                {activeTab === "elements" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-800">Custom Graphics</h3>
                    <p className="text-xs text-gray-500 mb-2">Upload your logo or graphics to place on the product.</p>
                    
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-gray-400">PNG, JPG, SVG (MAX. 5MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleImageUpload}
                      />
                    </label>

                    <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
                      <strong>Pro tip:</strong> After adding an element, you can drag, resize, and rotate it directly on the 3D canvas! Select it and press Backspace to delete.
                    </div>
                  </div>
                )}

                {/* TEXT TAB */}
                {activeTab === "text" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-800">Add Text</h3>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Text Content</label>
                        <input 
                          type="text" 
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter text..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Text Color</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={textColor}
                            onChange={(e) => {
                              setTextColor(e.target.value);
                              if (canvasRef.current) canvasRef.current.updateSelectedColor(e.target.value);
                            }}
                            className="h-10 w-16 border-0 p-0 rounded cursor-pointer"
                          />
                          <Button 
                            className="flex-1 bg-black text-white hover:bg-gray-800"
                            onClick={handleAddText}
                          >
                            <TypeIcon className="w-4 h-4 mr-2" /> Add to Canvas
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
                      <strong>Pro tip:</strong> Double-click the text on the canvas to edit it directly! Drag corners to resize, and use the top handle to rotate.
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bottom Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-100 rounded-lg px-4 flex items-center justify-between text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors">
                    Player version 1
                  </div>
                  <Button 
                    className="bg-black hover:bg-gray-900 text-white rounded-lg px-6 shadow-md font-semibold"
                    onClick={handleSaveDesign}
                  >
                    <Download className="w-4 h-4 mr-2" /> Save Design
                  </Button>
                </div>
                <Button className="w-full bg-[#f48a27] hover:bg-[#e07b20] text-white rounded-lg h-12 text-md font-bold shadow-md">
                  Select Materials
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
