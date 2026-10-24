import assert from "node:assert/strict";
import { test } from "node:test";
import { gazeFor } from "../lib/gaze.ts";

test("gaze maps pointer offsets to the eight directions", () => {
  assert.equal(gazeFor(5, 5, 50), "center");
  assert.equal(gazeFor(100, 0, 50), "right");
  assert.equal(gazeFor(-100, 0, 50), "left");
  assert.equal(gazeFor(0, -100, 50), "up");
  assert.equal(gazeFor(0, 100, 50), "down");
  assert.equal(gazeFor(-100, -100, 50), "up-left");
  assert.equal(gazeFor(100, 100, 50), "down-right");
  assert.equal(gazeFor(-100, 1, 50), "left"); // wraps at ±180°
});
