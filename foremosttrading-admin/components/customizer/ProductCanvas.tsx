"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { fabric } from "fabric";

export interface ProductCanvasRef {
  addText: (text: string, options?: fabric.ITextOptions) => void;
  addImage: (url: string) => void;
  updateSelectedColor: (color: string) => void;
  updateSelectedFont: (fontFamily: string) => void;
  deleteSelected: () => void;
  saveCanvas: () => string;
}

interface ProductCanvasProps {
  shapeName: string;
  tintColor: string;
  customShapeUrl?: string;
}

const shapeImageMap: Record<string, string> = {
  "Full Body": "/shapes/cloth-full-body.png",
  "Full Hand & Body": "/shapes/cloth-full-hand-body.png",
  "Half Body (Full Hand)": "/shapes/cloth-half-body-full-hand.png",
  "Half Body (Half Hand)": "/shapes/cloth-half-body-half-hand.png",
  "Legs": "/shapes/cloth-legs.png",
  "Full Pant": "/shapes/cloth-full-pant.png",
  "Half Shirt & Full Pant": "/shapes/cloth-half-shirt-full-pant.png",
  "Full Shirt & Pant": "/shapes/cloth-full-shirt-full-pant.png",
  "Others": "/shapes/cloth-others.png",
};

export const ProductCanvas = forwardRef<ProductCanvasRef, ProductCanvasProps>(
  ({ shapeName, tintColor, customShapeUrl }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize Fabric Canvas
    useEffect(() => {
      if (canvasRef.current && containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: clientWidth,
          height: clientHeight,
          preserveObjectStacking: true,
        });
        fabricCanvasRef.current = canvas;

        // Cleanup on unmount
        return () => {
          canvas.dispose();
          fabricCanvasRef.current = null;
        };
      }
    }, []);

    // Handle background image updates
    useEffect(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const imageSrc = customShapeUrl || shapeImageMap[shapeName] || "/shapes/cloth-full-body.png";
      
      fabric.Image.fromURL(imageSrc, (img) => {
        // Scale image to fit canvas
        const scaleX = canvas.getWidth() / (img.width || 1);
        const scaleY = canvas.getHeight() / (img.height || 1);
        const scale = Math.min(scaleX, scaleY) * 0.9; // 90% of canvas to leave padding

        img.set({
          originX: "center",
          originY: "center",
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        });

        // Apply tint color using blend filter if tintColor is provided and not transparent
        if (tintColor && tintColor !== "transparent" && img.filters) {
           const filter = new fabric.Image.filters.BlendColor({
              color: tintColor,
              mode: 'multiply',
              alpha: 0.8
           });
           img.filters.push(filter);
           img.applyFilters();
        }

        canvas.setBackgroundImage(img, () => {
           // Also set the exact same image as an overlay with 'multiply' blend mode
           // This perfectly preserves 3D shadows and wrinkles ON TOP of uploaded patterns/text
           fabric.Image.fromURL(imageSrc, (overlayImg) => {
             overlayImg.set({
               originX: "center",
               originY: "center",
               left: canvas.getWidth() / 2,
               top: canvas.getHeight() / 2,
               scaleX: scale,
               scaleY: scale,
               selectable: false,
               evented: false,
               globalCompositeOperation: "multiply",
             });
             canvas.setOverlayImage(overlayImg, canvas.renderAll.bind(canvas));
           });
        });
      });
    }, [shapeName, tintColor, customShapeUrl]);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current && fabricCanvasRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          fabricCanvasRef.current.setDimensions({
            width: clientWidth,
            height: clientHeight,
          });
          fabricCanvasRef.current.renderAll();
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      addText: (text: string, options: fabric.ITextOptions = {}) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const iText = new fabric.IText(text, {
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
          fontFamily: "Arial",
          fontSize: 40,
          fill: "#000000",
          ...options,
        });
        canvas.add(iText);
        canvas.setActiveObject(iText);
        canvas.renderAll();
      },
      addImage: (url: string) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        fabric.Image.fromURL(url, (img) => {
          img.set({
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            originX: "center",
            originY: "center",
            globalCompositeOperation: "source-atop",
          });
          
          // scale down if image is too large
          if ((img.width || 0) > canvas.getWidth() / 2) {
             img.scaleToWidth(canvas.getWidth() / 2);
          }
          
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      },
      updateSelectedColor: (color: string) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const activeObj = canvas.getActiveObject() as fabric.IText;
        if (activeObj && activeObj.type === "i-text") {
          activeObj.set("fill", color);
          canvas.renderAll();
        }
      },
      updateSelectedFont: (fontFamily: string) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const activeObj = canvas.getActiveObject() as fabric.IText;
        if (activeObj && activeObj.type === "i-text") {
          activeObj.set("fontFamily", fontFamily);
          canvas.renderAll();
        }
      },
      deleteSelected: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
          canvas.discardActiveObject();
          activeObjects.forEach((obj) => {
            canvas.remove(obj);
          });
        }
      },
      saveCanvas: () => {
        if (!fabricCanvasRef.current) return "";
        return fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 1,
        });
      },
    }));

    // Keyboard support for deleting items
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete" || e.key === "Backspace") {
           // check if we are not focused inside an input element
           const activeElement = document.activeElement;
           if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
               return;
           }
           
           const canvas = fabricCanvasRef.current;
           if (canvas) {
              const activeObjects = canvas.getActiveObjects();
              if (activeObjects.length) {
                 // if it's text and in editing mode, don't delete the object
                 const activeObj = activeObjects[0] as fabric.IText;
                 if (activeObj.isEditing) return;

                 canvas.discardActiveObject();
                 activeObjects.forEach((obj) => {
                    canvas.remove(obj);
                 });
                 e.preventDefault();
              }
           }
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
      <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
         <canvas ref={canvasRef} />
      </div>
    );
  }
);

ProductCanvas.displayName = "ProductCanvas";
