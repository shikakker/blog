export function canUpdateUserSettings({ sessionUserId, targetUserId }) {
  return (
    typeof sessionUserId === 'string' &&
    sessionUserId.length > 0 &&
    typeof targetUserId === 'string' &&
    targetUserId.length > 0 &&
    sessionUserId === targetUserId
  );
}
