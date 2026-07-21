"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { mockDb, MockTemplate } from "@/services/mockDb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BasicInfoStep,
  ImagesStep,
  TemplateStep,
  SvgUploadStep,
  LayerMappingStep,
  ConfigStep,
  PricingStep,
  PreviewStep,
  PublishStep
} from "./WizardSteps";

const WIZARD_STEPS = [
  { step: 1, label: "Info" },
  { step: 2, label: "Images" },
  { step: 3, label: "Template" },
  { step: 4, label: "SVG" },
  { step: 5, label: "Layers" },
  { step: 6, label: "Config" },
  { step: 7, label: "Pricing" },
  { step: 8, label: "Preview" },
  { step: 9, label: "Publish" },
];

export function WizardForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [templates, setTemplates] = useState<MockTemplate[]>([]);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "FOOTBALL",
    basePrice: 149.99,
    description: "",
    images: [],
    templateId: "temp-1",
    tempName: "Classic Striped Jersey Template",
    svgUploaded: false,
    svgName: "",
    svgUrl: "",
    uploadId: "",
    layers: [] as any[],
    allowedColors: ["#FF3B30", "#FF9500", "#FFCC00", "#4CD964", "#007AFF", "#000000", "#FFFFFF"],
    defaultFont: "Impact",
    allowLogos: true,
    textUpcharge: 10,
    logoUpcharge: 15,
    bulkDiscount: 12,
    isActive: true,
    isCustomizable: true,
  });

  useEffect(() => {
    mockDb.initialize();
    setTemplates(mockDb.getTemplates());
  }, []);

  const handleFieldChange = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    setError("");
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.name) {
      setError("Product Name is required.");
      return;
    }
    if (currentStep === 3 && !formData.templateId) {
      setError("Please select a canvas template.");
      return;
    }
    if (currentStep === 4 && !formData.svgUploaded) {
      setError("Please upload and analyze an SVG to map vectors.");
      return;
    }
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };

  const handlePublish = async () => {
    try {
      await mockDb.saveProductAsync({
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        basePrice: formData.basePrice,
        description: formData.description,
        images: formData.images,
        isCustomizable: formData.isCustomizable,
        isActive: formData.isActive,
        templateId: formData.templateId,
        svgUrl: formData.svgUrl,
        uploadId: formData.uploadId,
        shapes: formData.layers,
      });
      router.push("/dashboard/products");
    } catch (err: any) {
      setError(err?.message || "Failed to save product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Step Timeline */}
      <div className="relative">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-border -z-10" />
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isActive = s.step === currentStep;
            return (
              <div key={s.step} className="flex flex-col items-center gap-1.5 shrink-0 bg-background px-1">
                <button
                  type="button"
                  onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : isActive 
                        ? "border-primary text-primary bg-primary/5 ring-4 ring-primary/10" 
                        : "border-border text-muted-foreground bg-card"
                  }`}
                  disabled={s.step > currentStep}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : s.step}
                </button>
                <span className={`text-[9px] font-bold select-none hidden md:inline ${
                  isActive ? "text-primary font-black" : "text-muted-foreground/80"
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Message */}
      {error && (
        <div className="p-3 bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-2 border border-rose-200">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Render Steps */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          {currentStep === 1 && <BasicInfoStep formData={formData} onChange={handleFieldChange} />}
          {currentStep === 2 && <ImagesStep formData={formData} onChange={handleFieldChange} />}
          {currentStep === 3 && <TemplateStep formData={formData} onChange={handleFieldChange} templates={templates} />}
          {currentStep === 4 && <SvgUploadStep formData={formData} onChange={handleFieldChange} />}
          {currentStep === 5 && <LayerMappingStep formData={formData} onChange={handleFieldChange} />}
          {currentStep === 6 && <ConfigStep formData={formData} onChange={handleFieldChange} />}
          {currentStep === 7 && <PricingStep formData={formData} onChange={handleFieldChange} />}
          {currentStep === 8 && <PreviewStep formData={formData} onChange={handleFieldChange} />}
          {currentStep === 9 && <PublishStep formData={formData} onChange={handleFieldChange} />}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBack} 
          disabled={currentStep === 1}
          className="h-9 px-4 text-xs font-semibold"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>

        {currentStep === 9 ? (
          <Button 
            onClick={handlePublish}
            size="sm"
            className="h-9 px-5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold"
          >
            Publish Product <Check className="ml-1.5 h-4.5 w-4.5" />
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            size="sm"
            className="h-9 px-5 text-xs font-bold"
          >
            Continue <ChevronRight className="ml-1.5 h-4.5 w-4.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
