from .model import OCRModel
import argparse

def main(image_path):
    model = OCRModel()
    output = model.scan(image_path)
    print(f"Final Recognized Texts:")
    for word, box in output:
        print(f'{word} - {box}')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run OCR on an image.")
    parser.add_argument("-t", "--test", type=str, required=True, help="Path to the image file for testing")
    args = parser.parse_args()
    main(args.test)

