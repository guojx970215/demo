## API design


### /token

Post: send username and password to get bearer token
用户用户登录
Body

```json
{
  "grant_type":"password"
  "username":"myUser"  // Currently only myUser, myUser1 and myUser2 can pass the authentication
  "password":"pwd"
}
```

Response Body:

```json
{
    "access_token": "<token>",
    "token_type": "bearer",
    "expires_in": 86399,
}
```

### All API below requries "Request header: `authorization: Bearer <token>`" for auth
以下所有API都需要用户登录后才可以访问
所有请求需要添加 Request header: `authorization: Bearer <token>`

### /api/v1/books

Get: Return all books for this user. If admin user, return all books in the system
获取用户所有用户可以访问的书籍列表 普通用户只能访问自己创建的图书 管理员可以访问所有图书
Response Body:

```json
{
  "data": {
    "books": [
      {
        "id": "mockbookid1", //使用类似guid的方法由前端生成
        "name": "book name",
        "cover": "base64imagesstring",
        "description": "mockbookid1 discription",
        "config": {}
      }
    ]
  },
  "message": "success",
  "messageCode": 0,
  "success": 0
}
```

### /api/v1/book/<bookId>

Get: get book with all pages in it
通过使用书籍的 bookId 获取所有书籍页面的内容
Response Body:

```json
{
  "data": {
    "count": 2,
    "pages": [
      {
        "id": "mockbook1pageId1", //使用类似guid的方法由前端生成
        "elements": [],
        "index": 1,
        "thumb": "base64 images string"
      },
      {
        "id": "mockbook1pageId2",
        "elements": [],
        "index": 1,
        "thumb": "base64 images string"
      }
    ],
    "id": "mockbookid1",
    "name": "book name",
    "cover": "base64imagesstring",
    "description": "mockbookid1 discription",
    "config": {
      "layout": "Portrait"
    }
  },
  "message": "success",
  "messageCode": 0,
  "success": 0
}
```

Post: create or update basic book information
新建图书或者更新图书的基本信息
如果 bookId 不存在于数据库中就新建书籍
如果 bookId 已经存在 更新书籍的基本信息 （书名name 封面图cover 书籍介绍description 书籍设置config）
Body:

```json
{
  "id": "mockbookid1",
  "name": "book name",
  "cover": "base64imagesstring",
  "description": "mockbookid1 discription",
  "config": {
    "layout": "portrait"
  }
}
```

Response Body:

```json
{
  "data": {},
  "message": "success",
  "messageCode": 0,
  "success": 0
}
```

### /api/v1/page/<pageId>

Get: get all details for this page id
获取某一页面的信息

```json
{
  "data": {
    "count": 1,
    "pages": [
      {
        "elements": [
          {
            "id": "elementId",
            "type": "textbox",
            "content": [
              {
                "type": "html",
                "value": "mock book 1 page 1 e1c1"
              }
            ],
            "config": {
              "x": 100,
              "y": 100,
              "height": 200,
              "width": 150
            }
          }
        ],
        "id": "mockbook1pageId1",
        "index": 1,
        "thumb": "base64url"
      }
    ],
    "id": "mockbookid1",
    "name": "book name",
    "cover": "base64imagesstring",
    "description": "mockbookid1 discription",
    "config": {
      "layout": "Portrait"
    }
  },
  "message": "success",
  "messageCode": 0,
  "success": 0
}
```

Post: create or update page

### /api/v1/book/{bookId}/page
创建或更新页面 
创建或更新时要制定书籍id (bookId)

Body

```json
{
  "data": {
      {
        "id": "mockbook1pageId1", //这里是页面的id
        "elements": [
          {
            "id": "elementId",
            "type": "textbox",
            "content": [{ "type": "html", "value": "mock book 1 page 1 e1c1" },
            "config": {
              "x": 100,
              "y": 100,
              "width": 150,
              "heigth": 200,
              "template": ""
            }
          }
        ],
        "index": 1,
        "thumb": "base64url"
      },
  "message": "success",
  "messageCode": 0,
  "success": 0
  }
}
```

### /api/template/page

Get: get all element templates by page number (if page number not passed, defauts to 1)
获取元素模板列表 分页显示每页12个模板

### /api/template

