/**
 * --------------------------------------------------------------------------
 * Google Ads Budget Exporter for Bing Sync — Google Ads Script
 * --------------------------------------------------------------------------
 * Exports enabled campaign names and daily budgets to a Google Sheet so you
 * can reference them when syncing budgets in Microsoft Advertising.
 *
 * Author : Thibault Fayol — Thibault Fayol Consulting
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit',
  NOTIFICATION_EMAIL: 'you@example.com'
};

function main() {
  try {
    Logger.log('Google Ads Budget Exporter — start');

    var tz = AdsApp.currentAccount().getTimeZone();
    var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    var accountName = AdsApp.currentAccount().getName();

    var campIter = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .get();

    var data = [];
    while (campIter.hasNext()) {
      var camp = campIter.next();
      var budget = camp.getBudget() ? camp.getBudget().getAmount() : 0;
      data.push([today, camp.getName(), budget]);
      Logger.log(camp.getName() + ' — $' + budget);
    }

    Logger.log('Found ' + data.length + ' enabled campaigns.');

    if (!CONFIG.TEST_MODE && data.length > 0) {
      var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
      var sheet = ss.getSheetByName('Budgets') || ss.insertSheet('Budgets');

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Date', 'Campaign', 'Daily Budget']);
      }

      sheet.getRange(sheet.getLastRow() + 1, 1, data.length, data[0].length)
        .setValues(data);
    }

    var subject = '[Budget Exporter] ' + accountName + ' — ' + today;
    var body = data.length + ' campaign budgets exported.\n\n' +
      (CONFIG.TEST_MODE ? '(TEST MODE — no data written)\n' : '') +
      'Sheet: ' + CONFIG.SHEET_URL;

    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
    Logger.log('Done.');

  } catch (e) {
    Logger.log('ERROR: ' + e.message);
    MailApp.sendEmail(
      CONFIG.NOTIFICATION_EMAIL,
      '[Budget Exporter] Error',
      'Script error:\n' + e.message + '\n' + e.stack
    );
  }
}
