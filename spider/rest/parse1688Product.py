'''
Author: Zohar
Date: 2021-07-01 01:08:57
LastEditTime: 2021-07-05 01:47:31
LastEditors: Please set LastEditors
Description: controller层，提供暴露接口
FilePath: \spider1688\rest\parse1688Product.py
'''

import os
import sys
# 导入flask类
from flask import Flask, jsonify, request
from flask_cors import *


sys.path.append(os.getcwd() + '/spider/')

from getUrl import getProductDetailFromUrl

# 实例化，可视为固定格式
app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/parse1688Product', methods = ['GET'])
def parse_1688():
    url = request.args.get("url","")
    data = getProductDetailFromUrl(url)
    # print(data)
    res = {
      'status': 200,
      'message': '请求成功',
      'body': data
    }
    return jsonify(res)

if __name__ == '__main__':
    # app.run(host, port, debug, options)
    # 默认值：host="127.0.0.1", port=5000, debug=False
    app.run(host="0.0.0.0", port=8089)
