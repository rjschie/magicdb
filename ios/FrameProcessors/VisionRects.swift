import AVKit
import Vision
import os

let logger = Logger()

struct RectResult {
  
}

@objc(VisionRects)
public class VisionRects: NSObject, FrameProcessorPluginBase {
  @objc
  public static func callback(_ frame: Frame!, withArgs args: [Any]!) -> Any! {
    let imageBuffer = CMSampleBufferGetImageBuffer(frame.buffer)!
    let ciImage = CIImage(cvPixelBuffer: imageBuffer)
    let uiImage = self.convertToUIImage(cmage: ciImage)

    guard let cgImage = uiImage.cgImage else {
      print("UIImage has no CGImage backing it")
      return uiImage
    }

    logger.debug("Performing callback...")

    let results = self.performVisionRequest(image: cgImage, orientation: .up)

    var rectArray: [[String: Any]] = []
    for res in results! {
      rectArray.append([
        "topLeft": ["x": res.topLeft.x, "y": res.topLeft.y],
        "topRight": ["x": res.topRight.x, "y": res.topRight.y],
        "bottomRight": ["x": res.bottomRight.x, "y": res.bottomRight.y],
        "bottomLeft": ["x": res.bottomLeft.x, "y": res.bottomLeft.y],
      ])
    }

    return [
      "results": rectArray,
    ]
  }

  private static func performVisionRequest(image: CGImage, orientation: CGImagePropertyOrientation) -> [VNRectangleObservation]? {
    var results: [VNRectangleObservation]? = []
    
    func handleDetectedRectangles(request: VNRequest?, error: Error?) {
      if error as NSError? != nil {
        logger.debug("Rectangle detection error")
        return
      }
      
      results = request?.results as? [VNRectangleObservation]
      logger.debug("Added vision results, count: \(results!.count)")
    }

    let requests: [VNRequest] = self.createVisionRequests(callback: handleDetectedRectangles)
    let imageRequestHandler: VNImageRequestHandler = VNImageRequestHandler(cgImage: image, orientation: orientation, options: [:])

    do {
      try imageRequestHandler.perform(requests) //sync
      return results
    } catch {
      logger.debug("Could not perform Vision Request")
      return []
    }
  }

  private static func createVisionRequests(callback: @escaping (_ request: VNRequest?, _ error: Error?) -> Void) -> [VNRequest] {
    let rectDetectRequest: VNDetectRectanglesRequest = VNDetectRectanglesRequest(completionHandler: callback)
    rectDetectRequest.maximumObservations = 8
    rectDetectRequest.minimumConfidence = 0.1

    return [rectDetectRequest]
  }

  private static func convertToUIImage(cmage: CIImage) -> UIImage {
    let context = CIContext(options: nil)
    let cgImage = context.createCGImage(cmage, from: cmage.extent)!
    let image = UIImage(cgImage: cgImage)
    return image
  }
}
