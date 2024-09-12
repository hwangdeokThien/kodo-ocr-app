from flask import Flask, request, render_template
from ocr.model import OCRModel
from llms.trigger import LLMTrigger
from PIL import Image

app = Flask(__name__)
model = OCRModel()
trigger = {
    'general_assistant': LLMTrigger(prompt_type='general_assistant'),
    'ocr_correction': LLMTrigger(prompt_type='ocr_correction'),
    'note_template': LLMTrigger(prompt_type='note_template'),
    'idea_generator': LLMTrigger(prompt_type='idea_generator'),
    'content_creator': LLMTrigger(prompt_type='content_creator'),
}


'''
=====================================================================================
App routing
=====================================================================================
'''
@app.route("/")
def home():
    return render_template("index.html")

@app.route('/scan', methods=['POST'])
def scan():
    config = request.form.to_dict()
    req_struct = config.get('req_struct', 'false').lower() in ['true', '1', 'yes']
    llm_aided = config.get('llm_aided', 'false').lower() in ['true', '1', 'yes']


    if 'image' not in request.files:
        return None

    image_file = request.files['image']

    if image_file.filename == '':
        return None

    image = Image.open(image_file)

    if req_struct:
        reg_det_text = model.scan(image, req_bbox=True)
        output = model.construct_text(reg_det_text)
    else:
        output = model.scan(image)

    if llm_aided:
        params = {'sentences': output}
        output = trigger['ocr_correction'].invoke(params=params)

    return output

@app.route('/ai_gen', methods=['POST'])
def ai_gen():
    config = request.form.to_dict()
    prompt_type = config.get('prompt_type', 'general_assistant')
    params = config.get('params', {})

    output = trigger[prompt_type].invoke(params=params)
    
    return output

@app.route('/chat_history', methods=['POST'])
def chat_history():
    config = request.form.to_dict()
    prompt_type = config.get('prompt_type', 'general_assistant')

    return trigger[prompt_type].get_messages_history()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)