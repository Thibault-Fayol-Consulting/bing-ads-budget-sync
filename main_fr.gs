/**
 * --------------------------------------------------------------------------
 * Exportateur de Budgets Google Ads pour Synchro Bing — Script Google Ads
 * --------------------------------------------------------------------------
 * Exporte les noms de campagnes actives et leurs budgets journaliers vers un
 * Google Sheet pour faciliter la synchronisation avec Microsoft Advertising.
 *
 * Auteur : Thibault Fayol — Thibault Fayol Consulting
 * Site   : https://thibaultfayol.com
 * Licence: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit',
  NOTIFICATION_EMAIL: 'vous@exemple.com'
};

function main() {
  try {
    Logger.log('Exportateur de Budgets Google Ads — demarrage');

    var tz = AdsApp.currentAccount().getTimeZone();
    var today = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
    var accountName = AdsApp.currentAccount().getName();

    var campIter = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .get();

    var data = [];
    while (campIter.hasNext()) {
      var camp = campIter.next();
      var budget = camp.getBudget() ? camp.getBudget().getAmount() : 0;
      data.push([today, camp.getName(), budget]);
      Logger.log(camp.getName() + ' — ' + budget + ' EUR');
    }

    Logger.log(data.length + ' campagnes actives trouvees.');

    if (!CONFIG.TEST_MODE && data.length > 0) {
      var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
      var sheet = ss.getSheetByName('Budgets') || ss.insertSheet('Budgets');

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Date', 'Campagne', 'Budget Journalier']);
      }

      sheet.getRange(sheet.getLastRow() + 1, 1, data.length, data[0].length)
        .setValues(data);
    }

    var subject = '[Export Budgets] ' + accountName + ' — ' + today;
    var body = data.length + ' budgets de campagnes exportes.\n\n' +
      (CONFIG.TEST_MODE ? '(MODE TEST — aucune donnee ecrite)\n' : '') +
      'Sheet : ' + CONFIG.SHEET_URL;

    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
    Logger.log('Termine.');

  } catch (e) {
    Logger.log('ERREUR : ' + e.message);
    MailApp.sendEmail(
      CONFIG.NOTIFICATION_EMAIL,
      '[Export Budgets] Erreur',
      'Erreur du script :\n' + e.message + '\n' + e.stack
    );
  }
}
