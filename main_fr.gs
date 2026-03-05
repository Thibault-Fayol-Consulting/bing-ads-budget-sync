/**
 * --------------------------------------------------------------------------
 * bing-ads-budget-sync - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Author: Thibault Fayol - Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */
var CONFIG = { TEST_MODE: true, SHEET_URL: "https://docs.google.com/spreadsheets/..." };
function main() {
    Logger.log("Export des Budgets Google Ads pour Syncho Bing...");
    var sheet = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL).getActiveSheet();
    if(!CONFIG.TEST_MODE) { sheet.clearContents(); sheet.appendRow(["Campaign", "Budget"]); }
    var campIter = AdsApp.campaigns().withCondition("Status = ENABLED").get();
    while(campIter.hasNext()){
        var camp = campIter.next();
        if (camp.getBudget()) {
            var budget = camp.getBudget().getAmount();
            Logger.log("Export: " + camp.getName() + " - " + budget);
            if(!CONFIG.TEST_MODE) sheet.appendRow([camp.getName(), budget]);
        }
    }
}
