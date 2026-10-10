import test from 'node:test';
import assert from 'node:assert/strict';
import { canUpdateUserSettings } from '../lib/settings-auth.mjs';

test('user settings can only be updated by the same authenticated user', () => {
  assert.equal(canUpdateUserSettings({ sessionUserId: undefined, targetUserId: 'u1' }), false);
  assert.equal(canUpdateUserSettings({ sessionUserId: 'u1', targetUserId: 'u2' }), false);
  assert.equal(canUpdateUserSettings({ sessionUserId: 'u1', targetUserId: 'u1' }), true);
});
