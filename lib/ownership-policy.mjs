export function canMutateOwnedResource({ actorUserId, ownerUserId }) {
  return (
    typeof actorUserId === 'string' &&
    actorUserId.length > 0 &&
    typeof ownerUserId === 'string' &&
    ownerUserId.length > 0 &&
    actorUserId === ownerUserId
  );
}
