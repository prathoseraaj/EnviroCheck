#importing
import numpy as np
import pickle
from flask import Flask, request, jsonify

#initialize the Flask app
app = Flask(__name__)