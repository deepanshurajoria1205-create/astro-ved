export function detectYogas(planets, houses) {
  const yogas = [], doshas = []
  const p = name => planets.find(x => x.name===name)
  const KENDRAS=[1,4,7,10], TRIKONAS=[1,5,9]
  const moon=p('Chandra'),sun=p('Surya'),jup=p('Guru'),mar=p('Mangal'),sat=p('Shani'),ven=p('Shukra'),mer=p('Budha'),rahu=p('Rahu'),ketu=p('Ketu')

  if (moon&&jup) {
    const diff=Math.abs(moon.house-jup.house)
    const rel=diff===0?1:(diff>6?12-diff+1:diff+1)
    if(KENDRAS.includes(rel)) yogas.push({name:'Gajakesari Yoga',strength:'Strong',desc:'Moon and Jupiter in mutual kendras — wisdom, prosperity and lasting fame.'})
  }
  if (sun&&mer&&sun.house===mer.house) yogas.push({name:'Budhaditya Yoga',strength:'Moderate',desc:'Sun and Mercury conjunct — sharp intellect and success in knowledge-based fields.'})
  if (jup&&KENDRAS.includes(jup.house)&&['Own sign','Exalted'].includes(jup.dignity)) yogas.push({name:'Hamsa Yoga',strength:'Strong',desc:'Jupiter in kendra in own/exalted sign — righteousness, wisdom and spiritual elevation.'})
  if (ven&&KENDRAS.includes(ven.house)&&['Own sign','Exalted'].includes(ven.dignity)) yogas.push({name:'Malavya Yoga',strength:'Strong',desc:'Venus in kendra in own/exalted sign — beauty, luxury and marital happiness.'})
  if (mar&&KENDRAS.includes(mar.house)&&['Own sign','Exalted'].includes(mar.dignity)) yogas.push({name:'Ruchaka Yoga',strength:'Strong',desc:'Mars in kendra in own/exalted sign — courage, command and physical excellence.'})

  const lord2=houses.find(h=>h.house===2)?.lord, lord11=houses.find(h=>h.house===11)?.lord
  const p2=planets.find(x=>x.name===lord2), p11=planets.find(x=>x.name===lord11)
  if((p2&&[...KENDRAS,...TRIKONAS].includes(p2.house))||(p11&&[...KENDRAS,...TRIKONAS].includes(p11.house)))
    yogas.push({name:'Dhana Yoga',strength:'Moderate',desc:'Lords of wealth houses well-placed — financial prosperity and resource accumulation.'})

  if(mar&&[1,2,4,7,8,12].includes(mar.house)) doshas.push({name:'Mangal Dosha',severity:[7,8].includes(mar.house)?'Severe':'Mild',desc:`Mars in house ${mar.house} affects partnerships. Remedy: Hanuman Chalisa on Tuesdays, donate red lentils.`})

  if(rahu&&ketu) {
    const allBetween=planets.filter(x=>!['Rahu','Ketu'].includes(x.name)).every(x=>{
      const r=rahu.lon||0,k=ketu.lon||0,l=x.lon||0
      return r>k?(l>r||l<k):(l>r&&l<k)
    })
    if(allBetween) doshas.push({name:'Kaal Sarpa Dosha',severity:'Moderate',desc:'All planets between Rahu-Ketu axis. Remedy: Kaal Sarpa puja, daily Maha Mrityunjaya mantra.'})
  }
  return {yogas,doshas}
}