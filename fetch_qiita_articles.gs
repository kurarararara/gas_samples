//
//  fetch_qiita_articles.gs
//  gas_samples
//
//  kurarararara
//
// このスクリプトは、Qiitaの投稿者、LGTM数、タイトル、URL、投稿日を収集するスクリプトです。
// どんなスプレッドシートを作るかは以下のURLで確認してください。
// https://bit.ly/3j1pRnZ (Qiita)
//

function fetch_qiita_articles() {
  const AUTHORS = ["kurarararara"]; // LGTM集計するQiitaアカウントを指定
  const START_DATE = new Date(2020, 4, 1, 0, 0, 0); // 集計開始日（これより前の記事は集計しない）
  const SPREADSHEET_ID = ""; // GoogleスプレッドシートのID
  const SHEET_NAME = ""; // Googleスプレッドシートのシート名

  let sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  sheet.getRange(2, 1, sheet.getMaxRows(), 6).clearContent();

  let articles = AUTHORS
    .map(function(author) {
        return UrlFetchApp.fetch("https://qiita.com/api/v2/users/" + author + "/items");
    })
    .map(function(response) {
        return JSON.parse(response);
    })
    .flat()
    .filter(function(json) {
        return Date.parse(json["created_at"]) >= START_DATE;
    })
    .map(function(json, index) {
        return [index + 1, json["user"]["id"], json["likes_count"], json["title"], json["url"], json["created_at"]];
    })
  sheet.getRange(2, 1, articles.length, 6).setValues(articles);
}
