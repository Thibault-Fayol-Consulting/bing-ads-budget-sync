/**
 * bing-ads-budget-sync - Google Ads Script for SMBs
 * Author: Thibault Fayol
 */
var CONFIG = { TEST_MODE: true, BING_API_KEY: "..." };
function main(){
  var googleBudget = AdsApp.budgets().get().next().getAmount();
  Logger.log("Google Budget is " + googleBudget + ". Syncing to Bing...");
}