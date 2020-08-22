//
//  fetch_qiita_articles.gs
//  gas_samples
//
//  Created by kurarararara on 2020/08/20.
//  Copyright © 2020 kurarararara All rights reserved.
//

function fetch_qiita_articles() {
  const AUTHORS = ["kurarararara"]                      // Specify Qiita Account Name
  const START_DATE = new Date(2020, 4, 1, 0, 0, 0)      // Specify Qiita aggregation start date
  const SPREADSHEET_ID = ""                             // Specify Google Sheets's SpreadSheet ID
  const SHEET_NAME = ""                                 // Specify SpreadSheet Sheet Name

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME)
  
  sheet.getRange(2, 1, sheet.getMaxRows(), 6).clearContent()
  
  const articles = AUTHORS
    .map(author => UrlFetchApp.fetch("https://qiita.com/api/v2/users/" + author + "/items"))
    .map(response => JSON.parse(response))
    .flat()
    .filter(json => Date.parse(json["created_at"]) >= START_DATE)
    .map((json, index) => [index + 1, json["user"]["id"], json["likes_count"], json["title"], json["url"], json["created_at"]])

  sheet.getRange(2, 1, articles.length, 6).setValues(articles)
}
