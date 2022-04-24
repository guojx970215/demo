'''
Author: Zohar
Date: 2021-06-29 22:13:51
LastEditTime: 2021-07-05 01:52:43
LastEditors: Please set LastEditors
Description: 获取商品html文本
FilePath: \spider1688\spider\getUrl.py
'''

import os
import sys

sys.path.append(os.getcwd() + '/sql/')

from getHtml import getHTMLText
from parse import parseProductDetails1688

# 根据url获取商品详情数据
def getProductDetailFromUrl(url) :
    html = getHTMLText(url)
    return parseProductDetails1688(html)

def main():
    # 模拟get请求
    url = 'https://search.kongfz.com/product_result/?key=9787300295510&status=0&_stpmt=eyJzZWFyY2hfdHlwZSI6Imhpc3RvcnkifQ==&pagenum=1&ajaxdata=1&type=1&ajaxdata=3&_=1631177325347'
    getProductDetailFromUrl(url)

main()