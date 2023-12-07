from flask import Flask
from flask import request
import requests
from bs4 import BeautifulSoup as bs
from urllib.request import urlopen
import logging

app=Flask(__name__)

@app.route("/")
def webScrapping1():
    return "hell"

if __name__=="__main__":
    app.run(host="0.0.0.0")