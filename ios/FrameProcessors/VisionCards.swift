import Vision
import os

struct TextResults {
  var name: String
  var number: String
  var set: String
}

@objc(VisionCards)
public class VisionCards: NSObject, FrameProcessorPluginBase {
  static let logger = Logger()
  static var rectObservations: [VNRectangleObservation] = []
  static var results: [[String: Any]] = []
  static var textResults: TextResults = TextResults.init(name: "", number: "", set: "")
  static var newFrame: Frame = Frame.init()

  static var rectDetectRequest: VNDetectRectanglesRequest = {
    let rectDetectRequest: VNDetectRectanglesRequest = VNDetectRectanglesRequest(completionHandler: handleRectDetect)
    rectDetectRequest.maximumObservations = 2
    rectDetectRequest.minimumConfidence = 0.8
    rectDetectRequest.minimumAspectRatio = VNAspectRatio(1.3)
    rectDetectRequest.maximumAspectRatio = VNAspectRatio(1.7)
    rectDetectRequest.minimumSize = 0.35
    rectDetectRequest.quadratureTolerance = 15

    return rectDetectRequest
  }()

  @objc
  public static func callback(_ frame: Frame!, withArgs args: [Any]!) -> Any! {
    let uiImage = Utilities.convertToCGImage(frameBuffer: frame.buffer)
    guard let cgImage = uiImage.cgImage else {
      return []
    }

    logger.info("Performing VisionRect callback...")

    performVisionRequest(image: cgImage, orientation: .up)
    if (rectObservations.count > 0) {
      textResults = doPerspectiveCorrect(rectObservations.first!, from: cgImage)
    }

    return [
      "rects": results,
      "text": [
        "name": textResults.name,
        "number": textResults.number,
        "set": textResults.set,
      ],
      "newFrame": newFrame,
    ]
  }

  fileprivate static func handleRectDetect(request: VNRequest?, error: Error?) {
    if error as NSError? != nil {
      logger.error("Rectangle detection error")
      return
    }

    DispatchQueue.main.async {
      guard let rectResults: [VNRectangleObservation] = request?.results as? [VNRectangleObservation] else {
        return
      }

      results = []
      rectObservations = []
      if (rectResults.count > 0) {
        logger.info("Found observations: \(rectResults.count)")

        rectObservations = rectResults
        for box in rectResults {
          results.append([
            "confidence": box.confidence,
            "rect": [
              "topLeft": ["x": box.topLeft.x, "y": box.topLeft.y],
              "topRight": ["x": box.topRight.x, "y": box.topRight.y],
              "bottomRight": ["x": box.bottomRight.x, "y": box.bottomRight.y],
              "bottomLeft": ["x": box.bottomLeft.x, "y": box.bottomLeft.y],
            ],
            "boundingBox": [
              "x": box.boundingBox.origin.x,
              "y": box.boundingBox.origin.y,
              "width": box.boundingBox.width,
              "height": box.boundingBox.height,
            ],
          ])
        }
      } else {
        logger.info("No observations found")
      }
    }
  }

  fileprivate static func doPerspectiveCorrect(_ observation: VNRectangleObservation, from buffer: CGImage) -> TextResults {
    var ciImage = CIImage(cgImage: buffer)

    let topLeft = observation.topLeft.scaled(to: ciImage.extent.size)
    let topRight = observation.topRight.scaled(to: ciImage.extent.size)
    let bottomLeft = observation.bottomLeft.scaled(to: ciImage.extent.size)
    let bottomRight = observation.bottomRight.scaled(to: ciImage.extent.size)

    ciImage = ciImage.applyingFilter("CIPerspectiveCorrection", parameters: [
      "inputTopLeft": CIVector(cgPoint: topLeft),
      "inputTopRight": CIVector(cgPoint: topRight),
      "inputBottomLeft": CIVector(cgPoint: bottomLeft),
      "inputBottomRight": CIVector(cgPoint: bottomRight),
    ])

    let context = CIContext()
    let cgImage = context.createCGImage(ciImage, from: ciImage.extent)
    let output = UIImage(cgImage: cgImage!)

    logger.info("Did perspective correction, setting TextExtractor...")
    let textExtractor = TextExtractor()
    textExtractor.scannedImage = output

    let text = textExtractor.perform()
    logger.info("Did TextExtractor, received name: \(text.name), number: \(text.number), set: \(text.set)")
    return text
  }

  fileprivate static func performVisionRequest(image: CGImage, orientation: CGImagePropertyOrientation) {
    let requests: [VNRequest] = [rectDetectRequest]
    let imageRequestHandler: VNImageRequestHandler = VNImageRequestHandler(cgImage: image, orientation: orientation, options: [:])

    DispatchQueue.global(qos: .userInitiated).async {
      do {
        try imageRequestHandler.perform(requests) //sync
      } catch {
        logger.error("Could not perform Vision Request")
      }
    }
  }
}

extension CGPoint {
  func scaled(to size: CGSize) -> CGPoint {
    return CGPoint(x: self.x * size.width, y: self.y * size.height)
  }
}
