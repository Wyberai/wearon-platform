// Identifies an anonymous buyer across wishlist, orders, and checkout —
// buyers never authenticate, so this localStorage id is the only thread
// tying their actions together.
export function getOrCreateDeviceToken(): string {
  let token = localStorage.getItem('wearon_device_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('wearon_device_token', token)
  }
  return token
}
