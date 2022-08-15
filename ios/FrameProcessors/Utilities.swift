//
//  Utilities.swift
//  MagicDB
//
//  Created by Ryan Schie on 8/15/22.
//

class Utilities {
  static func convertToCGImage(frameBuffer: CMSampleBuffer) -> UIImage {
    let cmImageBuffer = CMSampleBufferGetImageBuffer(frameBuffer)!
    let ciImage = CIImage(cvPixelBuffer: cmImageBuffer)

    let context = CIContext(options: nil)
    let image = context.createCGImage(ciImage, from: ciImage.extent)!
    let uiImage = UIImage(cgImage: image)

    return uiImage
  }
}
