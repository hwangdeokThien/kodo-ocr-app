from flask import Flask, request, render_template
from model import OCRModel
from PIL import Image

app = Flask(__name__)
model = OCRModel()

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/scan', methods=['POST'])
def scan():
    if 'image' not in request.files:
        return render_template("index.html", recognized_text="No image provided"), 400

    image_file = request.files['image']

    if image_file.filename == '':
        return render_template("index.html", recognized_text="No selected file"), 400

    image = Image.open(image_file)
    output = model.scan(image)

    return render_template("index.html", recognized_text=output)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)