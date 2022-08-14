import AVKit
import Vision
import os

@objc(VisionText)
public class VisionText: NSObject, FrameProcessorPluginBase {
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

    var resArray: [[String:[String]]] = []
    for res in results! {
      let resi = res.topCandidates(1).map({ text in
        return text.string
      })
      resArray.append(["candidates": resi])
    }

    return [
      "length": results!.count,
      "results": resArray
    ]
  }

  private static func performVisionRequest(image: CGImage, orientation: CGImagePropertyOrientation) -> [VNRecognizedTextObservation]? {
    var results: [VNRecognizedTextObservation]? = []
    
    func handleDetectedText(request: VNRequest?, error: Error?) {
      if error as NSError? != nil {
        logger.debug("Text detection error")
        return
      }
      
      results = request?.results as? [VNRecognizedTextObservation]
      logger.debug("Added vision results, count: \(results!.count)")
    }

    let requests: [VNRequest] = self.createVisionRequests(callback: handleDetectedText)
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
    let textDetectRequest: VNRecognizeTextRequest = VNRecognizeTextRequest(completionHandler: callback)
    textDetectRequest.recognitionLevel = VNRequestTextRecognitionLevel.accurate
    textDetectRequest.usesLanguageCorrection = true
//    textDetectRequest.customWords = ["accursed", "gearsmith"]

    return [textDetectRequest]
  }

  private static func convertToUIImage(cmage: CIImage) -> UIImage {
    let context = CIContext(options: nil)
    let cgImage = context.createCGImage(cmage, from: cmage.extent)!
    let image = UIImage(cgImage: cgImage)
    return image
  }
}
