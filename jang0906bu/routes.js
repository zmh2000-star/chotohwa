// Place tokens captured from Naver Maps driving directions on 2026-09-05.
// These are Naver's opaque map coordinates, not fabricated latitude/longitude.
export const points={
 museum:['3zf5WH','2zTV47','국립부여박물관소형주차장','1657390191'],
 noodles:['3zfm3s','2zUx75','메밀꽃필무렵','12061415'],
 boat:['3zeJpB','2zUutw','구드래나루터 공영 주차장','172434057'],
 cosmos:['3zelzf','2zTUDJ','백마강생활체육공원주차장입구','1935086604'],
 resort:['3zetBj','2zV4Ky','롯데리조트부여주차장','31584128'],
 night:['3zettE','2zV7gO','백제문화단지제1주차장','1807529295'],
 pond:['3zeWEW','2zTJ5U','궁남지무료주차장','21274196'],
 tombs:['3zg8Yl','2zTTlM','부여왕릉원입구','17739505'],
 soup:['3zeSSL','2zU9Rq','부여중앙시장주차장','33011249'],
 pagoda:['3zeYFz','2zU2Rn','석탑로 노상 공영 주차장','863087760']
};
const token=id=>{const p=points[id];return p?`${p[0]},${p[1]},${encodeURIComponent(p[2])},${p[3]},PLACE_POI`:'-';};
export function drivingRoute(ids){if(!ids.length||ids.some(id=>!points[id]))return null;const via=ids.slice(1,-1).map(token).join(':')||'-';return `https://map.naver.com/p/directions/${ids.length>1?token(ids[0]):'-'}/${token(ids.at(-1))}/${via}/car?c=13.00,0,0,0,dh`;}
export function dayRoute(plan,day,moved){const relaxed=plan===1||moved;return drivingRoute(day==='sun'?(relaxed?['museum','noodles','resort','night']:['museum','noodles','boat','cosmos','resort','night']):(relaxed?['resort','pagoda','soup','boat','pond']:['resort','tombs','soup','pagoda','pond']));}
