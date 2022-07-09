# 網站使用 Google 帳號登入

## Google Cloud Platform (GCP) 設定並下載憑證資料

基本設定這邊就跳過，選取或建立專案後，到「API與服務」主項目。
    1. 到「API 程式庫」>「公開」>「社交」啟用 Google People API。
    2. 到「憑證」，點選「+建立憑證」>「OAuth 用戶 ID」。
    3. 「應用程式類型」選「網頁應用程式」
    4. 「已授權的 JavaScript 來源」加入正式環境及測試環境的 URI。
    5. 「已授權的重新導向 URI」加入接收 Query String 參數的頁面 URI，同樣包含測試及正式環境。
    6. 建立完成後，「下載 OAuth 用戶端」的 JSON 檔。
    7. 到「OAuth 同意畫面」，設定應用程式名稱，及測試帳號等。

## 測試流程

把下載後的憑證 JSON 檔改名為 client_secret.json 放在專案的根目錄，大致內容如 client_secret_sample.json。
程式主要在 /routes/index.js 裡面，另一個是樣版頁 /views/index.ejs。用戶同意許可（登入）後，同樣跳轉到 http://localhost:3000。

程式流程：

    1. 建立 OAuth2Client 物件後，使用 generateAuthUrl() 方法產生登入按鈕所需的 url。
    2. 注意，要取得 email 資料需要 userinfo.email 的 scope。個人在測試時只放 userinfo.email 會出錯；同時給 userinfo.profile 和 userinfo.email 即可正常執行。
    3. 用戶許可後，在 query string 取得的 code 參數，用來取得 tokens。取得的參數參考 /references/redirect-query-string.json 內容。取得的 tokens 格式參考 /references/from-code-to-tokens.json。
    4. tokens 裡的 id_token 可直接用來呼叫 tokeninfo，方式如：```https://oauth2.googleapis.com/tokeninfo?id_token=${r.tokens.id_token}```，就可以直接拿到用戶的 email 和名字。取得的資料格式參考 /references/tokeninfo-results-oauth2.googleapis.com.json。
    5. 也可以透過 People API 取得，注意 personFields 要下 emailAddresses 才能拿到 email 資料。取得的資料格式參考 /references/people-api-response.json。

