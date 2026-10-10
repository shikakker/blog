import test from 'node:test';
import assert from 'node:assert/strict';
import { canMutateOwnedResource } from '../lib/ownership-policy.mjs';

test('resource mutation requires authenticated owner identity', () => {
  assert.equal(canMutateOwnedResource({ actorUserId: undefined, ownerUserId: 'u1' }), false);
  assert.equal(canMutateOwnedResource({ actorUserId: 'u1', ownerUserId: 'u2' }), false);
  assert.equal(canMutateOwnedResource({ actorUserId: 'u1', ownerUserId: 'u1' }), true);
});
