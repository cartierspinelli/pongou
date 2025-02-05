import React from "react"
import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image"
import { cssInterop } from "nativewind"

export interface ImageProps extends ExpoImageProps {
  // You can add additional props here if needed, test
}
cssInterop(ExpoImage, { className: "style" })

export function Image(props: ImageProps) {
  return <ExpoImage {...props} />
}
