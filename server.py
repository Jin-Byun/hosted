import yaml
from flask import Flask, request
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util
app = Flask(__name__)
CORS(app)
model = SentenceTransformer('./data', device='cpu')

def generate_score(input):
    for i in range(3):
        prompt_emb = model.encode(input[f"prompt{i}"])
        guess_emb = model.encode(input[f"guess{i}"])
        cos_sim = util.cos_sim(prompt_emb, guess_emb)
        input[f"score{i}"] = round(cos_sim.item(), 3)
    return input

@app.route("/",methods=['GET', 'POST'])
def process_data():
    if request.method == 'GET':
        return 'make a post method with body = {prompt0: str, guess0: str, ... guess2: str}'
    data = request.get_json(force=True)
    keys = {"prompt0", "guess0", "prompt1", "guess1", "prompt2", "guess2"}
    if set(data.keys()) != keys:
        return f'invalid format. require {keys}', 400
    return generate_score(data)