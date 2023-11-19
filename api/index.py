from http.server import BaseHTTPRequestHandler
import json
from sentence_transformers import SentenceTransformer, util

plain_text = 'text/plain'
app_json = 'application/json'

model = SentenceTransformer('./data', device='cpu')

class handler(BaseHTTPRequestHandler):
    def _set_header(self, code, ctype):
        self.send_response(code)
        self.send_header('Content-type', ctype)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
 
    def do_GET(self):
        self._set_header(200, plain_text)
        self.wfile.write('make a post method with body = {prompt0: str, guess0: str, ... guess2: str}'.encode('utf-8'))

    def do_POST(self):
        if self.headers['content-type'] != 'application/json':
            self._set_header(400, plain_text)
            self.wfile.write('send application/json'.encode('utf-8'))
            return
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        keys = {"prompt0", "guess0", "prompt1", "guess1", "prompt2", "guess2"}
        data = json.loads(self.data_string.decode('utf-8'))
        if set(data.keys()) != keys:
            self._set_header(400, plain_text)
            self.wfile.write(f'invalid format. require {keys}'.encode('utf-8'))
            return
        data = generate_score(data)
        self._set_header(200, app_json)
        self.wfile.write(json.dumps(data).encode(encoding='utf_8'))

def generate_score(input):
    for i in range(3):
        prompt_emb = model.encode(input[f"prompt{i}"])
        guess_emb = model.encode(input[f"guess{i}"])
        cos_sim = util.cos_sim(prompt_emb, guess_emb)
        input[f"score{i}"] = round(cos_sim.item(), 3)
    return input