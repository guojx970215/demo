'''
Author: Zohar
Date: 2021-06-29 22:51:43
LastEditTime: 2021-06-30 00:33:02
LastEditors: Please set LastEditors
Description: 获取数据库链接
FilePath: \spider1688\sql\getConnect.py
'''

#!/usr/bin/python3
 
import pymysql
from sqlConfig import config

# 打开数据库连接
def openSql() : 
  try :
    db = pymysql.connect(host=config['baseUrl'], user=config['accout'], password=config['password'], database=config['dataBases'], port=config['port'])
    return db
  except Exception as e:
    print(e)
    return False

# 关闭数据库连接
def closeSql(db) :
  try :
    db.close()
    print('close')
    return True
  except Exception as e :
    print(e)
    return False

# 获取数据库对象
def getSqlObj() :
  try : 
    db = openSql()
    return {
      'db' : db, # 数据库DB
      'cursor' : db.cursor()  # 游标
    }
  except Exception as e :
    print(e)
    return False

'''
@TODO 数据库查询
str: sql语句
'''
def selectSql(str) :
  # 数据库连接
  sqlObj = getSqlObj()
  # 数据库对象 
  db = sqlObj['db']
  cursor = sqlObj['cursor']
  try :
    # 执行SQL语句
    cursor.execute(str)
    # 获取结果集
    result = cursor.fetchall()
    return result
  except Exception as e :
    print(e)
    return False
  finally :
    closeSql(db)

'''
@TODO 数据库增、删、改语句
'''
def cudSql(str) :
  # 数据库连接
  sqlObj = getSqlObj()
  # 数据库对象 
  db = sqlObj['db']
  cursor = sqlObj['cursor']

  try :
    # 执行SQL语句
    cursor.execute(str)
    # 提交到数据库执行
    db.commit()
    return True
  except Exception as e :
    print(e)
    # 回滚
    db.rollback()
    return False
  finally :
    closeSql(db)

# def main() :
#   str = 'select * from `user`'
#   print(selectSql(str))

# main()