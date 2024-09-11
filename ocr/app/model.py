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
            det_model_dir='./paddleocr',
            rec=False,
            use_angle_cls=False
        )

        # Load VietOCR model weights
        config = Cfg.load_config_from_name('vgg_transformer')
        config['device'] = 'cpu'
        config['weights'] = './vietocr/vgg_transformer.pth'
        config['cnn']['pretrained'] = False
        config['predictor']['beamsearch'] = False
        self.text_pred = Predictor(config)

    def scan(self, image_input):
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
        result = result[0]  

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
            text_det_reg.append((recognized_text, text_region))

        return text_det_reg
