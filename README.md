# receipt-backend

此專案利用 node.js 實作個人記賬與購買記錄系統後台。  
此系統的功能為提供使用者上傳發票文本，系統能夠把發票文本進行處理並提取出結構化資訊，並能為每張發票通過標籤 (tagging) 的方式進行分類。

## DEMO

http://18.183.89.93:3001/

## 資料庫設計
![](https://ppt.cc/fTUYGx@.png)

## 專案架構
```js
|   index.js                 // App 伺服器入口點
|   package.json
|   package-lock.json
|   README.md
|   config.json            // db 設定檔
|       
+---controllers              // 處理 API 邏輯
|     userController.js
|     tagController.js
|     receiptController.js
|       
+---middlewares              // 自訂 middlewares
|     auth.js
|     error.js
|     query.js
|               
+---routes                    // 區分不同功能的 API 路由
|     userRoutes.js
|     tagRoutes.js
|     receiptRoutes.js
|       
\---node_modules      

```


## API 文件

### Root Path: /api/v1  
/v1/users  
/v1/tags  
/v1/receipts  

### User

| 說明 | Method | Path |
| -------- | -------- | -------- | 
| 登入使用者 | POST | /users/login | 
| 登出使用者 | GET | /users/logout | 

#### 登入使用者
Request Example
```json
{
    "username": "bob",
    "password": "bob123",
}
```

Response Example
```json
{
    "ok": 1,
}
```

#### 登出使用者
Response Example
```json
{
    "ok": 1,
}
```

### Tag

| 說明 | Method | Path |
| -------- | -------- | -------- | 
| 讀取所有 tag | GET | /tags | 
| 創建 tag | POST | /tags/add |
| 刪除 tag | GET | /tags/:id | 
| 更新 tag | PATCH | /tags/:id | 

#### 讀取所有 tags
```json
{
    "ok": 1,
    "tags": [
        {
            "id": 19,
            "content": "sales",
            "created_at": "2021-04-27T17:20:31.000Z"
        },
        {
            "id": 21,
            "content": "summer",
            "created_at": "2021-04-27T17:25:57.000Z"
        },
        {
            "id": 22,
            "content": "teenage",
            "created_at": "2021-04-27T17:27:49.000Z"
        }
    ]
}
```

#### 創建 tags
Request Example
```json
{
    "content": "sale"
}
```

Response Example
```json
{
    "ok": 1,
    "id": 19
}
```

#### 刪除 tags
Response Example
```json
{
    "ok": 1
}
```

#### 更新 tags
Request Example
```json
{
  "content": "teenage"
}
```

Response Example
```json
{
    "ok": 1
}
```

### Receipt

| 說明 | Method | Path | Params |
| -------- | -------- | -------- |-| 
| 讀取發票 | GET | /receipts | tagId |
| 創建發票 | POST | /receipts/add |
| 編輯發票的 tag | PATCH | /receipts/:id | 
| 刪除發票 | GET | /receipts/delete/:id | 

#### 讀取發票
Response Example
```
{
    "ok": 1,
    "data": [
        {
            "id": 25,
            "serial_number": 87450,
            "time": "2020-04-05T08:48:04.000Z",
            "method": "CASH",
            "userId": 1,
            "tagId": 21,
            "creates_at": "2021-04-27T17:35:11.000Z",
            "tag": "summer",
            "items": [
                {
                    "serial_number": "88823027",
                    "content": "Viceroy Menthol Super",
                    "size": null,
                    "per_price": 11.7,
                    "quantity": 4
                },
                {
                    "serial_number": "7622210400291",
                    "content": "Daily Milk Roast Almond",
                    "size": null,
                    "per_price": 3.8,
                    "quantity": 1
                }
            ]
        },
        {
            "id": 26,
            "serial_number": 122769,
            "time": "2020-06-13T20:11:09.000Z",
            "method": "VISA",
            "userId": 1,
            "tagId": 21,
            "creates_at": "2021-04-27T17:36:19.000Z",
            "tag": "summer",
            "items": [
                {
                    "serial_number": "8888196173423",
                    "content": "Pokka Green Tea Jasmine",
                    "size": "1.5L",
                    "per_price": 2.2,
                    "quantity": 1
                },
                {
                    "serial_number": "9556404001156",
                    "content": "Pepsi",
                    "size": "1.5L",
                    "per_price": 2.2,
                    "quantity": 1
                },
                {
                    "serial_number": "5000277001156",
                    "content": "Dewars White Label",
                    "size": "750ml",
                    "per_price": 49,
                    "quantity": 1
                }
            ]
        }
    ]
}
```

#### 創建發票
html form example
```html
<form
  class="formUpload"
  enctype="multipart/form-data"
  method="POST"
  action="http://18.183.89.93:3001/v1/receipts/add"
>
  <input type=text name='type'>
  <label>File: <input type="file" name="file"/></label>
  <input type="submit" value="submit" />
</form>
```

Response Example
```json
{
    "ok": 1,
    "id": 25
}
```

#### 編輯發票的 tag
Request Example
```json
{
  "tagId": 25
}
```

Response Example
```json
{
    "ok": 1
}
```

#### 刪除發票
Response Example
```json
{
    "ok": 1
}
```
