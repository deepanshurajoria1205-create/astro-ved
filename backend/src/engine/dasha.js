import { DASHA_YEARS, DASHA_ORDER } from './ephemeris.js'

export function calculateVimshottariDasha(dashaStartIdx, julianDay, birthJD) {
  const yearsSinceBirth = (julianDay - birthJD) / 365.25
  const dashas = []
  let cum = 0
  for (let i = 0; i < 9; i++) {
    const planet = DASHA_ORDER[(dashaStartIdx+i)%9]
    const years = DASHA_YEARS[planet]
    dashas.push({planet, startYear:cum, endYear:cum+years, years})
    cum += years
  }
  const y = yearsSinceBirth % 120
  const current = dashas.find(d => y>=d.startYear && y<d.endYear) || dashas[0]
  const prog = y - current.startYear
  const antardashas = []
  let ac = 0
  for (let i = 0; i < 9; i++) {
    const ap = DASHA_ORDER[(DASHA_ORDER.indexOf(current.planet)+i)%9]
    const ay = (DASHA_YEARS[ap]*current.years)/120
    antardashas.push({planet:ap, startYear:ac, endYear:ac+ay})
    ac += ay
  }
  const currentAntar = antardashas.find(a => prog>=a.startYear && prog<a.endYear) || antardashas[0]
  const remainingYears = current.endYear - y
  const endDate = new Date(Date.now() + remainingYears*365.25*86400000).toISOString().split('T')[0]
  return {current:current.planet, subDasha:currentAntar.planet, endDate, allDashas:dashas}
}