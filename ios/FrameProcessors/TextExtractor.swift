//
//  TextExtractor.swift
//  MagicDB
//
//  Created by Ryan Schie on 8/15/22.
//

import Vision
import os

class TextExtractor: NSObject {
  let logger = Logger()
  var scannedImage: UIImage?
  var name: String = ""
  var number: String = ""
  var set: String = ""

  lazy var textDetectRequest: VNRecognizeTextRequest = {
    let textDetectRequest: VNRecognizeTextRequest = VNRecognizeTextRequest(
      completionHandler: handleTextDetect)
    textDetectRequest.recognitionLevel = VNRequestTextRecognitionLevel.accurate
    textDetectRequest.recognitionLanguages = ["en_GB"]
    textDetectRequest.usesLanguageCorrection = true
    //    textDetectRequest.customWords = []

    return textDetectRequest
  }()

  func perform() -> TextResults {
    guard let cgImage = scannedImage?.cgImage else {
      return TextResults.init(name: "", number: "", set: "")
    }

    logger.info("Performing TextExtractor...")

    performVisionRequest(image: cgImage, orientation: .up)

    return TextResults.init(name: name, number: number, set: set)
  }

  fileprivate func handleTextDetect(request: VNRequest?, error: Error?) {
    guard let results = request?.results, results.count > 0 else {
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

    self.name = nameComponent.text
    if numberComponent.text.count >= 3 {
      self.number = "\(numberComponent.text.prefix(3))"
    }
    if setComponent.text.count >= 3 {
      self.set = "\(setComponent.text.prefix(3))"
    }
  }

  fileprivate func performVisionRequest(image: CGImage, orientation: CGImagePropertyOrientation) {
    let requests: [VNRequest] = [textDetectRequest]
    let imageRequestHandler: VNImageRequestHandler = VNImageRequestHandler(
      cgImage: image, orientation: orientation, options: [:])

    do {
      try imageRequestHandler.perform(requests)  //sync
    } catch {
      //
    }
  }
}
