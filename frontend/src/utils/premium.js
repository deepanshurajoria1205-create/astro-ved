export function getPremiumToken() {
  return localStorage.getItem('jyotish_premium_token')
}

export function isPremiumUser() {
  const token = getPremiumToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch(e) { return false }
}

export function getPremiumHeaders() {
  const token = getPremiumToken()
  return token ? { 'x-premium-token': token } : {}
}

export function clearPremium() {
  localStorage.removeItem('jyotish_premium_token')
  localStorage.removeItem('jyotish_premium_plan')
}