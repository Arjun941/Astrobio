"use client";

import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface PaperImagesViewerProps {
  imageUrls: string[];
  paperTitle: string;
}

export function PaperImagesViewer({ imageUrls, paperTitle }: PaperImagesViewerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (imageUrls.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        <p>No images are available for this research paper.</p>
        <p className="mt-2 text-sm">
          Images may be available in the original paper using the "View Original" link above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {imageUrls.map((imageUrl, index) => (
          <motion.div 
            key={index} 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="relative overflow-hidden rounded-lg border bg-muted/50 group cursor-pointer aspect-square">
              <img
                src={imageUrl}
                alt={`Research figure ${index + 1} from ${paperTitle}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onClick={() => setSelectedImage(imageUrl)}
              />
              <div 
                className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center"
                onClick={() => setSelectedImage(imageUrl)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="backdrop-blur-sm bg-background/80 hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(imageUrl);
                    }}
                  >
                    <ZoomIn className="w-4 h-4 mr-2" />
                    View Full Size
                  </Button>
                </motion.div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Figure {index + 1}</p>
              <a 
                href={imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors text-xs hover:underline"
              >
                Open in new tab
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full-size image modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 text-white border border-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <img
                src={selectedImage}
                alt="Full size research figure"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}