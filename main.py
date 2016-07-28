# -*- coding: <utf-8> -*-

# Date: Nov 27, 2015
# Title: Licence Generator
# Description: Licence generotor for datashop

# Hosted on App Engine
# project: datashopcare

# Limitations:
# 1)


# ----------------------------------------
#               IMPORTS
# ----------------------------------------
from flask import Flask, request, Response, jsonify
# import json
# import csv  # for csv related work

import logging

# # DB imports
# from pymongo import MongoClient


# ------ Logging code ------ #
# logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)
# handler = logging.FileHandler('LOG_NAME_HERE.log')
# handler.setLevel(logging.INFO)
# formatter = logging.Formatter(
#     '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# handler.setFormatter(formatter)
# logger.addHandler(handler)
# ------- Logging code end --- #

# ! Uncomment code below if you need mongo db code
# # ---- MongoDB code ---- #
# client = MongoClient('localhost', 27017)
# db = client.lens
# lens_response_data = db.lens_response
# # --- Mongo DB code End --- #


application = Flask(__name__)


@application.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type, Authorization, Origin, X-Requested-With, Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@application.route('/')
def index():
    return 'Hello there !!!'


@application.route('/test')
def test():
    data = {"a":1 }
    return jsonify(data)


if __name__ == '__main__':
    # application.debug = True
    application.run(host='0.0.0.0', port=9011)

# ----------------------------------------
#               USAGE
# ----------------------------------------
