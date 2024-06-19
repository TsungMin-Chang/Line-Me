import { useEffect } from "react";
import { PixelCrop } from "react-image-crop";

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  completedCrop: PixelCrop | undefined,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, []);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [completedCrop]);
}
