/**
 * HELPER FUNCTIONS
 */

/* global alert, location, jQuery, localStorage, navigator */
import { LINE_TYPE } from '../constants.js'
import { debug_enabled, resetTuningTable } from '../scaleworkshop.js'
import { toString } from './converters.js'

function isCent(rawInput) {
  // true, when the input has numbers at the beginning, followed by a dot, ending with any number of numbers
  // for example: 700.00
  const input = trim(toString(rawInput))
  return /^\d+\.\d*$/.test(input)
}

function isCommaDecimal(rawInput) {
  // true, when the input has numbers at the beginning, followed by a comma, ending with any number of numbers
  // for example: 1,25
  const input = trim(toString(rawInput))
  return /^\d+\,\d*$/.test(input);
}

function isNOfEdo(rawInput) {
  // true, when the input has numbers at the beginning and the end, separated by a single backslash
  // for example: 7\12
  const input = trim(toString(rawInput))
  return /^\d+\\\d+$/.test(input)
}

function isRatio(rawInput) {
  // true, when the input has numbers at the beginning and the end, separated by a single slash
  // for example: 3/2
  const input = trim(toString(rawInput))
  return /^\d+\/\d+$/.test(input)
}

function getLineType(rawInput) {
  if (isCent(rawInput)) {
    return LINE_TYPE.CENTS
  } else if (isCommaDecimal(rawInput)) {
    return LINE_TYPE.DECIMAL
  } else if (isNOfEdo(rawInput)) {
    return LINE_TYPE.N_OF_EDO
  } else if (isRatio(rawInput)) {
    return LINE_TYPE.RATIO
  } else {
    return LINE_TYPE.INVALID
  }
}

// clear all inputted scale data
function clear_all() {

  // empty text fields
  jQuery("#txt_tuning_data").val("");
  jQuery("#txt_name").val("");

  // empty any information displayed on page
  jQuery("#tuning-table").empty();

  // restore default base tuning
  jQuery("#txt_base_frequency").val(440);
  jQuery("#txt_base_midi_note").val(69);

  resetTuningTable()
}

function debug(msg = "") {
  if (debug_enabled) {
    msg = isEmpty(msg) ? "Debug" : msg;
    console.log(msg);
    return true;
  }
  return false;
}

function setScaleName(title) {
  jQuery("#txt_name").val(title);
}

function closePopup(id) {
  jQuery(id).dialog("close");
}

function setTuningData(tuning) {
  jQuery("#txt_tuning_data").val(tuning)
}

const isEmpty = string => string === ''

const isNil = x => typeof x === 'undefined' || x === null

const isFunction = x => typeof x === 'function'

const trim = input => input.trim()

function getCoordsFromKey(tdOfKeyboard) {
  try {
    return JSON.parse(tdOfKeyboard.getAttribute('data-coord'))
  } catch (e) {
    return []
  }
}

// Runs the given function with the supplied value, then returns the value
// This is a great tool for injecting debugging in the middle of expressions
// Note: fn does not need to return the value, tap will handle that
//
// example 1: const result = toString(tap(function(result){ debug(result) }, 3 * 5))
// example 2: const result = toString(tap(result => debug(result), 3 * 5))
// example 3: const result = toString(tap(debug, 3 * 5))
//
// the above examples are equal to:
//   let result = 3 * 5
//   debug(result)
//   result = toString(result)
function tap(fn, value) {
  fn(value)
  return value
}


function getSearchParamOr (valueIfMissing, key, url) {
  return url.searchParams.has(key) ? url.searchParams.get(key) : valueIfMissing
}

function getSearchParamAsNumberOr (valueIfMissingOrNan, key, url) {
  return (url.searchParams.has(key) && !isNaN(url.searchParams.get(key))) ? parseFloat(url.searchParams.get(key)) : valueIfMissingOrNan;
}

function trimSelf (el) {
  jQuery(el).val(function (idx, val) {
    return val.trim()
  })
}

function openDialog (el, onOK) {
  jQuery(el).dialog({
    modal: true,
    buttons: {
      OK: onOK,
      Cancel: function() {
        jQuery( this ).dialog( 'close' );
      }
    }
  })
}

// redirect all traffic to https, if not there already
// source: https://stackoverflow.com/a/4723302/1806628
function redirectToHTTPS() {
  if (location.protocol !== 'https:') {
    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
  }
}

// source: https://stackoverflow.com/a/16427747/1806628
const isLocalStorageAvailable = () => {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

// source: https://stackoverflow.com/a/9514476/1806628
const isRunningOnWindows = () => {
  return navigator.userAgent.userAgent.includes('Windows')
}

export {
  isCent,
  isRatio,
  isCommaDecimal,
  isNOfEdo,
  getLineType,
  clear_all,
  debug,
  setScaleName,
  closePopup,
  setTuningData,
  isEmpty,
  isFunction,
  isNil,
  trim,
  getCoordsFromKey,
  tap,
  getSearchParamOr,
  getSearchParamAsNumberOr,
  trimSelf,
  openDialog,
  redirectToHTTPS,
  isLocalStorageAvailable,
  isRunningOnWindows
}
