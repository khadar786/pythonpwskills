from flask import Flask
from flask import request
import gunicorn

app=Flask(__name__)

@app.route("/")
def hello_world():
  return "Hello, World"

@app.route("/test")
def test():
  a=5+6
  return "the sum of numbers {}".format(a)

@app.route("/input_url")
def request_input():
  data=request.args.get('search')
  return "this is my input fro url {data}".format(data=data)
  
  return "this is my input from url "
if __name__=="__main__":
  app.run(host="0.0.0.0")
  #uvicorn.run(app,host='0.0.0.0',port=8000)
  #uvicorn app:app --reload
  #gunicorn app:app --reload