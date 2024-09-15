from paddleocr import PaddleOCR
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
from PIL import Image
import numpy as np

class OCRModel:
    def __init__(self):
        # load PaddleOCR inference model
        self.text_det = PaddleOCR(
            ir_optim=True,
            lang='german',
            det_model_dir='./paddleocr_config',
            rec=False,
            use_angle_cls=False
        )

        # Load VietOCR model weights
        config = Cfg.load_config_from_name('vgg_transformer')
        config['device'] = 'cpu'
        config['weights'] = './ocr/vietocr_config/vgg_transformer.pth'
        config['cnn']['pretrained'] = False
        config['predictor']['beamsearch'] = False
        self.text_pred = Predictor(config)

    def scan(self, image_input, req_bbox=False):
        """
        Scan an image and return detected text with or without bounding boxes.

        Args:
            image_input (str or PIL.Image.Image): The input image file path or a PIL Image object.
            req_bbox (bool): If True, return text with bounding boxes. If False, return text only.

        Returns:
            list: A list of detected text with bounding boxes (if req_bbox is True).
                  Otherwise, a list of recognized text only.
        """
        if isinstance(image_input, str):
            image = Image.open(image_input)
            image_np = np.array(image)
        elif isinstance(image_input, Image.Image):
            image = image_input
            image_np = np.array(image)
        else:
            raise ValueError("Invalid image input type. Must be a file path or PIL Image object.")
        
        # Get detected text areas (bounding boxes)
        result = self.text_det.ocr(image_np, cls=False, rec=False)
        result = result[0]  # Extract the list of detected regions

        text_det_reg = []

        # Process each detected text region
        for line in result:
            bbox = line
            x_min = int(min([point[0] for point in bbox]))
            y_min = int(min([point[1] for point in bbox]))
            x_max = int(max([point[0] for point in bbox]))
            y_max = int(max([point[1] for point in bbox]))
            text_region = (x_min, y_min, x_max, y_max)

            # Crop the text region from the image
            img_crop = image.crop(text_region)

            # Use VietOCR to predict text from the cropped region
            recognized_text = self.text_pred.predict(img_crop)

            if req_bbox:
                # Append recognized text along with the bounding box
                text_det_reg.append((recognized_text, text_region))
            else:
                # Append only the recognized text
                text_det_reg.append(recognized_text)

        return text_det_reg

    def construct_text(self, text_det_reg):
        """
        Constructs a text output that mimics the original layout of the scanned document.
        
        Args:
            text_det_reg: List of tuples containing recognized text and bounding box coordinates
        
        Returns:
            A formatted string that mimics the document layout
        """
        # Sort the detected text regions by their vertical position (y_min)
        text_det_reg.sort(key=lambda x: x[1][1])

        # Initialize variables for formatted text output
        formatted_text = ""
        previous_y_min = None
        line_text = ""

        # Define thresholds for detecting new lines and spaces
        line_threshold = 20
        space_threshold = 50 

        for i, (recognized_text, (x_min, y_min, x_max, y_max)) in enumerate(text_det_reg):
            # Check if this is a new line
            if previous_y_min is not None and abs(y_min - previous_y_min) > line_threshold:
                # Add the current line to the formatted text and start a new line
                formatted_text += line_text.strip() + "\n"
                line_text = ""

            # Check if a space should be added (if there's a significant gap between words on the same line)
            if line_text and (x_min - text_det_reg[i - 1][1][2] > space_threshold):
                line_text += " "  # Add a space

            # Add the recognized text for the current region
            line_text += recognized_text + " "

            # Update the previous_y_min for the next iteration
            previous_y_min = y_min

        # Add the last line to the formatted text
        formatted_text += line_text.strip()

        return formatted_text