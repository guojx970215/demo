'''
Author: Zohar
Date: 2021-06-30 01:14:56
LastEditTime: 2021-07-01 00:49:57
LastEditors: Please set LastEditors
Description: 根据url获取Html文本
FilePath: \spider1688\spider\getHtml.py
'''

from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pksc1_v1_5
from urllib import parse

import requests
import base64
import random

# 利用公钥加密数据
def rsa_encrypt(code, public_key) :
    cipher = Cipher_pksc1_v1_5.new(RSA.importKey(public_key))
    encrypt_text = cipher.encrypt(code.encode())
    cipher_text = base64.b64encode(encrypt_text)
    return parse.quote(cipher_text.decode())

def getHTMLText(url):
    # 公钥
    public_key = '''-----BEGIN RSA PUBLIC KEY-----
    MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMiU6MWuUemPQkPAZSfYUBD6qfgQfM/jY3OEBbdNlOm0SBjX4Z1GMSg0Jhk70NQlxNfrbz4oN0A+jVhoH7gEyY8CAwEAAQ==
    -----END RSA PUBLIC KEY-----'''
    # 随机值
    randomcode = str(random.randint(100000000000,999999999999))
    # 加密数据
    randomcodesign = rsa_encrypt(randomcode, public_key)
    print(randomcodesign)
    try:
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
        accept = 'application/json, text/javascript, */*; q=0.01'
        cookie = 'randomcodekey=srck09105313104808hxu898;' + 'randomcode=' + randomcode + ';randomcodesign=' + randomcodesign + '; shoppingCartSessionId=1bdf04e42a65b6dfc73d7d09a89cb6c1; kfz_uuid=facfdab3a8870728ac0240a95501188b; reciever_area=1006000000; kfz-tid=ee0e53981d4693d44f48b481ecd2ad47; acw_tc=276077d816311773076097556e78f8e0c0422e3b877956d17174014e19f297; TY_SESSION_ID=84bfe7d2-2a22-4b24-a25c-085f1ca85324; PHPSESSID=v949kp0s29tk11hellq1612sf1; kfz_trace=facfdab3a8870728ac0240a95501188b|0|68f646ee1873bf66|; TINGYUN_DATA=%7B%22id%22%3A%22XMf0fX2k_0w%23nUhCMQN2SSk%22%2C%22n%22%3A%22WebAction%2FURI%2Fproduct%252Fsearch%252Fpc%252F%22%2C%22tid%22%3A%2228f52114ac3c394%22%2C%22q%22%3A0%2C%22a%22%3A43%7D'
        # r = requests.get(url = url, timeout = 30, headers = {'User-Agent': user_agent}) # prod环境
        r = requests.get(url = url, timeout = 30, headers = {'User-Agent': user_agent, 'Accept': accept, 'Cookie': cookie}, verify=False)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text
    except Exception as e:
        return e