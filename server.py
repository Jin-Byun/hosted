from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import yaml
from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('./data', device='cpu')

PORT = 3000

class MyHandler(BaseHTTPRequestHandler):
    """
    For more information on CORS see:
    * https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS
    * http://enable-cors.org/
    """
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('make a post method with body = {prompt0: str, guess0: str, ... guess2: str}'.encode('utf-8'))
    
    def do_POST(self):
        if self.headers['content-type'] != 'application/json':
            self.send_response(400)
            self.send_header('Content-type','text/plain')
            self.end_headers()        
            self.wfile.write('send application/json'.encode('utf-8'))
            return
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        keys = {"prompt0", "guess0", "prompt1", "guess1", "prompt2", "guess2"}
        data = yaml.load(self.data_string.decode('utf-8'), yaml.SafeLoader)
        if set(data.keys()) != keys:
            self.send_response(400)
            self.send_header('Content-type','text/plain')
            self.end_headers()        
            self.wfile.write(f'invalid format. require {keys}'.encode('utf-8'))
            return
        data = generate_score(data)
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode(encoding='utf_8'))


def generate_score(input):
    for i in range(3):
        prompt_emb = model.encode(input[f"prompt{i}"])
        guess_emb = model.encode(input[f"guess{i}"])
        cos_sim = util.cos_sim(prompt_emb, guess_emb)
        input[f"score{i}"] = round(cos_sim.item(), 3)
    return input

def httpd(handler_class=MyHandler, server_address=('0.0.0.0', PORT), file_=None):
    try:
        srvr = HTTPServer(server_address, handler_class)
        srvr.serve_forever()  # serve_forever
    except KeyboardInterrupt:
        srvr.socket.close()


if __name__ == "__main__":
    """ ./corsdevserver.py """
    httpd()