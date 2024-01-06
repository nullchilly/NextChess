(()=>{var e={};e.id=217,e.ids=[217],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},32081:e=>{"use strict";e.exports=require("child_process")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},41808:e=>{"use strict";e.exports=require("net")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},24404:e=>{"use strict";e.exports=require("tls")},76224:e=>{"use strict";e.exports=require("tty")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},74207:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>d,originalPathname:()=>p,pages:()=>u,routeModule:()=>m,tree:()=>c});var s=r(67096),n=r(16132),o=r(37284),i=r.n(o),a=r(32564),l={};for(let e in a)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);r.d(t,l);let c=["",{children:["human",{children:["[slug]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,22798)),"/home/nullchilly/code/git/web101/src/app/human/[slug]/page.tsx"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,21670)),"/home/nullchilly/code/git/web101/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,9291,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],u=["/home/nullchilly/code/git/web101/src/app/human/[slug]/page.tsx"],p="/human/[slug]/page",d={require:r,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/human/[slug]/page",pathname:"/human/[slug]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},90521:(e,t,r)=>{Promise.resolve().then(r.bind(r,15944))},15944:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>x});var s=r(53854),n=r(55100),o=r(15656),i=r(34218),a=r(94574);function l(e,t){return{...e,...t}}let c=({id:e,userId:t,name:r})=>{let[s,n]=(0,i.useState)(null),[c,u]=(0,i.useState)(0),[p,d]=(0,i.useState)("w"),[m,h]=(0,i.useState)(!1),[x,g]=(0,i.useState)(new o.qQ),[f,w]=(0,i.useState)("start"),[y,b]=(0,i.useState)(""),[v,j]=(0,i.useReducer)(l,{check:{}}),[q,k]=(0,i.useState)("unknown"),P=(0,i.useCallback)(()=>{s?.close(),n(null)},[s]);(0,i.useEffect)(()=>{s&&(s.connect(),s.on("connect",()=>{console.log("Connected",s.id)}),s.on("human-user-forfeit",async e=>{console.log(e),k("white")}),s.on("human-new-player-join",async e=>{console.log("JOINED:",e);try{let t=JSON.parse(e);if(t.ok){let e=t.numberPlayer,r=t.config.color,s=t.config.opponentName;u(e),h(2===e),("w"===r||"b"===r)&&d(r),"string"==typeof s&&b(s)}else"boolean"==typeof t.playable&&h(t.playable),("w"===t.color||"b"===t.color)&&d(t.color)}catch(e){console.error("[!!!] Error when new user join: ",e)}}),s.on("human-play-chess",async e=>{console.log("MOVE socket: ",e);try{let t=JSON.parse(e);if(t.ok){if(t.result){let e=t.result.winner,r=t.result.reason;console.log("Reason: ",r),await new Promise(e=>setTimeout(e,1200)),k(0===e?"draw":1===e?"white":"black")}console.log("Opponent move: ",t.move),E(t.move)}else console.error("[!!!] response not ok: ",t.error)}catch(e){console.error("[!!!] Error when new user join: ",e)}}))},[P,s]),(0,i.useEffect)(()=>{s||!t||m||S()},[t]);let S=()=>{let e=(0,a.io)("http://fall2324w3g9.int3306.freeddns.org",{autoConnect:!1,reconnection:!0});!m&&t&&_(t??1,e),n(e)},_=(t,s)=>{s.emit("human-new-player-join",JSON.stringify({id:e,userId:t,name:r}))},E=e=>{console.log(e);let t=x.move(e);if(t){let e;if(w(x.fen()),g(x),console.log(x.inCheck()),x.inCheck()){let t=x.board().reduce((e,t,r)=>{let s=t.findIndex(e=>(e?.type=="k"&&console.log(e),e&&"k"===e.type&&e.color===x.turn()));return s>=0?`${String.fromCharCode(s+97)}${8-r}`:e},"");e={[t]:{background:"radial-gradient(red, rgba(255,0,0,.8), transparent 70%)",borderRadius:"50%"}}}console.log(e),j({check:e})}return t},N=t=>{console.log("MOVE: ",t),s?.emit("human-play-chess",JSON.stringify({move:t,id:e,turn:p}))};return{socket:s,winner:q,forfeitGame:()=>{s?.emit("human-user-forfeit",JSON.stringify({id:e,winner:y})),k("black")},customSquares:v,playable:m,pieceColor:p,onPieceDrop:(e,t)=>{if(!m)return!1;let r=E({from:e,to:t,promotion:"q"});return null!==r&&(N(r.from+r.to+(r.promotion?r.promotion:"")),!0)},game:x,gameFen:f,setGameFen:w,opponentName:y}};var u=r(79636),p=r(33367),d=r(3314),m=r(56495),h=r(65805);let x=({id:e})=>{let{userId:t,name:r}=(0,i.useContext)(n.UserContext),[o,a]=(0,i.useState)(""),[l,x]=(0,i.useState)(!0);(0,i.useEffect)(()=>{},[]);let{socket:g,winner:f,forfeitGame:w,customSquares:y,playable:b,pieceColor:v,onPieceDrop:j,game:q,gameFen:k,setGameFen:P,opponentName:S}=c({id:e,userId:t,name:r});return(0,s.jsxs)(s.Fragment,{children:[s.jsx("div",{className:"p-4",children:b?"May the best man win":`To invite someone to play, give this URL: ${o}`}),(0,s.jsxs)("div",{className:"flex p-4 mt-8",children:[s.jsx("div",{className:"flex justify-center w-2/3",children:(0,s.jsxs)("div",{className:"w-[500px]",children:[(0,s.jsxs)("span",{className:`text-l ${"b"===q.turn()?"text-black":"text-white"} font-mono flex items-center pb-3 pt-0.5`,children:[" ","w"===q.turn()?"White turn":"Black turn"," "]}),s.jsx("div",{children:s.jsx(p.Z,{name:S,link:""})}),s.jsx(u.r,{id:e,onPieceDrop:j,boardOrientation:"b"===v?"black":"white",isDraggablePiece:function(e){return e.piece.startsWith(v)},position:k,customBoardStyle:{borderRadius:"8px",boxShadow:"0 2px 10px rgba(0, 0, 0, 0.5)"},customSquareStyles:{...y.check}}),s.jsx("div",{children:s.jsx(p.Z,{name:r??"Guest",link:""})})]})}),s.jsx("div",{className:"flex justify-center w-1/3",children:s.jsx("div",{children:b?(0,s.jsxs)(s.Fragment,{children:[s.jsx(d.Z,{moves:q.history({verbose:!0}).reverse(),bot:{id:"0",name:"shark"}}),s.jsx("div",{className:"flex gap-4 mt-4",children:s.jsx(h.z,{className:"w-full",onClick:()=>w(),children:"Forfeit"})})]}):null})}),"unknown"===f?null:s.jsx(m.Z,{winner:f,isOpen:l,setOpen:x})]})]})}},22798:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>p,generateStaticParams:()=>u});var s=r(4656),n=r(95153);let o=(0,n.createProxy)(String.raw`/home/nullchilly/code/git/web101/src/components/HumanChessGame/HumanChessGame.tsx`),{__esModule:i,$$typeof:a}=o,l=o.default;var c=r(6942);async function u(){try{let e=await (0,c.A)();return console.log("PAGE: ",e),e.map(e=>({slug:e}))}catch(e){return console.error("ERROR: ",e),[]}}let p=({params:{slug:e}})=>s.jsx(l,{id:e})},6942:(e,t,r)=>{"use strict";async function s(){let e=await fetch("http://fall2324w3g9.int3306.freeddns.org/api/all-game-slugs",{cache:"no-store"}).then(e=>e.json());if("Success"===e.message)return e.data;throw Error(e.message??"Get game slugs error")}r.d(t,{A:()=>s})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[271,565,323,856,574,719,630,305,532,738,906,617],()=>r(74207));module.exports=s})();