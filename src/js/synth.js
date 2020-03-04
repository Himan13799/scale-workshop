/**
 * synth.js
 * Web audio synth
 */

/* global jQuery */
import { isNil, tap, debug, getCoordsFromKey } from './helpers/general.js'
import { model, synth } from './scaleworkshop.js'

// keyCodeToMidiNote()
// it turns a keycode to a MIDI note based on this reference layout:
//
//   1  2  3  4  5  6  7  8  9  0  -  =
//    Q  W  E  R  T  Y  U  I  O  P  [  ]
//     A  S  D  F  G  H  J  K  L  ;  '  \
//      Z  X  C  V  B  N  M  ,  .  /
//
function keyCodeToMidiNote(keycode) {
  const tuningTable = model.get('tuning table')
  // get row/col vals from the keymap
  const key = synth.keymap[keycode]

  if (isNil(key)) {
    // return false if there is no note assigned to this key
    return false
  } else {
    const [row, col] = key
    return row * synth.isomorphicMapping.vertical + col * synth.isomorphicMapping.horizontal + tuningTable.baseMidiNote
  }
}

function touchToMidiNote([row, col]) {
  const tuningTable = model.get('tuning table')
  if (isNil(row) || isNil(col)) {
    return false
  } else {
    return row * synth.isomorphicMapping.vertical + col * synth.isomorphicMapping.horizontal + tuningTable.baseMidiNote
  }
}

// isQueryActive()
// check if qwerty key playing should be active
// returns true if focus is in safe area for typing
// returns false if focus is on an input or textarea element
function isQueryActive() {
  jQuery('div#qwerty-indicator').empty()
  const focus = document.activeElement.tagName
  if (focus === 'TEXTAREA' || focus === 'INPUT') {
    jQuery('div#qwerty-indicator').html(
      '<img src="" style="float:right" /><h4><span class="glyphicon glyphicon glyphicon-volume-off" aria-hidden="true" style="color:#d9534f"></span> Keyboard disabled</h4><p>Click here to enable QWERTY keyboard playing.</p>'
    )
    return false
  } else {
    jQuery('div#qwerty-indicator').html(
      '<img src="" style="float:right" /><h4><span class="glyphicon glyphicon glyphicon-volume-down" aria-hidden="true"></span> Keyboard enabled</h4><p>Press QWERTY keys to play current tuning.</p>'
    )
    return true
  }
}

function initSynth() {
  // KEYDOWN -- capture keyboard input
  document.addEventListener('keydown', function(event) {
    // bail if focus is on an input or textarea element
    if (!isQueryActive()) {
      return false
    }

    // bail, if a modifier is pressed alongside the key
    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
      return false
    }

    const midiNote = keyCodeToMidiNote(event.which) // midi note number 0-127
    const velocity = 100

    if (midiNote !== false) {
      event.preventDefault()
      synth.noteOn(midiNote, velocity)
    }
  })

  // KEYUP -- capture keyboard input
  document.addEventListener('keyup', function(event) {
    // bail, if a modifier is pressed alongside the key
    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
      return false
    }
    const midiNote = keyCodeToMidiNote(event.which)
    if (midiNote !== false) {
      event.preventDefault()
      synth.noteOff(midiNote)
    }
  })

  // TOUCHSTART -- virtual keyboard
  jQuery('#virtual-keyboard').on('touchstart', 'td', function(event) {
    event.preventDefault()
    jQuery(event.originalEvent.targetTouches[0].target).addClass('active')
    synth.noteOn(tap(debug, touchToMidiNote(getCoordsFromKey(event.target))))
  })

  // TOUCHEND -- virtual keyboard
  jQuery('#virtual-keyboard').on('touchend', 'td', function(event) {
    event.preventDefault()
    jQuery(event.originalEvent.changedTouches[0].target).removeClass('active')
    synth.noteOff(tap(debug, touchToMidiNote(getCoordsFromKey(event.target))))
  })
}

export { touchToMidiNote, isQueryActive, initSynth }
