import React, { useState, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

type ImgCropDialogProps = {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  imgSrc: string;
  crop?: Crop;
  setCrop: Dispatch<SetStateAction<Crop | undefined>>;
  setPicture: Dispatch<SetStateAction<string | null>>;
};

export default function ImgCropDialog({
  open,
  onClose,
  onCancel,
  crop,
  setCrop,
  imgSrc,
  setPicture,
}: ImgCropDialogProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
  // const blobUrlRef = useRef('')
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  // handle the initial load event
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    // Set the initial crop area to the centered square of the entire image
    setCrop(centerAspectCrop(width, height, 1));
  }

  async function handleSave() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Create an offscreen canvas
    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );

    // Get the offscreen canvas
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Draw the cropped area from the preview canvas onto the offscreen canvas
    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    // Convert the offscreen canvas to a blob
    // You might want { type: "image/jpeg", quality: <0 to 1> } to reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });
    
    // Convert Blob to Base64 string
    const blobToBase64 = (blob: Blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };
    const base64String = await blobToBase64(blob);
    setPicture(base64String as string);
    onClose();

    // Revoke the any previous blob URL
    // if (blobUrlRef.current) {
    //   URL.revokeObjectURL(blobUrlRef.current)
    // }
    // Create a new blob URL for the current blob
    // blobUrlRef.current = URL.createObjectURL(blob)

    // Trigger a download using a hidden anchor element
    // if (hiddenAnchorRef.current) {
    //   hiddenAnchorRef.current.href = blobUrlRef.current
    //   hiddenAnchorRef.current.click()
    // }
  }

  // delay the execution of a function to avoid unnecessary processing
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // Update the preview canvas with the current crop
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100, // Debounce delay
    completedCrop, // Dependencies to watch for changes
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 22 }}>
        Crop Image
      </DialogTitle>
      <DialogContent className="flex w-[300px] flex-col gap-y-2">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          minWidth={100}
          minHeight={100}
          circularCrop
        >
          <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
        </ReactCrop>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <div className="grow" />
        <Button onClick={() => handleSave()}>Save</Button>
      </DialogActions>
      {!!completedCrop && (
        <div className="hidden">
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
          {/* <a
            href="#hidden"
            ref={hiddenAnchorRef}
            download
            style={{
              position: 'absolute',
              top: '-200vh',
              visibility: 'hidden',
            }}
          >
            Hidden download
          </a> */}
        </div>
      )}
    </Dialog>
  );
}
