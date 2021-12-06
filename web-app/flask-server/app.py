from flask import Flask, json, request, jsonify, url_for, redirect, render_template

import csv
import random
import decimal

import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import numpy as np
from numpy import loadtxt
from keras.models import load_model

app = Flask(__name__)

@app.route('/predict')
def webML():
    print("[INSIDE GET /PREDICT]")
    # request obj. hashmap
    reqObj = {}
    catMap = {} # map category inputs to their original column names.
    initCategories(catMap, reqObj) # all categories initialized to 0.
    selectedCat = request.args.get("category")
    timeBinary = getTimeBinary(request.args.get("time")) # either 0 or 1.
    reqObj[catMap[selectedCat]] = [1] # set selected category to 1.
    reqObj["amt"] = [float(request.args.get("amount"))]
    reqObj["hour"] = [timeBinary]
    reqObj["trans_count_7d"] = [float(request.args.get("transCount7Days"))]
    reqObj["trans_count_30d"] = [float(request.args.get("transCount30Days"))]
    reqObj["time_diff"] = [float(request.args.get("timeDiff"))]
    print("REQ. OBJ;", reqObj)
    # [PD DATAFRAME CREATION FROM USER INPUT]
    # read data(s) & standardization...
    dfUser = pd.DataFrame.from_dict(reqObj)   
    num_cols = ['amt', 'trans_count_7d', 'trans_count_30d', 'time_diff']
    scaler = MinMaxScaler()
    scaler.min_ = np.array([-3.45448202e-5, 0.0, 0.0, 0.0])
    scaler.scale_ = np.array([3.45448202e-05, 9.17431193e-03, 2.57731959e-03, 4.16671489e-02])
    dfUser[num_cols] = scaler.transform(dfUser[num_cols]) # transform with userInput.
    # load and evaluate a saved model
    model = load_model('model-v2.h5')
    result = model.predict(dfUser)
    print("RESULTS:", result, type(result), result[0][0])
    if (result[0][0] > 0.5):
        print("RETURNING FRAUD")
        response = jsonify("fraud")
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 
    else: # less than threshold...
        print("RETURNING NOT FRAUD")
        response = jsonify("notFraud")
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 
    
# helper func: init cat. data
def initCategories(catMap, reqObj):
    categories = ['category_entertainment', 'category_food_dining', 'category_gas_transport','category_grocery_net', 
    'category_grocery_pos', 'category_health_fitness', 'category_home', 'category_kids_pets', 'category_misc_net', 
    'category_misc_pos', 'category_personal_care', 'category_shopping_net', 'category_shopping_pos', 'category_travel']
    for cat in categories:
        reqObj[cat] = [0]
        catMap[cat[9:]] = cat

def getTimeBinary(time):
    timeChars = []
    for letter in time:
        if letter != ":":
            timeChars.append(letter)
    timeInt = int("".join(timeChars))
    if timeInt >= 700 and timeInt <= 2200:
        return 0
    else:
        return 1
