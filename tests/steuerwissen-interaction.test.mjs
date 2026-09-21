// Behavioural test for the pointer-gesture classifier shipped inside steuerwissen/index.html.
//
// The view is deployed as a single self-contained file (copying only index.html must never break it),
// so the classifier cannot live in its own module. It is instead fenced with markers and evaluated
// here, which keeps this a real behavioural test rather than a regex check.

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

let passed = 0;

function runTest(name, fn) {
    try {
        fn();
        passed += 1;
        console.log(`PASS ${name}`);
    } catch (error) {
        console.error(`FAIL ${name}`);
        console.error(error);
        process.exitCode = 1;
    }
}

const html = readFileSync(new URL('../steuerwissen/index.html', import.meta.url), 'utf8');

const fenced = html.match(/\/\/ joyboard-swipe-start[^\n]*\n([\s\S]*?)\/\/ joyboard-swipe-end/);
assert.ok(fenced, 'index.html must fence the gesture classifier with joyboard-swipe-start/end');

const {classifyPointerGesture, SWIPE_THRESHOLD_PX} = new Function(
    `${fenced[1]}; return {classifyPointerGesture, SWIPE_THRESHOLD_PX};`
)();

runTest('a tap in place shows the next entry', () => {
    assert.equal(classifyPointerGesture(0, 0), 'tap');
});

runTest('a small wobble still counts as a tap', () => {
    assert.equal(classifyPointerGesture(6, -4), 'tap');
    assert.equal(classifyPointerGesture(SWIPE_THRESHOLD_PX, 0), 'tap');
});

runTest('a long drag to the left is a left swipe', () => {
    assert.equal(classifyPointerGesture(-280, 12), 'swipe-left');
});

runTest('a long drag to the right is a right swipe', () => {
    assert.equal(classifyPointerGesture(280, -12), 'swipe-right');
});

runTest('a mostly vertical drag stays a tap, so scrolling does not jump the board', () => {
    assert.equal(classifyPointerGesture(60, 400), 'tap');
});

runTest('the threshold matches the board (scripts/board-interaction-utils.mjs)', () => {
    assert.equal(SWIPE_THRESHOLD_PX, 50);
});

runTest('a swipe is forwarded to the board instead of drawing the next fact', () => {
    assert.match(html, /window\.parent\.postMessage\(\{ joyboard: "swipe", direction:/);
    assert.match(html, /if \(window\.parent === window\) return false;/);
    assert.match(html, /data\.joyboard !== "swipe-ack"/);
    // a tap advances; a swipe only advances when the board did not take it
    assert.match(html, /if \(gesture === "tap"\) \{ next\(\); return; \}/);
    assert.match(html, /if \(!\(await notifyBoard\(gesture\)\)\) next\(\);/);
});

runTest('the page still advances on keyboard input when opened standalone', () => {
    assert.match(html, /\[" ", "Enter", "ArrowRight"\]\.includes\(e\.key\)/);
});

runTest('the view stays a single deployable file (no local module imports)', () => {
    assert.doesNotMatch(html, /<script[^>]+type="module"/);
    assert.doesNotMatch(html, /\bimport\s+.*from\s+["']\.\//);
});

console.log(`\n${passed} test(s) passed`);