Get: search element template by tag name (if page number not passed, defauts to 1)
使用标签搜索模板 分页显示每页12个模板
```json
{
  "data":{

      "page":1,
      "next": 2,
      "previous": null,
      "templates":[
        {
          "id": 1,
          "template": "<div><p id=\"content1\"></p><p id=\"content2\"></p></div>",
          "name": "template name",
          "tags": ["tag1","tag2"]
        },
        {
          "id": 2,
          "template": "<div><p id=\"content1\"></p><a id=\"content2\"></a></div>",
          "name": "template name",
          "tags": ["tag2","tag3"],
          "description" "some description"
        }
      ]
    },
  "message": "success",
  "messageCode": 0,
  "success": 0
}
```

### /api/v1/images/list/{pageNumber}
Get: get the list of image by paging
获取已上传的图片列表 分页显示每页12个模板
### /api/v1/images/search/<tagname>/page/{pageNumber}

Get: search images using tag name by paging
使用标签搜索已上传的图片 分页显示每页12个模板

```json
{
  "data": {
    "page":1,
    "next": 2,
    "previous": null,
    "images": [
      {
        "path": "/uploads/images/1001.jpg",
        "name": "background1",
        "tags": "pink colorful"
      },
      {
        "path": "/uploads/images/1002.jpg",
        "name": "background2",
        "tags": "yellow lemon"
      },
      {
        "path": "/uploads/images/3001.png",
        "name": "background3",
        "tags": "cloud png"
      },
      {
        "path": "/uploads/images/5001.svg",
        "name": "background4",
        "tags": "blue svg"
      }
    ]
  },
  "message": "success",
  "messageCode": 0,
  "success": 0
}
```

### /api/v1/templates/group/{pageNumber}
### /api/v1/templates/group/search/<tagname>/{pageNumber}
Get: 获取组合模板
### /api/v1/templates/page/{pageNumber}
### /api/v1/templates/page/search/<tagname>/{pageNumber}
Get: 获取页面模板

```json
{
  "data": {
    "count": 1,
    "templates": [
      {
        "elements": [
          {
            "type": "TextBox",
            "content": [{ "type": "html", "value": "some html code" }],
            "config": { "x": 300, "y": 100, "width": 360, "height": 150 }
          },
          {
            "type": "templateCard",
            "content": [
              {
                "type": "html",
                "value": "<div style=\"width: 50px;height: 50px;z-index: 100;position: relative;\"><p id=\"placeholder-1\">模板文字</p></div>"
              }
            ],
            "config": { "x": 300, "y": 100, "width": 360, "height": 150 }
          }
        ],
        "thumb": "base64url",
        "tags": ["group-template","tag2", "tag3"]//"group-template"在保存时自动添加 其他tag由用户设置
      }
    ]
  },
  "message": "success",
  "messageCode": 0,
  "success": 0
}
```
### /api/v1/templates/group/
Post: 保存组合模板
### /api/v1/templates/page/
Post: 保存页面模板

```json
{
  "elements": [
    {
      "type": "TextBox",
      "content": [{ "type": "html", "value": "some html code" }],
      "config": { "x": 300, "y": 100, "width": 360, "height": 150 }
    },
    {
      "type": "templateCard",
      "content": [
        {
          "type": "html",
          "value": "<div style=\"width: 50px;height: 50px;z-index: 100;position: relative;\"><p id=\"placeholder-1\">模板文字</p></div>"
        }
      ],
      "config": { "x": 300, "y": 100, "width": 360, "height": 150 }
    }
  ],
  "thumb": "base64url",
  "tags": ["tag2", "tag3", "group-template"] //"group-template"在保存时自动添加 其他tag由用户设置
}
```

### /api/v1/audio/list/{pageNumber}
Get: get the list of audio by paging
获取已上传的音频列表 分页显示每页12个模板
### /api/v1/images/search/<tagname>/page/{pageNumber}
Get: search audio using tag name by paging
使用标签搜索已上传的音频 分页显示每页12个模板

```json
{
  "data": {
    "page":1,
    "next": 2,
    "previous": null,
    "audio": [
      {
        "path": "/uploads/audio/jingle.ogg",
        "name": "SNCF Jingle 2",
        "tags": "Alone sound"
      },
      {
        "path": "/uploads/audio/ringtone.mp3",
        "name": "Marimba Ringtone",
        "tags": "Alone sound ringtone"
      }
    ]
  },
  "message": "success",
  "messageCode": 0,
  "success": 0
}

```