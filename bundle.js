var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(e)}function o(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e){t.appendChild(e)}function r(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function c(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function d(){return u(" ")}function f(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function m(t,e){e=""+e,t.data!==e&&(t.data=e)}function p(t,e){(null!=e||t.value)&&(t.value=e)}function g(t,e,n,s){t.style.setProperty(e,n,s?"important":"")}let v;function b(t){v=t}const k=[],y=[],$=[],w=[],_=Promise.resolve();let M=!1;function x(t){$.push(t)}let D=!1;const S=new Set;function E(){if(!D){D=!0;do{for(let t=0;t<k.length;t+=1){const e=k[t];b(e),T(e.$$)}for(k.length=0;y.length;)y.pop()();for(let t=0;t<$.length;t+=1){const e=$[t];S.has(e)||(S.add(e),e())}$.length=0}while(k.length);for(;w.length;)w.pop()();M=!1,D=!1,S.clear()}}function T(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(x)}}const A=new Set;function j(t,e){t&&t.i&&(A.delete(t),t.i(e))}function I(t,e){t.d(1),e.delete(t.key)}function L(t,e,n,s,o,a,l,r,i,c,u,d){let f=t.length,h=a.length,m=f;const p={};for(;m--;)p[t[m].key]=m;const g=[],v=new Map,b=new Map;for(m=h;m--;){const t=d(o,a,m),r=n(t);let i=l.get(r);i?s&&i.p(t,e):(i=c(r,t),i.c()),v.set(r,g[m]=i),r in p&&b.set(r,Math.abs(m-p[r]))}const k=new Set,y=new Set;function $(t){j(t,1),t.m(r,u,l.has(t.key)),l.set(t.key,t),u=t.first,h--}for(;f&&h;){const e=g[h-1],n=t[f-1],s=e.key,o=n.key;e===n?(u=e.first,f--,h--):v.has(o)?!l.has(s)||k.has(s)?$(e):y.has(o)?f--:b.get(s)>b.get(o)?(y.add(s),$(e)):(k.add(o),f--):(i(n,l),f--)}for(;f--;){const e=t[f];v.has(e.key)||i(e,l)}for(;h;)$(g[h-1]);return g}function P(t,n,a){const{fragment:l,on_mount:r,on_destroy:i,after_update:c}=t.$$;l&&l.m(n,a),x(()=>{const n=r.map(e).filter(o);i?i.push(...n):s(n),t.$$.on_mount=[]}),c.forEach(x)}function C(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function q(t,e){-1===t.$$.dirty[0]&&(k.push(t),M||(M=!0,_.then(E)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function H(e,o,a,l,r,c,u=[-1]){const d=v;b(e);const f=o.props||{},h=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:r,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:n(),dirty:u};let m=!1;if(h.ctx=a?a(e,f,(t,n,...s)=>{const o=s.length?s[0]:n;return h.ctx&&r(h.ctx[t],h.ctx[t]=o)&&(h.bound[t]&&h.bound[t](o),m&&q(e,t)),n}):[],h.update(),m=!0,s(h.before_update),h.fragment=!!l&&l(h.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);h.fragment&&h.fragment.l(t),t.forEach(i)}else h.fragment&&h.fragment.c();o.intro&&j(e.$$.fragment),P(e,o.target,o.anchor),E()}b(d)}class z{$destroy(){C(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function B(e){let n,s;return{c(){n=c("details"),n.innerHTML='<summary>開啟留言</summary> \n  <div><div id="disqus_thread"></div></div>',h(n,"class","svelte-wm0xa8")},m(t,o,a){r(t,n,o),a&&s(),s=f(n,"toggle",e[0])},p:t,i:t,o:t,d(t){t&&i(n),s()}}}function R(t){let e;return[function(t){var n,s;console.log(1111111111,t),e=t.target.open,e&&(console.log("initDisqus"),window.DISQUS?window.DISQUS.reset({reload:!0}):(n=document,(s=n.createElement("script")).src="https://rplus-youbike-map.disqus.com/embed.js",s.setAttribute("data-timestamp",+new Date),(n.head||n.body).appendChild(s)))}]}class N extends z{constructor(t){super(),H(this,t,R,B,a,{})}}function Y(t,e,n){const s=t.slice();return s[14]=e[n],s}function F(t,e,n){const s=t.slice();return s[14]=e[n],s}function O(t){let e,n=[],s=new Map,o=t[2].slice(0,5);const a=t=>t[14].sno;for(let e=0;e<o.length;e+=1){let l=F(t,o,e),r=a(l);s.set(r,n[e]=Q(r,l))}return{c(){e=c("div");for(let t=0;t<n.length;t+=1)n[t].c();h(e,"class","map svelte-1kt7hsn")},m(t,s){r(t,e,s);for(let t=0;t<n.length;t+=1)n[t].m(e,null)},p(t,o){if(4&o){const l=t[2].slice(0,5);n=L(n,o,a,1,t,l,s,e,I,Q,null,F)}},d(t){t&&i(e);for(let t=0;t<n.length;t+=1)n[t].d()}}}function Q(t,e){let n,s,o;return{key:t,first:null,c(){n=c("div"),h(n,"class","map-point svelte-1kt7hsn"),h(n,"data-name",s=e[14].sna),h(n,"data-bike",o=e[14].sbi),g(n,"--d",e[14]._d),g(n,"--a",e[14]._a),this.first=n},m(t,e){r(t,n,e)},p(t,e){4&e&&s!==(s=t[14].sna)&&h(n,"data-name",s),4&e&&o!==(o=t[14].sbi)&&h(n,"data-bike",o),4&e&&g(n,"--d",t[14]._d),4&e&&g(n,"--a",t[14]._a)},d(t){t&&i(n)}}}function U(t,e){let n,s,o,a,f,p,v,b,k,y,$,w,_,M,x,D,S,E,T,A,j,I,L,P,C,q,H,z,B,R,N,Y,F,O,Q,U,G,V=e[14].sna+"",W=e[14].tot+"",Z=e[14].sbi+"",J=e[14].bemp+"",K=e[14].distance+"",X=e[14].lat+"",tt=e[14].lng+"";return{key:t,first:null,c(){n=c("li"),s=c("div"),o=c("div"),a=c("div"),f=u(V),p=d(),v=c("div"),b=c("span"),k=u(W),y=d(),$=c("hr"),w=d(),_=c("div"),M=c("div"),x=u("車 "),D=u(Z),S=d(),E=c("div"),T=u("空 "),A=u(J),j=d(),I=c("details"),L=c("summary"),P=u(K),C=u(" m"),q=d(),H=c("a"),z=u(X),B=u(", "),R=u(tt),Y=d(),F=c("a"),O=u("_"),U=d(),h(b,"class","sum svelte-1kt7hsn"),h($,"class","svelte-1kt7hsn"),h(M,"class","bike svelte-1kt7hsn"),h(E,"class","empty svelte-1kt7hsn"),h(v,"class","numbers d-f ai-c fs-0 svelte-1kt7hsn"),h(s,"class","d-f jc-sb ai-c svelte-1kt7hsn"),h(L,"class","summary svelte-1kt7hsn"),h(H,"href",N="http://maps.google.com?q="+e[14].lat+","+e[14].lng),h(H,"target","_blank"),h(H,"title","google map link"),h(F,"class","img svelte-1kt7hsn"),g(F,"--url","url("+e[14].img+")"),h(F,"href",Q=e[14].img),h(F,"target","_blank"),h(I,"class","details svelte-1kt7hsn"),h(n,"class","item svelte-1kt7hsn"),n.value=G=e[14].sno,this.first=n},m(t,e){r(t,n,e),l(n,s),l(s,o),l(o,a),l(a,f),l(s,p),l(s,v),l(v,b),l(b,k),l(v,y),l(v,$),l(v,w),l(v,_),l(_,M),l(M,x),l(M,D),l(_,S),l(_,E),l(E,T),l(E,A),l(n,j),l(n,I),l(I,L),l(L,P),l(L,C),l(I,q),l(I,H),l(H,z),l(H,B),l(H,R),l(I,Y),l(I,F),l(F,O),l(n,U)},p(t,e){4&e&&V!==(V=t[14].sna+"")&&m(f,V),4&e&&W!==(W=t[14].tot+"")&&m(k,W),4&e&&Z!==(Z=t[14].sbi+"")&&m(D,Z),4&e&&J!==(J=t[14].bemp+"")&&m(A,J),4&e&&K!==(K=t[14].distance+"")&&m(P,K),4&e&&X!==(X=t[14].lat+"")&&m(z,X),4&e&&tt!==(tt=t[14].lng+"")&&m(R,tt),4&e&&N!==(N="http://maps.google.com?q="+t[14].lat+","+t[14].lng)&&h(H,"href",N),4&e&&g(F,"--url","url("+t[14].img+")"),4&e&&Q!==(Q=t[14].img)&&h(F,"href",Q),4&e&&G!==(G=t[14].sno)&&(n.value=G)},d(t){t&&i(n)}}}function G(t){let e,n,o,a,g,v,b,k,y,$,w,_,M,x,D,S,E,T,q,H,z,B,R,F,Q,G,V,W,Z,J,K=[],X=new Map,tt=t[1]&&O(t),et=t[2];const nt=t=>t[14].sno;for(let e=0;e<et.length;e+=1){let n=Y(t,et,e),s=nt(n);X.set(s,K[e]=U(s,n))}const st=new N({});return{c(){e=c("nav"),n=c("button"),n.textContent="定位",o=d(),a=c("button"),g=u("更新"),v=d(),b=c("div"),k=c("span"),y=u("距: "),$=u(t[0]),w=u(" m"),_=d(),M=c("br"),x=d(),D=c("input"),S=d(),E=c("div"),T=c("div"),q=u(t[3]),H=d(),tt&&tt.c(),z=d(),B=c("ol");for(let t=0;t<K.length;t+=1)K[t].c();var s;R=d(),F=c("footer"),Q=c("header"),Q.innerHTML="<h1>YouBike Map</h1>",G=d(),(s=st.$$.fragment)&&s.c(),V=d(),W=c("ul"),W.innerHTML='<li>\n      GitHub: <a href="https://github.com/rplus/youbike-map">Rplus / Youbike-Map</a></li> \n    <li>\n      Relesed with: <a href="https://github.com/Rplus/youbike-map/blob/master/LICENSE">MIT license</a></li> \n    <li>\n      資料來源:\n      <br> \n      <a href="https://taipeicity.github.io/traffic_realtime/">臺北市政府 交通即時資料 開放資料專區</a></li>',h(n,"id","locate"),h(a,"id","refetch"),h(a,"data-updatetime",t[4]),h(a,"class","svelte-1kt7hsn"),h(D,"type","range"),h(D,"id","range"),h(D,"max","5000"),h(D,"min","10"),h(D,"step","50"),h(e,"class","ctrl svelte-1kt7hsn"),h(T,"class","error-message svelte-1kt7hsn"),h(B,"class","list svelte-1kt7hsn"),h(E,"class","workspace svelte-1kt7hsn"),h(Q,"class","svelte-1kt7hsn"),h(W,"class","info svelte-1kt7hsn"),h(F,"class","footer d-f svelte-1kt7hsn")},m(i,c,u){r(i,e,c),l(e,n),l(e,o),l(e,a),l(a,g),l(e,v),l(e,b),l(b,k),l(k,y),l(k,$),l(k,w),l(b,_),l(b,M),l(b,x),l(b,D),p(D,t[0]),r(i,S,c),r(i,E,c),l(E,T),l(T,q),l(E,H),tt&&tt.m(E,null),l(E,z),l(E,B);for(let t=0;t<K.length;t+=1)K[t].m(B,null);r(i,R,c),r(i,F,c),l(F,Q),l(F,G),P(st,F,null),l(F,V),l(F,W),Z=!0,u&&s(J),J=[f(n,"click",t[5]),f(a,"click",t[6]),f(D,"change",t[13]),f(D,"input",t[13])]},p(t,[e]){if((!Z||16&e)&&h(a,"data-updatetime",t[4]),(!Z||1&e)&&m($,t[0]),1&e&&p(D,t[0]),(!Z||8&e)&&m(q,t[3]),t[1]?tt?tt.p(t,e):(tt=O(t),tt.c(),tt.m(E,z)):tt&&(tt.d(1),tt=null),4&e){const n=t[2];K=L(K,e,nt,1,t,n,X,B,I,U,null,Y)}},i(t){Z||(j(st.$$.fragment,t),Z=!0)},o(t){!function(t,e,n,s){if(t&&t.o){if(A.has(t))return;A.add(t),(void 0).c.push(()=>{A.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}}(st.$$.fragment,t),Z=!1},d(t){t&&i(e),t&&i(S),t&&i(E),tt&&tt.d();for(let t=0;t<K.length;t+=1)K[t].d();t&&i(R),t&&i(F),C(st),s(J)}}}function V(t,e,n){let s=1e3,o=null,a=[];const l={enableHighAccuracy:!0,timeout:5e3,maximumAge:0};function r(){return new Promise((t,e)=>{navigator.geolocation.getCurrentPosition(t,e,l)})}async function i(){let t=await r();n(1,o={lat:t.coords.latitude,lng:t.coords.longitude,acc:t.coords.accuracy}),console.log("setLocate",o)}async function c(){i(),console.log("fetchData");try{const t=await fetch("https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json"),e=await t.json();n(7,a=Object.values(e.retVal)),console.log("fetchData done",e)}catch(t){n(3,m=t),console.error(123,t)}n(4,p=new Intl.DateTimeFormat("zh-TW",{timeStyle:"medium",hour12:!1}).format(new Date))}function u(t,e,n){return console.log("getRecentPoints"),t=t.map(t=>(t.img=d(t),t)),n&&(t=t.filter(t=>{const s=function(t){let[e,n,s,o]=t;if(!(e&&n&&s&&o))return null;[e,n,s,o]=t.map(t=>t*Math.PI/180);const a=Math.sin(n)*Math.sin(o)+Math.cos(e-s)*Math.cos(n)*Math.cos(o);return 6371e3*Math.acos(a)}([n.lng,n.lat,t.lng,t.lat]);t.distance=s.toFixed();let o=t.lng-n.lng,a=t.lat-n.lat;return t._d=t.distance/e,t._a=Math.atan2(a,o)/Math.PI*180,s<e})),t.sort((t,e)=>t.distance-e.distance)}function d(t,e=300){let n,s=t;return o&&(s=o,n=t),`https://maps.googleapis.com/maps/api/staticmap?size=${e}x${e}&center=${s.lat},${s.lng}&markers=size:mid|${s.lat},${s.lng}`+(n?`&markers=color:yellow|label:T|${n.lat},${n.lng}`:"")+"&key=AIzaSyCjDnDGv67nvhzBsLRYAwTbiF1HrZBQDUM"}let f,h,m,p;return c(),t.$$.update=()=>{131&t.$$.dirty&&n(2,f=u(a,s,o)),2&t.$$.dirty&&(h=o?`&markers=${o.lat},${o.lng}`:void 0)},n(3,m=""),n(4,p=""),[s,o,f,m,p,i,c,a,h,l,r,u,d,function(){var t;t=this.value,s=""===t?void 0:+t,n(0,s)}]}return new class extends z{constructor(t){super(),H(this,t,V,G,a,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
