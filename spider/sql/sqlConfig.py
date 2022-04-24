'''
Author: Zohar
Date: 2021-06-29 23:03:21
LastEditTime: 2021-06-30 00:02:11
LastEditors: Please set LastEditors
Description: 数据库配置
FilePath: \spider1688\sql\sqlConfig.py
'''

# Filename: sqlConfig.py

# 开发环境 
def dev() :
  return {
      'baseUrl' : '127.0.0.1',
      'accout' : 'root',
      'password' : '123456',
      'dataBases' : 'cy_shop',
      'port' : 3306
    }

# 生产环境
def prod() :
  return {
      'baseUrl' : '127.0.0.1',
      'accout' : 'root',
      'password' : '123456',
      'dataBases' : 'cy_shop',
      'port' : 3306
    }

# test环境
def test() :
  return {
      'baseUrl' : 'rm-2ze4y955iqdrybmfr1o.mysql.rds.aliyuncs.com:3306',
      'accout' : 'good_root',
      'password' : 'Yzhxcql7788#cc',
      'dataBases' : 'cy_shop',
      'port' : 3306
    }

config = dev()
# config = test()