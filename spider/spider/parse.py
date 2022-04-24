'''
Author: Zohar
Date: 2021-06-30 01:14:12
LastEditTime: 2021-07-05 01:52:12
LastEditors: Please set LastEditors
Description: 根据html解析成json数据
FilePath: \spider1688\spider\parse.py
'''

from lxml import etree
import json

from getHtml import getHTMLText

# 解析1688商品详情数据
def parseProductDetails1688(htmlstr) :
    # str = etree.HTML(htmlstr)
    try :
        print(htmlstr)
        # 商品列表
        # dataListHtml = str.xpath(r"//div[@id='listBox']")[0]
        # itemname = dataListHtml.xpath(r"./div[@class='item']")
        # print(itemname)
        # print(etree.tostring(dataListHtml).decode('utf-8'))
    # try :
    #     # 商品名称
    #     storeName = str.xpath(r"//div[@id='mod-detail-title']/h1")[0].text

    #     # sku字典
    #     skuListRes = []

    #     # --------------主属性 start -------------
    #     if len(str.xpath(r"//div[@class='obj-leading']")) > 0 :
    #         leadingObj = str.xpath(r"//div[@class='obj-leading']")[0]
    #         # 主属性sku标签
    #         titleName = leadingObj.xpath(r"//span[@class='obj-title']")[0].text
    #         # 主属性sku值列表
    #         leadingValueList = []
    #         domLeadingList = leadingObj.xpath(r"//div[@class='unit-detail-spec-operator']")
    #         for item in domLeadingList :
    #             name = json.loads(item.xpath("./@data-unit-config")[0])
    #             value = json.loads(item.xpath("./@data-imgs")[0])
    #             leadingValueList.append({
    #                 'name': name['name'],
    #                 'value': value
    #             })
    #         skuListRes.append({
    #             'attrName': titleName,
    #             'attrValues': leadingValueList
    #         })
    #     # --------------主属性 end -------------
    #     # --------------sku start -------------
    #     skuObj = str.xpath(r"//div[@class='obj-sku']")[0]
    #     # sku标签
    #     skuHeader = skuObj.xpath(".//span[@class='obj-title']")[0].text
    #     # sku值列表
    #     skuList = []
    #     domSkuList = skuObj.xpath(".//tr")
    #     for item in domSkuList :
    #         # 判断是否是组合
    #         name = ''
    #         if len(item.xpath(".//td[@class='name']/span[contains(@class, 'image')]")) > 0 :
    #             curItem = item.xpath(".//td[@class='name']/span[contains(@class, 'image')]")[0]
    #             name = {
    #                 'title': curItem.xpath("./@title"),
    #                 'imgs': curItem.xpath("./@data-imgs")
    #             } 
    #         else :
    #             name = item.xpath(".//td[@class='name']/span")[0].text
    #         price = item.xpath(".//td[@class='price']//em[@class='value']")[0].text
    #         skuList.append({
    #             'name': name,
    #             'price': price
    #         })
        
    #     skuListRes.append({
    #         'attrName': skuHeader,
    #         'attrValues': skuList
    #     })
    #     # --------------sku end -------------

    #     # --------------左边预览 start -------------
        
    #     imgList = str.xpath(r"//li[@class='tab-trigger']")

    #     resImgList = []

    #     for item in imgList :
    #         name = item.xpath(".//img/@alt")[0]
    #         value = json.loads(item.xpath("./@data-imgs")[0])
    #         resImgList.append({
    #             'name': name,
    #             'value': value
    #         })

    #     print(resImgList)
    #     # --------------左边预览 end -------------

    #     # 产品属性
    #     modDetailAttr = json.loads(str.xpath(r"//div[@id='mod-detail-attributes']/@data-feature-json")[0])

    #     # ------- 产品详情描述 start -------------
    #     # 富文本是异步，所以需要获取url去重新请求
    #     detailDesUrl = str.xpath(r"//div[@id='desc-lazyload-container']/@data-tfs-url")[0]
    #     modDetailDescription = '' if parseRichText(detailDesUrl) == False else parseRichText(detailDesUrl)
        
    #     # ------- 产品详情描述 end -------------

    #     return {
    #         'storeName': storeName,
    #         'resImgList': resImgList,
    #         'skuList': skuListRes,
    #         'modDetailAttr': modDetailAttr,
    #         'modDetailDescription': modDetailDescription
    #     }
    except Exception as e :
        print(e)
        return False
    
# 根据url解析富文本数据
def parseRichText(url) :
    try :
        richText = getHTMLText(url)
        # 去掉多余的数据获取json对象
        strValue = (richText.split('=', 1)[1])[:-1]
        content = json.loads(strValue)
        return content['content']
    except Exception as e :
        print(e)
        return False