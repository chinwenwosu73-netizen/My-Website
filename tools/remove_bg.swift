import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers
import CoreGraphics

// Usage: swift remove_bg.swift <input> <output.png>
guard CommandLine.arguments.count >= 3,
      let inPath = CommandLine.arguments.dropFirst().first,
      let outPath = CommandLine.arguments.dropFirst().dropFirst().first else {
    print("Usage: swift remove_bg.swift <input> <output.png>")
    exit(1)
}

let inURL = URL(fileURLWithPath: inPath)
let outURL = URL(fileURLWithPath: outPath)

guard let ciImage = CIImage(contentsOf: inURL) else {
    print("ERROR: cannot load input image")
    exit(1)
}

// 1. Generate a subject mask using Vision
let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])

guard let observation = request.results?.first else {
    print("ERROR: no subject detected")
    exit(1)
}

// 2. Get a mask CIImage (grayscale: white = subject, black = background)
let maskPixelBuffer = try observation.generateScaledMask(for: ciImage)
let maskImage = CIImage(cvPixelBuffer: maskPixelBuffer)

// 3. Composite: keep the original image where mask is white, transparent where black
let blend = CIFilter(name: "CIBlendWithMask")!
blend.setValue(ciImage, forKey: kCIInputImageKey)
blend.setValue(CIImage(color: .clear).cropped(to: ciImage.extent), forKey: kCIInputBackgroundImageKey)
blend.setValue(maskImage, forKey: kCIInputMaskImageKey)

guard let output = blend.outputImage?.cropped(to: ciImage.extent) else {
    print("ERROR: blend filter failed")
    exit(1)
}

// 4. Render to a bitmap with alpha and write PNG
let context = CIContext(options: [.useSoftwareRenderer: false])
let width = Int(ciImage.extent.width)
let height = Int(ciImage.extent.height)

var pixelData = [UInt8](repeating: 0, count: width * height * 4)
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
context.render(output,
               toBitmap: &pixelData,
               rowBytes: width * 4,
               bounds: CGRect(x: 0, y: 0, width: width, height: height),
               format: .RGBA8,
               colorSpace: colorSpace)

let provider = CGDataProvider(data: Data(pixelData) as CFData)!
let cgImage = CGImage(width: width,
                      height: height,
                      bitsPerComponent: 8,
                      bitsPerPixel: 32,
                      bytesPerRow: width * 4,
                      space: colorSpace,
                      bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
                      provider: provider,
                      decode: nil,
                      shouldInterpolate: true,
                      intent: .defaultIntent)!

let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, cgImage, nil)
guard CGImageDestinationFinalize(dest) else {
    print("ERROR: could not write PNG")
    exit(1)
}
print("DONE: wrote \(outURL.path)")
