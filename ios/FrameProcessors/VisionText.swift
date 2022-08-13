import AVKit
import Vision

@objc(VisionText)
public class VisionText: NSObject, FrameProcessorPluginBase {
  @objc
  public static func callback(_ frame: Frame!, withArgs args: [Any]!) -> Any! {
    guard let imageBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
      return nil
    }

    NSLog("VisionText: \(CVPixelBufferGetWidth(imageBuffer)) x \(CVPixelBufferGetHeight(imageBuffer)) Image. Logging \(args.count) parameters:")

    args.forEach { arg in
      var string = "\(arg)"
      if let array = arg as? NSArray {
        string = (array as Array).description
      } else if let map = arg as? NSDictionary {
        string = (map as Dictionary).description
      }
      NSLog("VisionText:   -> \(string) (\(type(of: arg)))")
    }

    return [
      "example_str": "Test",
      "example_bool": true,
      "example_double": 5.3,
      "example_int": 8,
      "example_array": [
        "Hello",
        true,
        17.38,
        18
      ]
    ]
  }
}