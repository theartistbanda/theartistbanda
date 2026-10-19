/**
 * Spam guard for the dipeshgurav.com contact form.
 *
 * The form's checks run in the visitor's browser, but a bot can post straight
 * to this script without loading the site. These checks repeat the form's
 * rules here, where a bot can't skip them.
 *
 * HOW TO ADD IT
 * 1. Open the contact form's Apps Script project (script.google.com).
 * 2. Paste this whole file below your existing code.
 * 3. Add this as the FIRST line inside your existing doPost(e) function:
 *
 *      if (!isGenuineEnquiry_(e)) return ContentService.createTextOutput('ok');
 *
 * 4. Deploy > Manage deployments > edit the current deployment (pencil icon)
 *    > Version: "New version" > Deploy. Editing the existing deployment keeps
 *    the same /exec URL, so the website needs no change.
 *
 * Rejected posts get the same "ok" reply as real ones, so a bot can't tell
 * it was blocked. To see what was blocked, open Executions in the left
 * sidebar and look for "Blocked enquiry" log lines.
 */

var GUARD_MIN_FILL_MS = 3000;
var GUARD_MSG_MAX = 2000;

function isGenuineEnquiry_(e) {
  var p = (e && e.parameter) || {};
  var name = String(p.name || '').trim();
  var email = String(p.email || '').trim();
  var message = String(p.message || '').trim();
  var elapsed = Number(p.elapsed);
  var reason = '';

  if (p.website) reason = 'hidden field filled in';
  else if (!p.elapsed || isNaN(elapsed)) reason = 'not sent from the website form';
  else if (elapsed < GUARD_MIN_FILL_MS) reason = 'sent too fast (' + elapsed + 'ms)';
  else if (name.length < 2 || name.length > 80 || !/\p{L}/u.test(name)) reason = 'name';
  else if (/https?:\/\/|www\./i.test(name)) reason = 'link in name';
  else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email) || email.indexOf('..') !== -1) reason = 'email';
  else if (message.length < 20 || message.length > GUARD_MSG_MAX) reason = 'message length';
  else if (countWords_(message) < 3) reason = 'message is not words';

  if (reason) {
    console.log('Blocked enquiry: ' + reason + ' | ' + name + ' | ' + email);
    return false;
  }
  return true;
}

// Words that contain at least one letter, in any script
function countWords_(text) {
  return text.split(/\s+/).filter(function (w) {
    return /\p{L}/u.test(w);
  }).length;
}
