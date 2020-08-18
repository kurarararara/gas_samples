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
  const SPREADSHEET_ID = "";
  const SHEET_NAME = "";

  let sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  sheet.getRange(1, 2, sheet.getMaxRows(), 5).clearContent(); // 常に最新の内容を反映させるため一旦全ての内容をクリア
  
  // Qiitaの記事情報を読み込んでパース
  let articles = [];
  AUTHORS.forEach(function(author){
    let response = UrlFetchApp.fetch("https://qiita.com/api/v2/users/" + author + "/items");
    JSON.parse(response).forEach(function(json, index){
      let article_date = Date.parse(json["created_at"]);
      if (article_date >= START_DATE) {
        let article = [index + 1, author, json["likes_count"], json["title"], json["url"], json["created_at"]];
        articles.push(article);
      }
    })
  })

  // スプレッドシートに結果を一括で書き込み
  sheet.getRange(1, 2, articles.length, 5).setValues(articles);
}
