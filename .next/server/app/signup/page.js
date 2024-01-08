(()=>{var e={};e.id=966,e.ids=[966],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},71017:e=>{"use strict";e.exports=require("path")},57310:e=>{"use strict";e.exports=require("url")},36502:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>c,routeModule:()=>p,tree:()=>d});var s=r(67096),a=r(16132),l=r(37284),n=r.n(l),o=r(32564),i={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(i[e]=()=>o[e]);r.d(t,i);let d=["",{children:["signup",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,82856)),"/home/nullchilly/code/git/web101/src/app/signup/page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,21670)),"/home/nullchilly/code/git/web101/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,9291,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],c=["/home/nullchilly/code/git/web101/src/app/signup/page.tsx"],u="/signup/page",m={require:r,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/signup/page",pathname:"/signup",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},21732:(e,t,r)=>{Promise.resolve().then(r.bind(r,53820))},53820:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>d});var s=r(53854),a=r(41956),l=r.n(a),n=r(21408),o=r(34218),i=r(51018);function d(){let[e,t]=(0,o.useState)({userName:"",name:"name",gender:"male",dateOfBirth:"2003-10-01",email:"",password:""}),[r,a]=(0,o.useState)(""),[d,c]=(0,o.useState)(!0),[u,m]=(0,o.useState)(!0),[p,x]=(0,o.useState)(!0),[g,h]=(0,o.useState)(!0),[b,f]=(0,o.useState)(!0),y=(0,i.useRouter)(),w=async t=>{if(t.preventDefault(),""==e.userName){x(!1);return}if(x(!0),""==e.password){m(!1);return}if(m(!0),e.password!=r){c(!1);return}if(c(!0),""==e.email){f(!1);return}if(f(!0),""==e.name){h(!1);return}h(!0);try{let t=await fetch("http://fall2324w3g9.int3306.freeddns.org/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(t.ok)y.push("/");else{let e=await t.json();alert(`${t.status}: ${e.detail} `)}}catch(e){console.error("An unexpected error occurred:",e)}},v=r=>{"cpassword"==r.target.name&&a(r.target.value),t({...e,[r.target.name]:r.target.value})};return s.jsx("div",{className:"relative flex flex-col items-center justify-center min-h-screen overflow-hidden",children:(0,s.jsxs)("div",{className:"w-full p-6 bg-white rounded-md shadow-xl lg:max-w-xl border",children:[(0,s.jsxs)("div",{className:"flex justify-center",children:[s.jsx("div",{className:"text-4xl font-extrabold text-center text-gray-800 not-italic",children:"Next Chess"}),s.jsx(l(),{className:"flex-none rounded-full ml-2",src:(0,n.vX)("b","q"),alt:"Chess Piece",width:45,height:45})]}),(0,s.jsxs)("form",{className:"mt-4",onSubmit:w,children:[s.jsx("div",{className:"mb-4",children:(0,s.jsxs)("div",{className:"mb-4",children:[s.jsx("label",{htmlFor:"username",className:"block text-lg font-bold text-gray-700",children:"Username"}),s.jsx("input",{type:"username",name:"userName",onChange:v,className:"block w-full px-2 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"}),!p&&s.jsx("p",{className:"text-red-500 text-sm",children:"Enter your Username"})]})}),(0,s.jsxs)("div",{className:"mb-",children:[s.jsx("label",{htmlFor:"password",className:"block text-lg font-bold text-gray-700",children:"Password"}),s.jsx("input",{type:"password",name:"password",onChange:v,className:"block w-full px-2 py-2 mt-2 mb-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"}),!u&&s.jsx("p",{className:"text-red-500 text-sm",children:"Enter your Password"})]}),(0,s.jsxs)("div",{className:"mb-",children:[s.jsx("label",{htmlFor:"password",className:"block text-lg font-bold text-gray-700",children:"Confirm Password"}),s.jsx("input",{type:"password",name:"cpassword",onChange:v,className:"block w-full px-2 py-2 mt-2 mb-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"}),!d&&s.jsx("p",{className:"text-red-500 text-sm",children:"Passwords do not match"})]}),(0,s.jsxs)("div",{className:"mb-",children:[s.jsx("label",{htmlFor:"email",className:"block text-lg font-bold text-gray-700",children:"Email"}),s.jsx("input",{type:"email",name:"email",onChange:v,className:"block w-full px-2 py-2 mt-2 mb-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"}),!b&&s.jsx("p",{className:"text-red-500 text-sm",children:"Enter your Email"})]}),s.jsx("div",{className:"mb-4",children:(0,s.jsxs)("div",{className:"mb-4",children:[s.jsx("label",{htmlFor:"username",className:"block text-lg font-bold text-gray-700",children:"Display name"}),s.jsx("input",{type:"name",name:"name",onChange:v,className:"block w-full px-2 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"}),!g&&s.jsx("p",{className:"text-red-500 text-sm",children:"Enter your display name"})]})}),s.jsx("button",{className:"w-full mt-6 px-4 py-2 font-bold text-white bg-gray-700 rounded-md hover:bg-gray-500",children:"Sign Up"})]})]})})}},21408:(e,t,r)=>{"use strict";r.d(t,{TO:()=>a,vX:()=>s});let s=(e,t)=>`assets/${e}_${t}.svg`;function a(e){let t=e.split("v=")[1];if(!t)throw Error("Invalid YouTube video URL");let r=`https://img.youtube.com/vi/${t}/0.jpg`;return r}},82856:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>n,__esModule:()=>l,default:()=>i});var s=r(95153);let a=(0,s.createProxy)(String.raw`/home/nullchilly/code/git/web101/src/app/signup/page.tsx`),{__esModule:l,$$typeof:n}=a,o=a.default,i=o},73881:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var s=r(31323);let a=e=>{let t=(0,s.fillMetadataSegment)(".",e.params,"favicon.ico");return[{type:"image/x-icon",sizes:"16x16",url:t+""}]}}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[271,565,323,956,738],()=>r(36502));module.exports=s})();