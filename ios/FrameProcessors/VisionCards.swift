import AVKit
import Vision
import os

@objc(VisionCards)
public class VisionCards: NSObject, FrameProcessorPluginBase {
  static var results: [VNRecognizedTextObservation]?
  static var name: String = ""
  static var number: String = ""
  static var set: String = ""

  static var textDetectRequest: VNRecognizeTextRequest = {
    let textDetectRequest: VNRecognizeTextRequest = VNRecognizeTextRequest(completionHandler: handleTextDetect)
    textDetectRequest.recognitionLevel = VNRequestTextRecognitionLevel.accurate
    textDetectRequest.recognitionLanguages = ["en_GB"]
    textDetectRequest.usesLanguageCorrection = true
//    textDetectRequest.customWords = []

    return textDetectRequest
  }()
  
  @objc
  public static func callback(_ frame: Frame!, withArgs args: [Any]!) -> Any! {
    let imageBuffer = CMSampleBufferGetImageBuffer(frame.buffer)!
    let ciImage = CIImage(cvPixelBuffer: imageBuffer)
    let uiImage = convertToUIImage(cmage: ciImage)
    
    guard let cgImage = uiImage.cgImage else {
      logger.debug("UIImage has no CGImage backing it")
      return uiImage
    }

    performVisionRequest(image: cgImage, orientation: .up)

    return [
      "name": name,
      "number": number,
      "set": set,
    ]
  }
  
  fileprivate static func handleTextDetect(request: VNRequest?, error: Error?) {
    guard let results = request?.results, results.count > 0 else {
      logger.debug("No text was found")
      return
    }

    var components = [CardComponent]()
    
    for result in results {
      if let observation = result as? VNRecognizedTextObservation {
        for text in observation.topCandidates(1) {
          let component = CardComponent()
          component.x = observation.boundingBox.origin.x
          component.y = observation.boundingBox.origin.y
          component.text = text.string
          components.append(component)
        }
      }
    }
    
    guard let firstComponent = components.first else { return }
    
    var nameComponent = firstComponent
    var numberComponent = firstComponent
    var setComponent = firstComponent
    for component in components {
      if component.x < nameComponent.x && component.y > nameComponent.y {
        nameComponent = component
      }
      
      if component.x < (numberComponent.x + 0.05) && component.y < numberComponent.y {
        numberComponent = setComponent
        setComponent = component
      }
    }
    
    name = nameComponent.text
    if numberComponent.text.count >= 3 {
      number = "\(numberComponent.text.prefix(3))"
    }
    if setComponent.text.count >= 3 {
      set = "\(setComponent.text.prefix(3))"
    }
  }

  fileprivate static func performVisionRequest(image: CGImage, orientation: CGImagePropertyOrientation) {
    let requests: [VNRequest] = [textDetectRequest]
    let imageRequestHandler: VNImageRequestHandler = VNImageRequestHandler(cgImage: image, orientation: orientation, options: [:])

    do {
      try imageRequestHandler.perform(requests) //sync
    } catch {
      logger.debug("Could not perform Vision Request")
    }
  }

  fileprivate static func convertToUIImage(cmage: CIImage) -> UIImage {
    let context = CIContext(options: nil)
    let cgImage = context.createCGImage(cmage, from: cmage.extent)!
    let image = UIImage(cgImage: cgImage)
    return image
  }
}
