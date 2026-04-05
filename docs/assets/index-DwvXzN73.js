(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new Set([`box`,`row`,`col`,`scroll`,`sidebar`,`menu`]),t=/^(\w+)\s*(.*?)\s*\{\s*$/,n=/^\}\s*$/,r=/^\{#if\s+(\w+)\s*(==|!=)\s*"([^"]*)"\}$/,i=/^\{\/if\}$/,a=/^\{#each\s+(\w+)\s+as\s+(\w+)\}$/,o=/^\{\/each\}$/,s=/^(#{1,3})\s+(.+)$/,c=/^---+$/,l=/^>\s+(.+)$/,u=/^-\s+(.+)$/,d=/^font:\s*"([^"]+)"$/;function f(e){let t={};if(!e.trim())return t;let n=/(\w+)=(?:"([^"]*)"|([\S]+))/g,r;for(;(r=n.exec(e))!==null;){let e=r[1],n=r[2]??r[3],i=Number(n);t[e]=!isNaN(i)&&n!==``?i:n}return t}function p(e){let t=[],n=/\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\{([^}#/][^}]*)\}|\[([^\]]+)\]\(->\s*([^)]+)\)/g,r=0,i;for(;(i=n.exec(e))!==null;)i.index>r&&t.push({type:`plain`,content:e.slice(r,i.index)}),i[1]===void 0?i[2]===void 0?i[3]===void 0?i[4]===void 0?i[5]!==void 0&&i[6]!==void 0&&t.push({type:`button`,label:i[5],action:i[6].trim()}):t.push({type:`expression`,key:i[4]}):t.push({type:`code`,content:i[3]}):t.push({type:`dim`,content:i[2]}):t.push({type:`bold`,content:i[1]}),r=i.index+i[0].length;return r<e.length&&t.push({type:`plain`,content:e.slice(r)}),t}function m(m){let h=m.split(`
`),g={type:`root`,children:[]},_=[{node:g}];for(let m=0;m<h.length;m++){let g=h[m].trim();if(g===``)continue;let v=_[_.length-1];if(n.test(g)){_.length>1&&_.pop();continue}if(i.test(g)){_.length>1&&_.pop();continue}if(o.test(g)){_.length>1&&_.pop();continue}let y=r.exec(g);if(y){let e={type:`conditional`,key:y[1],operator:y[2],value:y[3],children:[]};v.node.children.push(e),_.push({node:e});continue}let b=a.exec(g);if(b){let e={type:`each`,collection:b[1],itemName:b[2],children:[]};v.node.children.push(e),_.push({node:e});continue}let x=t.exec(g);if(x&&e.has(x[1])){let e=x[1],t=f(x[2]??``);if(e===`menu`){let e={type:`menu`,props:t,items:[]};v.node.children.push(e),_.push({node:e})}else{let n={type:e,props:t,children:[]};v.node.children.push(n),_.push({node:n})}continue}if(v.node.type===`menu`){let e=v.node,t=g.replace(/^-\s*/,``),n={type:`list-item`,content:t,segments:p(t)};e.items.push(n);continue}if(c.test(g)){v.node.children.push({type:`rule`});continue}let S=s.exec(g);if(S){let e={type:`heading`,level:S[1].length,content:S[2]};v.node.children.push(e);continue}let C=d.exec(g);if(C){let e={type:`font-directive`,font:C[1]};v.node.children.push(e);continue}let w=l.exec(g);if(w){let e={type:`quote`,children:p(w[1])};v.node.children.push(e);continue}let T=u.exec(g);if(T){let e=v.node.children[v.node.children.length-1];if(e&&e.type===`list`){let t=e,n=T[1];t.items.push({type:`list-item`,content:n,segments:p(n)})}else{let e=T[1],t={type:`list`,items:[{type:`list-item`,content:e,segments:p(e)}]};v.node.children.push(t)}continue}let E={type:`text`,content:g,segments:p(g)};v.node.children.push(E)}return g}var h={FULL_WIDTH:0,FITTING:1,SMUSHING:2,CONTROLLED_SMUSHING:3},g=class{constructor(){this.comment=``,this.numChars=0,this.options={}}},_=`1Row.3-D.3D Diagonal.3D-ASCII.3x5.4Max.5 Line Oblique.AMC 3 Line.AMC 3 Liv1.AMC AAA01.AMC Neko.AMC Razor.AMC Razor2.AMC Slash.AMC Slider.AMC Thin.AMC Tubes.AMC Untitled.ANSI Compact.ANSI Regular.ANSI Shadow.ASCII 12.ASCII 9.ASCII New Roman.Acrobatic.Alligator.Alligator2.Alpha.Alphabet.Arrows.Avatar.B1FF.Babyface Lame.Babyface Leet.Banner.Banner3-D.Banner3.Banner4.Barbwire.Basic.Bear.Bell.Benjamin.Big ASCII 12.Big ASCII 9.Big Chief.Big Money-ne.Big Money-nw.Big Money-se.Big Money-sw.Big Mono 12.Big Mono 9.Big.Bigfig.Binary.Block.Blocks.Bloody.BlurVision ASCII.Bolger.Braced.Bright.Broadway KB.Broadway.Bubble.Bulbhead.Caligraphy.Caligraphy2.Calvin S.Cards.Catwalk.Chiseled.Chunky.Circle.Classy.Coder Mini.Coinstak.Cola.Colossal.Computer.Contessa.Contrast.Cosmike.Cosmike2.Crawford.Crawford2.Crazy.Cricket.Cursive.Cyberlarge.Cybermedium.Cybersmall.Cygnet.DANC4.DOS Rebel.DWhistled.Dancing Font.Decimal.Def Leppard.Delta Corps Priest 1.DiamFont.Diamond.Diet Cola.Digital.Doh.Doom.Dot Matrix.Double Shorts.Double.Dr Pepper.Efti Chess.Efti Font.Efti Italic.Efti Piti.Efti Robot.Efti Wall.Efti Water.Electronic.Elite.Emboss 2.Emboss.Epic.Fender.Filter.Fire Font-k.Fire Font-s.Flipped.Flower Power.Font Font.Four Tops.Fraktur.Fun Face.Fun Faces.Future Smooth.Future Thin.Future.Fuzzy.Georgi16.Georgia11.Ghost.Ghoulish.Glenyn.Goofy.Gothic.Graceful.Gradient.Graffiti.Greek.Heart Left.Heart Right.Henry 3D.Hex.Hieroglyphs.Hollywood.Horizontal Left.Horizontal Right.ICL-1900.Impossible.Invita.Isometric1.Isometric2.Isometric3.Isometric4.Italic.Ivrit.JS Block Letters.JS Bracket Letters.JS Capital Curves.JS Cursive.JS Stick Letters.Jacky.Jazmine.Jerusalem.Katakana.Kban.Keyboard.Knob.Konto Slant.Konto.LCD.Larry 3D 2.Larry 3D.Lean.Letter.Letters.Lil Devil.Line Blocks.Linux.Lockergnome.Madrid.Marquee.Maxfour.Merlin1.Merlin2.Mike.Mini.Mirror.Mnemonic.Modular.Mono 12.Mono 9.Morse.Morse2.Moscow.Mshebrew210.Muzzle.NScript.NT Greek.NV Script.Nancyj-Fancy.Nancyj-Improved.Nancyj-Underlined.Nancyj.Nipples.O8.OS2.Octal.Ogre.Old Banner.Pagga.Patorjk's Cheese.Patorjk-HeX.Pawp.Peaks Slant.Peaks.Pebbles.Pepper.Poison.Puffy.Puzzle.Pyramid.Rammstein.Rebel.Rectangles.Red Phoenix.Relief.Relief2.Reverse.Roman.Rot13.Rotated.Rounded.Rowan Cap.Rozzo.RubiFont.Runic.Runyc.S Blood.SL Script.Santa Clara.Script.Serifcap.Shaded Blocky.Shadow.Shimrod.Short.Slant Relief.Slant.Slide.Small ASCII 12.Small ASCII 9.Small Block.Small Braille.Small Caps.Small Isometric1.Small Keyboard.Small Mono 12.Small Mono 9.Small Poison.Small Script.Small Shadow.Small Slant.Small Tengwar.Small.Soft.Speed.Spliff.Stacey.Stampate.Stampatello.Standard.Star Strips.Star Wars.Stellar.Stforek.Stick Letters.Stop.Straight.Stronger Than All.Sub-Zero.Swamp Land.Swan.Sweet.THIS.Tanja.Tengwar.Term.Terrace.Test1.The Edge.Thick.Thin.Thorned.Three Point.Ticks Slant.Ticks.Tiles.Tinker-Toy.Tmplr.Tombstone.Train.Trek.Tsalagi.Tubular.Twisted.Two Point.USA Flag.Univers.Upside Down Text.Varsity.Wavescape.Wavy.Weird.Wet Letter.Whimsy.WideTerm.Wow.miniwi`.split(`.`),v={"ANSI-Compact":`ANSI Compact`},y=e=>v[e]?v[e]:e;function b(e){return/[.*+?^${}()|[\]\\]/.test(e)?`\\`+e:e}var x=(()=>{let{FULL_WIDTH:e=0,FITTING:t,SMUSHING:n,CONTROLLED_SMUSHING:r}=h,i={},a={font:`Standard`,fontPath:`./fonts`,fetchFontIfMissing:!0};function o(e,t,n){let r=b(e.trim().slice(-1))||`@`,i=t===n-1?RegExp(r+r+`?\\s*$`):RegExp(r+`\\s*$`);return e.replace(i,``)}function s(i=-1,a=null){let o={},s,c=[[16384,`vLayout`,n],[8192,`vLayout`,t],[4096,`vRule5`,!0],[2048,`vRule4`,!0],[1024,`vRule3`,!0],[512,`vRule2`,!0],[256,`vRule1`,!0],[128,`hLayout`,n],[64,`hLayout`,t],[32,`hRule6`,!0],[16,`hRule5`,!0],[8,`hRule4`,!0],[4,`hRule3`,!0],[2,`hRule2`,!0],[1,`hRule1`,!0]];s=a===null?i:a;for(let[e,t,n]of c)s>=e?(s-=e,o[t]===void 0&&(o[t]=n)):t!==`vLayout`&&t!==`hLayout`&&(o[t]=!1);return o.hLayout===void 0?i===0?o.hLayout=t:i===-1?o.hLayout=e:o.hRule1||o.hRule2||o.hRule3||o.hRule4||o.hRule5||o.hRule6?o.hLayout=r:o.hLayout=n:o.hLayout===n&&(o.hRule1||o.hRule2||o.hRule3||o.hRule4||o.hRule5||o.hRule6)&&(o.hLayout=r),o.vLayout===void 0?o.vRule1||o.vRule2||o.vRule3||o.vRule4||o.vRule5?o.vLayout=r:o.vLayout=e:o.vLayout===n&&(o.vRule1||o.vRule2||o.vRule3||o.vRule4||o.vRule5)&&(o.vLayout=r),o}function c(e,t,n=``){return e===t&&e!==n?e:!1}function l(e,t){let n=`|/\\[]{}()<>`;if(e===`_`){if(n.indexOf(t)!==-1)return t}else if(t===`_`&&n.indexOf(e)!==-1)return e;return!1}function u(e,t){let n=`| /\\ [] {} () <>`,r=n.indexOf(e),i=n.indexOf(t);if(r!==-1&&i!==-1&&r!==i&&Math.abs(r-i)!==1){let e=Math.max(r,i),t=e+1;return n.substring(e,t)}return!1}function d(e,t){let n=`[] {} ()`,r=n.indexOf(e),i=n.indexOf(t);return r!==-1&&i!==-1&&Math.abs(r-i)<=1?`|`:!1}function f(e,t){return{"/\\":`|`,"\\/":`Y`,"><":`X`}[e+t]||!1}function p(e,t,n=``){return e===n&&t===n?n:!1}function m(e,t){return e===t?e:!1}function v(e,t){return l(e,t)}function x(e,t){return u(e,t)}function S(e,t){return e===`-`&&t===`_`||e===`_`&&t===`-`?`=`:!1}function C(e,t){return e===`|`&&t===`|`?`|`:!1}function w(e,t,n){return t===` `||t===``||t===n&&e!==` `?e:t}function T(r,i,a){if(a.fittingRules&&a.fittingRules.vLayout===e)return`invalid`;let o,s=Math.min(r.length,i.length),c,l,u=!1,d;if(s===0)return`invalid`;for(o=0;o<s;o++)if(c=r.substring(o,o+1),l=i.substring(o,o+1),c!==` `&&l!==` `){if(a.fittingRules&&a.fittingRules.vLayout===t)return`invalid`;if(a.fittingRules&&a.fittingRules.vLayout===n)return`end`;if(C(c,l)){u||=!1;continue}if(d=!1,d=a.fittingRules&&a.fittingRules.vRule1?m(c,l):d,d=!d&&a.fittingRules&&a.fittingRules.vRule2?v(c,l):d,d=!d&&a.fittingRules&&a.fittingRules.vRule3?x(c,l):d,d=!d&&a.fittingRules&&a.fittingRules.vRule4?S(c,l):d,u=!0,!d)return`invalid`}return u?`end`:`valid`}function E(e,t,n){let r=e.length,i=e.length,a,o,s,c=1,l,u,d;for(;c<=r;){for(a=e.slice(Math.max(0,i-c),i),o=t.slice(0,Math.min(r,c)),s=o.length,d=``,l=0;l<s;l++)if(u=T(a[l],o[l],n),u===`end`)d=u;else if(u===`invalid`){d=u;break}else d===``&&(d=`valid`);if(d===`invalid`){c--;break}if(d===`end`)break;d===`valid`&&c++}return Math.min(r,c)}function D(e,r,i){let a,o=Math.min(e.length,r.length),s,c,l=``,u,d=i.fittingRules||{};for(a=0;a<o;a++)s=e.substring(a,a+1),c=r.substring(a,a+1),s!==` `&&c!==` `?d.vLayout===t||d.vLayout===n?l+=w(s,c):(u=!1,u=d.vRule5?C(s,c):u,u=!u&&d.vRule1?m(s,c):u,u=!u&&d.vRule2?v(s,c):u,u=!u&&d.vRule3?x(s,c):u,u=!u&&d.vRule4?S(s,c):u,l+=u):l+=w(s,c);return l}function O(e,t,n,r){let i=e.length,a=t.length,o=e.slice(0,Math.max(0,i-n)),s=e.slice(Math.max(0,i-n),i),c=t.slice(0,Math.min(n,a)),l,u,d,f=[],p;for(u=s.length,l=0;l<u;l++)d=l>=a?s[l]:D(s[l],c[l],r),f.push(d);return p=t.slice(Math.min(n,a),a),[...o,...f,...p]}function k(e,t){let n=` `.repeat(t);return e.map(e=>e+n)}function A(e,t,n){let r=e[0].length,i=t[0].length,a;return r>i?t=k(t,r-i):i>r&&(e=k(e,i-r)),a=E(e,t,n),O(e,t,a,n)}function ee(r,i,a){let o=a.fittingRules||{};if(o.hLayout===e)return 0;let s,m=r.length,h=i.length,g=m,_=1,v=!1,y,b,x,S;if(m===0)return 0;distCal:for(;_<=g;){let e=m-_;for(y=r.substring(e,e+_),b=i.substring(0,Math.min(_,h)),s=0;s<Math.min(_,h);s++)if(x=y.substring(s,s+1),S=b.substring(s,s+1),x!==` `&&S!==` `){if(o.hLayout===t){--_;break distCal}else if(o.hLayout===n){(x===a.hardBlank||S===a.hardBlank)&&--_;break distCal}else if(v=!0,!(o.hRule1&&c(x,S,a.hardBlank)||o.hRule2&&l(x,S)||o.hRule3&&u(x,S)||o.hRule4&&d(x,S)||o.hRule5&&f(x,S)||o.hRule6&&p(x,S,a.hardBlank))){--_;break distCal}}if(v)break;_++}return Math.min(g,_)}function j(e,r,i,a){let o,s,m=[],h,g,_,v,y,b,x,S,C=a.fittingRules||{};if(typeof a.height!=`number`)throw Error(`height is not defined.`);for(o=0;o<a.height;o++){x=e[o],S=r[o],y=x.length,b=S.length,h=y-i,g=x.slice(0,Math.max(0,h)),_=``;let T=Math.max(0,y-i),E=x.substring(T,T+i),D=S.substring(0,Math.min(i,b));for(s=0;s<i;s++){let e=s<y?E.substring(s,s+1):` `,r=s<b?D.substring(s,s+1):` `;if(e!==` `&&r!==` `)if(C.hLayout===t||C.hLayout===n)_+=w(e,r,a.hardBlank);else{let t=C.hRule1&&c(e,r,a.hardBlank)||C.hRule2&&l(e,r)||C.hRule3&&u(e,r)||C.hRule4&&d(e,r)||C.hRule5&&f(e,r)||C.hRule6&&p(e,r,a.hardBlank)||w(e,r,a.hardBlank);_+=t}else _+=w(e,r,a.hardBlank)}v=i>=b?``:S.substring(i,i+Math.max(0,b-i)),m[o]=g+_+v}return m}function M(e){return Array(e).fill(``)}let N=function(e){return Math.max(...e.map(e=>e.length))};function P(e,t,n){return e.reduce(function(e,t){return j(e,t.fig,t.overlap||0,n)},M(t))}function te(e,t,n){for(let r=e.length-1;r>0;r--){let i=P(e.slice(0,r),t,n);if(N(i)<=n.width)return{outputFigText:i,chars:e.slice(r)}}return{outputFigText:M(t),chars:e}}function ne(t,n,r){let i,a,o=0,s,c,l,u=r.height,d=[],f,p={chars:[],overlap:o},m=[],h,g,_,v,y;if(typeof u!=`number`)throw Error(`height is not defined.`);c=M(u);let b=r.fittingRules||{};for(r.printDirection===1&&(t=t.split(``).reverse().join(``)),l=t.length,i=0;i<l;i++)if(h=t.substring(i,i+1),g=h.match(/\s/),a=n[h.charCodeAt(0)],v=null,a){if(b.hLayout!==e){for(o=1e4,s=0;s<u;s++)o=Math.min(o,ee(c[s],a[s],r));o=o===1e4?0:o}if(r.width>0&&(r.whitespaceBreak?(_=P(p.chars.concat([{fig:a,overlap:o}]),u,r),v=P(m.concat([{fig:_,overlap:p.overlap}]),u,r),f=N(v)):(v=j(c,a,o,r),f=N(v)),f>=r.width&&i>0&&(r.whitespaceBreak?(c=P(m.slice(0,-1),u,r),m.length>1&&(d.push(c),c=M(u)),m=[]):(d.push(c),c=M(u)))),r.width>0&&r.whitespaceBreak&&((!g||i===l-1)&&p.chars.push({fig:a,overlap:o}),g||i===l-1)){for(y=null;v=P(p.chars,u,r),f=N(v),f>=r.width;)y=te(p.chars,u,r),p={chars:y.chars},d.push(y.outputFigText);f>0&&(y?m.push({fig:v,overlap:1}):m.push({fig:v,overlap:p.overlap})),g&&(m.push({fig:a,overlap:o}),c=M(u)),i===l-1&&(c=P(m,u,r)),p={chars:[],overlap:o};continue}c=j(c,a,o,r)}return N(c)>0&&d.push(c),r.showHardBlanks||d.forEach(function(e){for(l=e.length,s=0;s<l;s++)e[s]=e[s].replace(RegExp(`\\`+r.hardBlank,`g`),` `)}),t===``&&d.length===0&&d.push(Array(u).fill(``)),d}let re=function(i,a){let o,s=a.fittingRules||{};if(i===`default`)o={hLayout:s.hLayout,hRule1:s.hRule1,hRule2:s.hRule2,hRule3:s.hRule3,hRule4:s.hRule4,hRule5:s.hRule5,hRule6:s.hRule6};else if(i===`full`)o={hLayout:e,hRule1:!1,hRule2:!1,hRule3:!1,hRule4:!1,hRule5:!1,hRule6:!1};else if(i===`fitted`)o={hLayout:t,hRule1:!1,hRule2:!1,hRule3:!1,hRule4:!1,hRule5:!1,hRule6:!1};else if(i===`controlled smushing`)o={hLayout:r,hRule1:!0,hRule2:!0,hRule3:!0,hRule4:!0,hRule5:!0,hRule6:!0};else if(i===`universal smushing`)o={hLayout:n,hRule1:!1,hRule2:!1,hRule3:!1,hRule4:!1,hRule5:!1,hRule6:!1};else return;return o},ie=function(i,a){let o={},s=a.fittingRules||{};if(i===`default`)o={vLayout:s.vLayout,vRule1:s.vRule1,vRule2:s.vRule2,vRule3:s.vRule3,vRule4:s.vRule4,vRule5:s.vRule5};else if(i===`full`)o={vLayout:e,vRule1:!1,vRule2:!1,vRule3:!1,vRule4:!1,vRule5:!1};else if(i===`fitted`)o={vLayout:t,vRule1:!1,vRule2:!1,vRule3:!1,vRule4:!1,vRule5:!1};else if(i===`controlled smushing`)o={vLayout:r,vRule1:!0,vRule2:!0,vRule3:!0,vRule4:!0,vRule5:!0};else if(i===`universal smushing`)o={vLayout:n,vRule1:!1,vRule2:!1,vRule3:!1,vRule4:!1,vRule5:!1};else return;return o},F=function(e,t,n){n=n.replace(/\r\n/g,`
`).replace(/\r/g,`
`);let r=y(e),a=n.split(`
`),o=[],s,c,l;for(c=a.length,s=0;s<c;s++)o=o.concat(ne(a[s],i[r],t));for(c=o.length,l=o[0],s=1;s<c;s++)l=A(l,o[s],t);return l?l.join(`
`):``};function I(e,t){let n;if(n=typeof structuredClone<`u`?structuredClone(e):JSON.parse(JSON.stringify(e)),n.showHardBlanks=t.showHardBlanks||!1,n.width=t.width||-1,n.whitespaceBreak=t.whitespaceBreak||!1,t.horizontalLayout){let r=re(t.horizontalLayout,e);r&&Object.assign(n.fittingRules,r)}if(t.verticalLayout){let r=ie(t.verticalLayout,e);r&&Object.assign(n.fittingRules,r)}return n.printDirection=t.printDirection!==null&&t.printDirection!==void 0?t.printDirection:e.printDirection,n}let L=async function(e,t,n){return L.text(e,t,n)};return L.text=async function(e,t,n){e+=``;let r,i;typeof t==`function`?(i=t,r={font:a.font}):typeof t==`string`?(r={font:t},i=n):t?(r=t,i=n):(r={font:a.font},i=n);let o=r.font||a.font;try{let t=await L.loadFont(o),n=t?F(o,I(t,r),e):``;return i&&i(null,n),n}catch(e){let t=e instanceof Error?e:Error(String(e));if(i)return i(t),``;throw t}},L.textSync=function(e,t){e+=``,typeof t==`string`?t={font:t}:t||={};let n=t.font||a.font;return F(n,I(L.loadFontSync(n),t),e)},L.metadata=async function(e,t){e+=``;try{let n=await L.loadFont(e);if(!n)throw Error(`Error loading font.`);let r=i[y(e)]||{},a=[n,r.comment||``];return t&&t(null,n,r.comment),a}catch(e){let n=e instanceof Error?e:Error(String(e));if(t)return t(n),null;throw n}},L.defaults=function(e){return e&&typeof e==`object`&&Object.assign(a,e),typeof structuredClone<`u`?structuredClone(a):JSON.parse(JSON.stringify(a))},L.parseFont=function(e,t,n=!0){if(i[e]&&!n)return i[e].options;t=t.replace(/\r\n/g,`
`).replace(/\r/g,`
`);let r=new g,a=t.split(`
`),c=a.shift();if(!c)throw Error(`Invalid font file: missing header`);let l=c.split(` `),u={hardBlank:l[0].substring(5,6),height:parseInt(l[1],10),baseline:parseInt(l[2],10),maxLength:parseInt(l[3],10),oldLayout:parseInt(l[4],10),numCommentLines:parseInt(l[5],10),printDirection:l[6]?parseInt(l[6],10):0,fullLayout:l[7]?parseInt(l[7],10):null,codeTagCount:l[8]?parseInt(l[8],10):null};if((u.hardBlank||``).length!==1||[u.height,u.baseline,u.maxLength,u.oldLayout,u.numCommentLines].some(e=>e==null||isNaN(e))||u.height==null||u.numCommentLines==null)throw Error(`FIGlet header contains invalid values.`);u.fittingRules=s(u.oldLayout,u.fullLayout),r.options=u;let d=[];for(let e=32;e<=126;e++)d.push(e);if(d.push(196,214,220,228,246,252,223),a.length<u.numCommentLines+u.height*d.length)throw Error(`FIGlet file is missing data. Line length: ${a.length}. Comment lines: ${u.numCommentLines}. Height: ${u.height}. Num chars: ${d.length}.`);for(r.comment=a.splice(0,u.numCommentLines).join(`
`),r.numChars=0;a.length>0&&r.numChars<d.length;){let e=d[r.numChars];r[e]=a.splice(0,u.height);for(let t=0;t<u.height;t++)r[e][t]===void 0?r[e][t]=``:r[e][t]=o(r[e][t],t,u.height);r.numChars++}for(;a.length>0;){let e=a.shift();if(!e||e.trim()===``)break;let t=e.split(` `)[0],n;if(/^-?0[xX][0-9a-fA-F]+$/.test(t))n=parseInt(t,16);else if(/^-?0[0-7]+$/.test(t))n=parseInt(t,8);else if(/^-?[0-9]+$/.test(t))n=parseInt(t,10);else throw Error(`Error parsing data. Invalid data: ${t}`);if(n===-1||n<-2147483648||n>2147483647)throw Error(`Error parsing data. ${n===-1?`The char code -1 is not permitted.`:`The char code cannot be ${n<-2147483648?`less than -2147483648`:`greater than 2147483647`}.`}`);r[n]=a.splice(0,u.height);for(let e=0;e<u.height;e++)r[n][e]===void 0?r[n][e]=``:r[n][e]=o(r[n][e],e,u.height);r.numChars++}return i[e]=r,u},L.loadedFonts=()=>Object.keys(i),L.clearLoadedFonts=()=>{Object.keys(i).forEach(e=>{delete i[e]})},L.loadFont=async function(e,t){let n=y(e);if(i[n]){let e=i[n].options;return t&&t(null,e),Promise.resolve(e)}try{if(!a.fetchFontIfMissing)throw Error(`Font is not loaded: ${n}`);let e=await fetch(`${a.fontPath}/${n}.flf`);if(!e.ok)throw Error(`Network response was not ok: ${e.status}`);let r=await e.text(),i=L.parseFont(n,r);return t&&t(null,i),i}catch(e){let n=e instanceof Error?e:Error(String(e));if(t)return t(n),null;throw n}},L.loadFontSync=function(e){let t=y(e);if(i[t])return i[t].options;throw Error(`Synchronous font loading is not implemented for the browser, it will only work for fonts already loaded.`)},L.preloadFonts=async function(e,t){try{for(let t of e){let e=y(t),n=await fetch(`${a.fontPath}/${e}.flf`);if(!n.ok)throw Error(`Failed to preload fonts. Error fetching font: ${e}, status code: ${n.statusText}`);let r=await n.text();L.parseFont(e,r)}t&&t()}catch(e){let n=e instanceof Error?e:Error(String(e));if(t){t(n);return}throw e}},L.fonts=function(e){return new Promise(function(t,n){t(_),e&&e(null,_)})},L.fontsSync=function(){return _},L.figFonts=i,L})(),S=new Map,C=`Standard`;function w(e,t){x.parseFont(e,t),S.set(e,!0)}function T(e){C=e}function E(e,t){let n=t??C;if(!S.has(n))return{lines:[e],width:e.length,height:1};let r=x.textSync(e,{font:n}).split(`
`);for(;r.length>0&&r[r.length-1].trim()===``;)r.pop();let i=Math.max(...r.map(e=>e.length));return{lines:r.map(e=>e.padEnd(i)),width:i,height:r.length}}function D(e,t){if(t<=0||e.length===0)return 1;let n=e.split(` `),r=1,i=0;for(let e of n)i===0?i=e.length:i+1+e.length>t?(r++,i=e.length):i+=1+e.length;return r}function O(e,t,n,r,i,a,o){switch(e.type){case`root`:return{node:e,col:0,row:0,width:t,height:n,children:k(e.children,t,n)};case`box`:{let r=e,i=r.props.margin??0,a=r.props.width??t-i*2,s=r.props.border!=null&&r.props.border!==`none`,c=r.props.padding??0,l=a;s&&(l-=2),l-=c*2;let u=r.props.font??o,d=r.children.map(e=>O(e,l,n-i*2,void 0,void 0,void 0,u)),f=d.reduce((e,t)=>e+t.height,0);return s&&(f+=2),f+=c*2,r.props.height!=null&&(f=r.props.height),{node:e,col:0,row:0,width:a+i*2,height:f+i*2,children:d}}case`row`:{let r=e,i=r.props.gap??0,a=r.children.length,o=a>0?Math.floor((t-i*(a-1))/a):0,s=r.children.map(e=>O(e,o,n));return{node:e,col:0,row:0,width:t,height:s.reduce((e,t)=>Math.max(e,t.height),0),children:s}}case`col`:{let r=e,i=r.props.gap??0,a=r.children.map(e=>O(e,t,n));return{node:e,col:0,row:0,width:t,height:a.reduce((e,t)=>e+t.height,0)+i*Math.max(0,a.length-1),children:a}}case`sidebar`:{let t=e,r=t.children.map(e=>O(e,t.props.width,n));return{node:e,col:0,row:0,width:t.props.width,height:n,children:r}}case`scroll`:{let n=e,r=n.children.map(e=>O(e,t,9999,void 0,void 0,void 0,o));return{node:e,col:0,row:0,width:t,height:n.props.height,children:r}}case`text`:return{node:e,col:0,row:0,width:t,height:D(e.content,t),children:[]};case`heading`:{let n=e;if(n.level===1){let r=n.font??o,i=E(n.content,r);return{node:e,col:0,row:0,width:Math.min(i.width,t),height:i.height,children:[]}}return{node:e,col:0,row:0,width:t,height:1,children:[]}}case`rule`:return{node:e,col:0,row:0,width:t,height:1,children:[]};case`button`:return{node:e,col:0,row:0,width:e.label.length,height:1,children:[]};case`quote`:return{node:e,col:0,row:0,width:t,height:1,children:[]};case`list`:{let r=e,i=r.items.map(e=>O(e,t,n));return{node:e,col:0,row:0,width:t,height:r.items.length,children:i}}case`list-item`:return{node:e,col:0,row:0,width:t,height:1,children:[]};case`menu`:{let r=e,i=r.items.map(e=>O(e,t,n));return{node:e,col:0,row:0,width:t,height:r.items.length,children:i}}case`conditional`:case`each`:{let r=e.children.map(e=>O(e,t,n));return{node:e,col:0,row:0,width:t,height:r.reduce((e,t)=>e+t.height,0),children:r}}case`font-directive`:return{node:e,col:0,row:0,width:0,height:0,children:[]};default:return{node:e,col:0,row:0,width:t,height:1,children:[]}}}function k(e,t,n){let r=[],i=0;for(let t of e)t.type===`sidebar`&&(i+=t.props.width);let a=t-i;for(let i of e)i.type===`sidebar`?r.push(O(i,t,n)):r.push(O(i,a,n));return r}function A(e,t,n,r,i){let a=e.node;switch(a.type){case`root`:e.col=t,e.row=n,ee(e,t,n,r,e.height);break;case`box`:{let o=a,s=o.props.margin??0;o.props.align===`center`?t+=Math.floor((r-e.width)/2):o.props.align===`right`&&(t+=r-e.width),o.props.valign===`center`&&i?n+=Math.max(0,Math.floor((i-e.height)/2)):o.props.valign===`bottom`&&i&&(n+=Math.max(0,i-e.height)),t+=s,n+=s,e.col=t-s,e.row=n-s;let c=o.props.border!=null&&o.props.border!==`none`,l=o.props.padding??0,u=t,d=n;c&&(u+=1,d+=1),u+=l,d+=l;let f=e.children.length>0?e.children[0].width:0,p=d;for(let t of e.children)A(t,u,p,f),p+=t.height;break}case`row`:{let r=a;e.col=t,e.row=n;let i=r.props.gap??0,o=t;for(let t of e.children)A(t,o,n,t.width),o+=t.width+i;break}case`col`:{let i=a;e.col=t,e.row=n;let o=i.props.gap??0,s=n;for(let n of e.children)A(n,t,s,r),s+=n.height+o;break}default:{e.col=t,e.row=n;let i=n;for(let n of e.children)A(n,t,i,r,e.height),i+=n.height;break}}}function ee(e,t,n,r,i){let a=0,o=0,s=[],c=[];for(let t of e.children)if(t.node.type===`sidebar`){let e=t.node;e.props.align===`right`?o+=e.props.width:a+=e.props.width,s.push(t)}else c.push(t);let l=t,u=t+r;for(let e of s){let t=e.node;t.props.align===`right`?(u-=t.props.width,A(e,u,n,t.props.width,i)):(A(e,l,n,t.props.width,i),l+=t.props.width)}let d=t+a,f=r-a-o,p=n;for(let e of c)A(e,d,p,f,i),p+=e.height}function j(e,t,n){let r=O(e,t,n);return A(r,0,0,t,n),r}function M(e,t){if(t<=0)return[e];if(e.length===0)return[``];let n=e.split(` `),r=[],i=``;for(let e of n)i.length===0?i=e:i.length+1+e.length>t?(r.push(i),i=e):i+=` `+e;return r.push(i),r}var N=new Map,P=[];function te(){return P}function ne(e,t){N.set(e,t)}function re(e){return N.get(e)??0}function ie(e){return`scroll-${e.col}-${e.row}`}var F=0;function I(){F=0}function L(){return`btn-${F++}`}function ae(e,t,n,r){let i=[],a=t,o=n;for(let n of e){let e,s,c;switch(n.type){case`plain`:e=n.content,s=`400 normal`;break;case`bold`:e=n.content,s=`800 bold`;break;case`dim`:e=n.content,s=`400 dim`;break;case`code`:e=n.content,s=`400 code`;break;case`expression`:e=n.key,s=`400 normal`;break;case`button`:e=`[ ${n.label} ]`,s=`800 bold`,c={id:L(),action:n.action,hovered:!1};break;default:continue}for(let n of e){r>0&&a-t>=r&&(a=t,o++);let e={col:a,row:o,char:n,font:s};c&&(e.interactive=c),i.push(e),a++}}return i}function R(e){let{node:t,col:n,row:r,width:i,height:a,children:o}=e,s=[];switch(t.type){case`text`:{let e=t;if(e.segments&&e.segments.length>0)s.push(...ae(e.segments,n,r,i));else{let t=M(e.content,i);for(let e=0;e<t.length;e++){let i=t[e];for(let t=0;t<i.length;t++)s.push({col:n+t,row:r+e,char:i[t],font:`400 normal`})}}break}case`heading`:{let e=t;if(e.level===1){let t=E(e.content,e.font),a=Math.max(0,Math.floor((i-t.width)/2));for(let e=0;e<t.lines.length;e++){let o=t.lines[e];for(let t=0;t<o.length;t++){let c=n+a+t;if(c<n||c>=n+i)continue;let l=o[t];l!==` `&&s.push({col:c,row:r+e,char:l,font:`800 heading`})}}}else if(e.level===2){let t=e.content.toUpperCase();for(let e=0;e<t.length&&e<i;e++)s.push({col:n+e,row:r,char:t[e],font:`800 heading`})}else for(let t=0;t<e.content.length&&t<i;t++)s.push({col:n+t,row:r,char:e.content[t],font:`600 heading`});break}case`rule`:for(let e=0;e<i;e++)s.push({col:n+e,row:r,char:`─`,font:`400 normal`});break;case`button`:{let e=t,i=L();for(let t=0;t<e.label.length;t++)s.push({col:n+t,row:r,char:e.label[t],font:`400 normal`,interactive:{id:i,action:e.action,hovered:!1}});break}case`quote`:{let e=t;s.push({col:n,row:r,char:`│`,font:`400 normal`});let i=e.children.map(e=>`content`in e?e.content:``).join(``);for(let e=0;e<i.length;e++)s.push({col:n+2+e,row:r,char:i[e],font:`400 normal`});break}case`list`:for(let e of o)s.push(...R(e));break;case`list-item`:{let e=t;if(s.push({col:n,row:r,char:`•`,font:`400 normal`}),e.segments&&e.segments.length>0)s.push(...ae(e.segments,n+2,r,i-2));else for(let t=0;t<e.content.length;t++)s.push({col:n+2+t,row:r,char:e.content[t],font:`400 normal`});break}case`menu`:{let e=t.props.bind??``;for(let t=0;t<o.length;t++){let n=o[t],r=n.node,i=`menu-${t}`,a=r.content,c={id:i,action:e?`menu-select:${e}:${a}`:`menu-select`,hovered:!1};if(s.push({col:n.col,row:n.row,char:`•`,font:`400 normal`,interactive:c}),r.segments&&r.segments.length>0){let e=ae(r.segments,n.col+2,n.row,n.width-2);for(let t of e)t.interactive=c,s.push(t)}else for(let e=0;e<r.content.length;e++)s.push({col:n.col+2+e,row:n.row,char:r.content[e],font:`400 normal`,interactive:c})}break}case`box`:{let e=t,c=e.props.margin??0,l=n+c,u=r+c,d=i-c*2,f=a-c*2,p=e.props.background;if(p){let e=p.match(/^dim\(([0-9.]+)\)$/);if(e){let t={type:`dim`,amount:parseFloat(e[1])};for(let e=0;e<f;e++)for(let n=0;n<d;n++)s.push({col:l+n,row:u+e,char:` `,font:`400 bg-fill`,bgModifier:t})}}if(e.props.border!=null&&e.props.border!==`none`){s.push({col:n,row:r,char:`+`,font:`400 normal`});for(let e=1;e<i-1;e++)s.push({col:n+e,row:r,char:`-`,font:`400 normal`});s.push({col:n+i-1,row:r,char:`+`,font:`400 normal`});for(let e=1;e<a-1;e++)s.push({col:n,row:r+e,char:`|`,font:`400 normal`}),s.push({col:n+i-1,row:r+e,char:`|`,font:`400 normal`});s.push({col:n,row:r+a-1,char:`+`,font:`400 normal`});for(let e=1;e<i-1;e++)s.push({col:n+e,row:r+a-1,char:`-`,font:`400 normal`});s.push({col:n+i-1,row:r+a-1,char:`+`,font:`400 normal`})}for(let e of o)s.push(...R(e));break}case`scroll`:{let t=ie(e),n=N.get(t)??0,i=[];for(let e of o)i.push(...R(e));let c=r,l=r+a;for(let e of i){let t=e.row-n;t>=c&&t<l&&s.push({...e,row:t})}P.push({id:t,top:c,bottom:l,contentHeight:o.reduce((e,t)=>e+t.height,0)});break}case`conditional`:case`each`:case`root`:case`row`:case`col`:case`sidebar`:for(let e of o)s.push(...R(e));break;case`font-directive`:break;default:for(let e of o)s.push(...R(e));break}return s}function oe(e){return I(),P=[],R(e)}function se(e,t,n){e/=255,t/=255,n/=255;let r=Math.max(e,t,n),i=Math.min(e,t,n),a=(r+i)/2;if(r===i)return[0,0,a];let o=r-i,s=a>.5?o/(2-r-i):o/(r+i),c=0;return c=r===e?((t-n)/o+(t<n?6:0))/6:r===t?((n-e)/o+2)/6:((e-t)/o+4)/6,[c,s,a]}var ce=`BN.BN.BN.BN.BN.BN.BN.BN.BN.S.B.S.WS.B.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.B.B.B.S.WS.ON.ON.ET.ET.ET.ON.ON.ON.ON.ON.ON.CS.ON.CS.ON.EN.EN.EN.EN.EN.EN.EN.EN.EN.EN.ON.ON.ON.ON.ON.ON.ON.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.ON.ON.ON.ON.ON.ON.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.ON.ON.ON.ON.BN.BN.BN.BN.BN.BN.B.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.BN.CS.ON.ET.ET.ET.ET.ON.ON.ON.ON.L.ON.ON.ON.ON.ON.ET.ET.EN.EN.ON.L.ON.ON.ON.EN.L.ON.ON.ON.ON.ON.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.ON.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.L.ON.L.L.L.L.L.L.L.L`.split(`.`),le=`AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.CS.AL.ON.ON.NSM.NSM.NSM.NSM.NSM.NSM.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.AL.AL.AL.AL.AL.AL.AL.AN.AN.AN.AN.AN.AN.AN.AN.AN.AN.ET.AN.AN.AL.AL.AL.NSM.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.NSM.ON.NSM.NSM.NSM.NSM.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL.AL`.split(`.`);function ue(e){return e<=255?ce[e]:1424<=e&&e<=1524?`R`:1536<=e&&e<=1791?le[e&255]:1792<=e&&e<=2220?`AL`:`L`}function de(e){let t=e.length;if(t===0)return null;let n=Array(t),r=0;for(let i=0;i<t;i++){let t=ue(e.charCodeAt(i));(t===`R`||t===`AL`||t===`AN`)&&r++,n[i]=t}if(r===0)return null;let i=t/r<.3?0:1,a=new Int8Array(t);for(let e=0;e<t;e++)a[e]=i;let o=i&1?`R`:`L`,s=o,c=s;for(let e=0;e<t;e++)n[e]===`NSM`?n[e]=c:c=n[e];c=s;for(let e=0;e<t;e++){let t=n[e];t===`EN`?n[e]=c===`AL`?`AN`:`EN`:(t===`R`||t===`L`||t===`AL`)&&(c=t)}for(let e=0;e<t;e++)n[e]===`AL`&&(n[e]=`R`);for(let e=1;e<t-1;e++)n[e]===`ES`&&n[e-1]===`EN`&&n[e+1]===`EN`&&(n[e]=`EN`),n[e]===`CS`&&(n[e-1]===`EN`||n[e-1]===`AN`)&&n[e+1]===n[e-1]&&(n[e]=n[e-1]);for(let e=0;e<t;e++){if(n[e]!==`EN`)continue;let r;for(r=e-1;r>=0&&n[r]===`ET`;r--)n[r]=`EN`;for(r=e+1;r<t&&n[r]===`ET`;r++)n[r]=`EN`}for(let e=0;e<t;e++){let t=n[e];(t===`WS`||t===`ES`||t===`ET`||t===`CS`)&&(n[e]=`ON`)}c=s;for(let e=0;e<t;e++){let t=n[e];t===`EN`?n[e]=c===`L`?`L`:`EN`:(t===`R`||t===`L`)&&(c=t)}for(let e=0;e<t;e++){if(n[e]!==`ON`)continue;let r=e+1;for(;r<t&&n[r]===`ON`;)r++;let i=e>0?n[e-1]:s,a=r<t?n[r]:s,o=i===`L`?`L`:`R`;if(o===(a===`L`?`L`:`R`))for(let t=e;t<r;t++)n[t]=o;e=r-1}for(let e=0;e<t;e++)n[e]===`ON`&&(n[e]=o);for(let e=0;e<t;e++){let t=n[e];a[e]&1?(t===`L`||t===`AN`||t===`EN`)&&a[e]++:t===`R`?a[e]++:(t===`AN`||t===`EN`)&&(a[e]+=2)}return a}function fe(e,t){let n=de(e);if(n===null)return null;let r=new Int8Array(t.length);for(let e=0;e<t.length;e++)r[e]=n[t[e]];return r}var pe=/[ \t\n\r\f]+/g,me=/[\t\n\r\f]| {2,}|^ | $/;function he(e){let t=e??`normal`;return t===`pre-wrap`?{mode:t,preserveOrdinarySpaces:!0,preserveHardBreaks:!0}:{mode:t,preserveOrdinarySpaces:!1,preserveHardBreaks:!1}}function ge(e){if(!me.test(e))return e;let t=e.replace(pe,` `);return t.charCodeAt(0)===32&&(t=t.slice(1)),t.length>0&&t.charCodeAt(t.length-1)===32&&(t=t.slice(0,-1)),t}function _e(e){return/[\r\f]/.test(e)?e.replace(/\r\n/g,`
`).replace(/[\r\f]/g,`
`):e.replace(/\r\n/g,`
`)}var ve=null,ye;function be(){return ve===null&&(ve=new Intl.Segmenter(ye,{granularity:`word`})),ve}var xe=/\p{Script=Arabic}/u,z=/\p{M}/u,Se=/\p{Nd}/u;function B(e){return xe.test(e)}function V(e){for(let t of e){let e=t.codePointAt(0);if(e>=19968&&e<=40959||e>=13312&&e<=19903||e>=131072&&e<=173791||e>=173824&&e<=177983||e>=177984&&e<=178207||e>=178208&&e<=183983||e>=183984&&e<=191471||e>=196608&&e<=201551||e>=63744&&e<=64255||e>=194560&&e<=195103||e>=12288&&e<=12351||e>=12352&&e<=12447||e>=12448&&e<=12543||e>=44032&&e<=55215||e>=65280&&e<=65519)return!0}return!1}var Ce=new Set(`，.．.！.：.；.？.、.。.・.）.〕.〉.》.」.』.】.〗.〙.〛.ー.々.〻.ゝ.ゞ.ヽ.ヾ`.split(`.`)),H=new Set([`"`,`(`,`[`,`{`,`“`,`‘`,`«`,`‹`,`（`,`〔`,`〈`,`《`,`「`,`『`,`【`,`〖`,`〘`,`〚`]),U=new Set([`'`,`’`]),W=new Set(`.(,(!(?(:(;(،(؛(؟(।(॥(၊(။(၌(၍(၏()(](}(%("(”(’(»(›(…`.split(`(`)),we=new Set([`:`,`.`,`،`,`؛`]),Te=new Set([`၏`]),Ee=new Set([`”`,`’`,`»`,`›`,`」`,`』`,`】`,`》`,`〉`,`〕`,`）`]);function De(e){if(G(e))return!0;let t=!1;for(let n of e){if(W.has(n)){t=!0;continue}if(!(t&&z.test(n)))return!1}return t}function Oe(e){for(let t of e)if(!Ce.has(t)&&!W.has(t))return!1;return e.length>0}function ke(e){if(G(e))return!0;for(let t of e)if(!H.has(t)&&!U.has(t)&&!z.test(t))return!1;return e.length>0}function G(e){let t=!1;for(let n of e)if(!(n===`\\`||z.test(n))){if(H.has(n)||W.has(n)||U.has(n)){t=!0;continue}return!1}return t}function Ae(e){let t=Array.from(e),n=t.length;for(;n>0;){let e=t[n-1];if(z.test(e)){n--;continue}if(H.has(e)||U.has(e)){n--;continue}break}return n<=0||n===t.length?null:{head:t.slice(0,n).join(``),tail:t.slice(n).join(``)}}function je(e,t){if(e.length===0)return!1;for(let n of e)if(n!==t)return!1;return!0}function Me(e){return!B(e)||e.length===0?!1:we.has(e[e.length-1])}function Ne(e){return e.length===0?!1:Te.has(e[e.length-1])}function Pe(e){if(e.length<2||e[0]!==` `)return null;let t=e.slice(1);return/^\p{M}+$/u.test(t)?{space:` `,marks:t}:null}function Fe(e){for(let t=e.length-1;t>=0;t--){let n=e[t];if(Ee.has(n))return!0;if(!W.has(n))return!1}return!1}function Ie(e,t){if(t.preserveOrdinarySpaces||t.preserveHardBreaks){if(e===` `)return`preserved-space`;if(e===`	`)return`tab`;if(t.preserveHardBreaks&&e===`
`)return`hard-break`}return e===` `?`space`:e===`\xA0`||e===` `||e===`⁠`||e===`﻿`?`glue`:e===`​`?`zero-width-break`:e===`­`?`soft-hyphen`:`text`}function K(e){return e.length===1?e[0]:e.join(``)}function Le(e,t,n,r){let i=[],a=null,o=[],s=n,c=!1,l=0;for(let u of e){let e=Ie(u,r),d=e===`text`&&t;if(a!==null&&e===a&&d===c){o.push(u),l+=u.length;continue}a!==null&&i.push({text:K(o),isWordLike:c,kind:a,start:s}),a=e,o=[u],s=n+l,c=d,l+=u.length}return a!==null&&i.push({text:K(o),isWordLike:c,kind:a,start:s}),i}function q(e){return e===`space`||e===`preserved-space`||e===`zero-width-break`||e===`hard-break`}var Re=/^[A-Za-z][A-Za-z0-9+.-]*:$/;function ze(e,t){let n=e.texts[t];return n.startsWith(`www.`)?!0:Re.test(n)&&t+1<e.len&&e.kinds[t+1]===`text`&&e.texts[t+1]===`//`}function Be(e){return e.includes(`?`)&&(e.includes(`://`)||e.startsWith(`www.`))}function Ve(e){let t=e.texts.slice(),n=e.isWordLike.slice(),r=e.kinds.slice(),i=e.starts.slice();for(let i=0;i<e.len;i++){if(r[i]!==`text`||!ze(e,i))continue;let a=[t[i]],o=i+1;for(;o<e.len&&!q(r[o]);){a.push(t[o]),n[i]=!0;let e=t[o].includes(`?`);if(r[o]=`text`,t[o]=``,o++,e)break}t[i]=K(a)}let a=0;for(let e=0;e<t.length;e++){let o=t[e];o.length!==0&&(a!==e&&(t[a]=o,n[a]=n[e],r[a]=r[e],i[a]=i[e]),a++)}return t.length=a,n.length=a,r.length=a,i.length=a,{len:a,texts:t,isWordLike:n,kinds:r,starts:i}}function He(e){let t=[],n=[],r=[],i=[];for(let a=0;a<e.len;a++){let o=e.texts[a];if(t.push(o),n.push(e.isWordLike[a]),r.push(e.kinds[a]),i.push(e.starts[a]),!Be(o))continue;let s=a+1;if(s>=e.len||q(e.kinds[s]))continue;let c=[],l=e.starts[s],u=s;for(;u<e.len&&!q(e.kinds[u]);)c.push(e.texts[u]),u++;c.length>0&&(t.push(K(c)),n.push(!0),r.push(`text`),i.push(l),a=u-1)}return{len:t.length,texts:t,isWordLike:n,kinds:r,starts:i}}var Ue=new Set([`:`,`-`,`/`,`×`,`,`,`.`,`+`,`–`,`—`]),We=/^[A-Za-z0-9_]+[,:;]*$/,Ge=/[,:;]+$/;function Ke(e){for(let t of e)if(Se.test(t))return!0;return!1}function J(e){if(e.length===0)return!1;for(let t of e)if(!(Se.test(t)||Ue.has(t)))return!1;return!0}function qe(e){let t=[],n=[],r=[],i=[];for(let a=0;a<e.len;a++){let o=e.texts[a],s=e.kinds[a];if(s===`text`&&J(o)&&Ke(o)){let s=[o],c=a+1;for(;c<e.len&&e.kinds[c]===`text`&&J(e.texts[c]);)s.push(e.texts[c]),c++;t.push(K(s)),n.push(!0),r.push(`text`),i.push(e.starts[a]),a=c-1;continue}t.push(o),n.push(e.isWordLike[a]),r.push(s),i.push(e.starts[a])}return{len:t.length,texts:t,isWordLike:n,kinds:r,starts:i}}function Je(e){let t=[],n=[],r=[],i=[];for(let a=0;a<e.len;a++){let o=e.texts[a],s=e.kinds[a],c=e.isWordLike[a];if(s===`text`&&c&&We.test(o)){let s=[o],c=Ge.test(o),l=a+1;for(;c&&l<e.len&&e.kinds[l]===`text`&&e.isWordLike[l]&&We.test(e.texts[l]);){let t=e.texts[l];s.push(t),c=Ge.test(t),l++}t.push(K(s)),n.push(!0),r.push(`text`),i.push(e.starts[a]),a=l-1;continue}t.push(o),n.push(c),r.push(s),i.push(e.starts[a])}return{len:t.length,texts:t,isWordLike:n,kinds:r,starts:i}}function Ye(e){let t=[],n=[],r=[],i=[];for(let a=0;a<e.len;a++){let o=e.texts[a];if(e.kinds[a]===`text`&&o.includes(`-`)){let s=o.split(`-`),c=s.length>1;for(let e=0;e<s.length;e++){let t=s[e];if(!c)break;(t.length===0||!Ke(t)||!J(t))&&(c=!1)}if(c){let o=0;for(let c=0;c<s.length;c++){let l=s[c],u=c<s.length-1?`${l}-`:l;t.push(u),n.push(!0),r.push(`text`),i.push(e.starts[a]+o),o+=u.length}continue}}t.push(o),n.push(e.isWordLike[a]),r.push(e.kinds[a]),i.push(e.starts[a])}return{len:t.length,texts:t,isWordLike:n,kinds:r,starts:i}}function Xe(e){let t=[],n=[],r=[],i=[],a=0;for(;a<e.len;){let o=[e.texts[a]],s=e.isWordLike[a],c=e.kinds[a],l=e.starts[a];if(c===`glue`){let u=[o[0]],d=l;for(a++;a<e.len&&e.kinds[a]===`glue`;)u.push(e.texts[a]),a++;let f=K(u);if(a<e.len&&e.kinds[a]===`text`)o[0]=f,o.push(e.texts[a]),s=e.isWordLike[a],c=`text`,l=d,a++;else{t.push(f),n.push(!1),r.push(`glue`),i.push(d);continue}}else a++;if(c===`text`)for(;a<e.len&&e.kinds[a]===`glue`;){let t=[];for(;a<e.len&&e.kinds[a]===`glue`;)t.push(e.texts[a]),a++;let n=K(t);if(a<e.len&&e.kinds[a]===`text`){o.push(n,e.texts[a]),s||=e.isWordLike[a],a++;continue}o.push(n)}t.push(K(o)),n.push(s),r.push(c),i.push(l)}return{len:t.length,texts:t,isWordLike:n,kinds:r,starts:i}}function Ze(e){let t=e.texts.slice(),n=e.isWordLike.slice(),r=e.kinds.slice(),i=e.starts.slice();for(let e=0;e<t.length-1;e++){if(r[e]!==`text`||r[e+1]!==`text`||!V(t[e])||!V(t[e+1]))continue;let n=Ae(t[e]);n!==null&&(t[e]=n.head,t[e+1]=n.tail+t[e+1],i[e+1]=i[e]+n.head.length)}return{len:t.length,texts:t,isWordLike:n,kinds:r,starts:i}}function Qe(e,t,n){let r=be(),i=0,a=[],o=[],s=[],c=[];for(let l of r.segment(e))for(let e of Le(l.segment,l.isWordLike??!1,l.index,n)){let n=e.kind===`text`;t.carryCJKAfterClosingQuote&&n&&i>0&&s[i-1]===`text`&&V(e.text)&&V(a[i-1])&&Fe(a[i-1])||n&&i>0&&s[i-1]===`text`&&Oe(e.text)&&V(a[i-1])||n&&i>0&&s[i-1]===`text`&&Ne(a[i-1])?(a[i-1]+=e.text,o[i-1]=o[i-1]||e.isWordLike):n&&i>0&&s[i-1]===`text`&&e.isWordLike&&B(e.text)&&Me(a[i-1])?(a[i-1]+=e.text,o[i-1]=!0):n&&!e.isWordLike&&i>0&&s[i-1]===`text`&&e.text.length===1&&e.text!==`-`&&e.text!==`—`&&je(a[i-1],e.text)||n&&!e.isWordLike&&i>0&&s[i-1]===`text`&&(De(e.text)||e.text===`-`&&o[i-1])?a[i-1]+=e.text:(a[i]=e.text,o[i]=e.isWordLike,s[i]=e.kind,c[i]=e.start,i++)}for(let e=1;e<i;e++)s[e]===`text`&&!o[e]&&G(a[e])&&s[e-1]===`text`&&(a[e-1]+=a[e],o[e-1]=o[e-1]||o[e],a[e]=``);for(let e=i-2;e>=0;e--)if(s[e]===`text`&&!o[e]&&ke(a[e])){let t=e+1;for(;t<i&&a[t]===``;)t++;t<i&&s[t]===`text`&&(a[t]=a[e]+a[t],c[t]=c[e],a[e]=``)}let l=0;for(let e=0;e<i;e++){let t=a[e];t.length!==0&&(l!==e&&(a[l]=t,o[l]=o[e],s[l]=s[e],c[l]=c[e]),l++)}a.length=l,o.length=l,s.length=l,c.length=l;let u=Ze(Je(Ye(qe(He(Ve(Xe({len:l,texts:a,isWordLike:o,kinds:s,starts:c})))))));for(let e=0;e<u.len-1;e++){let t=Pe(u.texts[e]);t!==null&&(u.kinds[e]!==`space`&&u.kinds[e]!==`preserved-space`||u.kinds[e+1]!==`text`||!B(u.texts[e+1])||(u.texts[e]=t.space,u.isWordLike[e]=!1,u.kinds[e]=u.kinds[e]===`preserved-space`?`preserved-space`:`space`,u.texts[e+1]=t.marks+u.texts[e+1],u.starts[e+1]=u.starts[e]+t.space.length))}return u}function $e(e,t){if(e.len===0)return[];if(!t.preserveHardBreaks)return[{startSegmentIndex:0,endSegmentIndex:e.len,consumedEndSegmentIndex:e.len}];let n=[],r=0;for(let t=0;t<e.len;t++)e.kinds[t]===`hard-break`&&(n.push({startSegmentIndex:r,endSegmentIndex:t,consumedEndSegmentIndex:t+1}),r=t+1);return r<e.len&&n.push({startSegmentIndex:r,endSegmentIndex:e.len,consumedEndSegmentIndex:e.len}),n}function et(e,t,n=`normal`){let r=he(n),i=r.mode===`pre-wrap`?_e(e):ge(e);if(i.length===0)return{normalized:i,chunks:[],len:0,texts:[],isWordLike:[],kinds:[],starts:[]};let a=Qe(i,t,r);return{normalized:i,chunks:$e(a,r),...a}}var Y=null,tt=new Map,X=null,nt=/\p{Emoji_Presentation}/u,rt=/[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u20E3]/u,it=null,at=new Map;function ot(){if(Y!==null)return Y;if(typeof OffscreenCanvas<`u`)return Y=new OffscreenCanvas(1,1).getContext(`2d`),Y;if(typeof document<`u`)return Y=document.createElement(`canvas`).getContext(`2d`),Y;throw Error(`Text measurement requires OffscreenCanvas or a DOM canvas context.`)}function st(e){let t=tt.get(e);return t||(t=new Map,tt.set(e,t)),t}function Z(e,t){let n=t.get(e);return n===void 0&&(n={width:ot().measureText(e).width,containsCJK:V(e)},t.set(e,n)),n}function ct(){if(X!==null)return X;if(typeof navigator>`u`)return X={lineFitEpsilon:.005,carryCJKAfterClosingQuote:!1,preferPrefixWidthsForBreakableRuns:!1,preferEarlySoftHyphenBreak:!1},X;let e=navigator.userAgent,t=navigator.vendor===`Apple Computer, Inc.`&&e.includes(`Safari/`)&&!e.includes(`Chrome/`)&&!e.includes(`Chromium/`)&&!e.includes(`CriOS/`)&&!e.includes(`FxiOS/`)&&!e.includes(`EdgiOS/`),n=e.includes(`Chrome/`)||e.includes(`Chromium/`)||e.includes(`CriOS/`)||e.includes(`Edg/`);return X={lineFitEpsilon:t?1/64:.005,carryCJKAfterClosingQuote:n,preferPrefixWidthsForBreakableRuns:t,preferEarlySoftHyphenBreak:t},X}function lt(e){let t=e.match(/(\d+(?:\.\d+)?)\s*px/);return t?parseFloat(t[1]):16}function ut(){return it===null&&(it=new Intl.Segmenter(void 0,{granularity:`grapheme`})),it}function dt(e){return nt.test(e)||e.includes(`️`)}function ft(e){return rt.test(e)}function pt(e,t){let n=at.get(e);if(n!==void 0)return n;let r=ot();r.font=e;let i=r.measureText(`😀`).width;if(n=0,i>t+.5&&typeof document<`u`&&document.body!==null){let t=document.createElement(`span`);t.style.font=e,t.style.display=`inline-block`,t.style.visibility=`hidden`,t.style.position=`absolute`,t.textContent=`😀`,document.body.appendChild(t);let r=t.getBoundingClientRect().width;document.body.removeChild(t),i-r>.5&&(n=i-r)}return at.set(e,n),n}function mt(e){let t=0,n=ut();for(let r of n.segment(e))dt(r.segment)&&t++;return t}function ht(e,t){return t.emojiCount===void 0&&(t.emojiCount=mt(e)),t.emojiCount}function Q(e,t,n){return n===0?t.width:t.width-ht(e,t)*n}function gt(e,t,n,r){if(t.graphemeWidths!==void 0)return t.graphemeWidths;let i=[],a=ut();for(let t of a.segment(e)){let e=Z(t.segment,n);i.push(Q(t.segment,e,r))}return t.graphemeWidths=i.length>1?i:null,t.graphemeWidths}function _t(e,t,n,r){if(t.graphemePrefixWidths!==void 0)return t.graphemePrefixWidths;let i=[],a=ut(),o=``;for(let t of a.segment(e)){o+=t.segment;let e=Z(o,n);i.push(Q(o,e,r))}return t.graphemePrefixWidths=i.length>1?i:null,t.graphemePrefixWidths}function vt(e,t){let n=ot();n.font=e;let r=st(e),i=lt(e);return{cache:r,fontSize:i,emojiCorrection:t?pt(e,i):0}}var yt=null;function bt(){return yt===null&&(yt=new Intl.Segmenter(void 0,{granularity:`grapheme`})),yt}function xt(e){return e?{widths:[],lineEndFitAdvances:[],lineEndPaintAdvances:[],kinds:[],simpleLineWalkFastPath:!0,segLevels:null,breakableWidths:[],breakablePrefixWidths:[],discretionaryHyphenWidth:0,tabStopAdvance:0,chunks:[],segments:[]}:{widths:[],lineEndFitAdvances:[],lineEndPaintAdvances:[],kinds:[],simpleLineWalkFastPath:!0,segLevels:null,breakableWidths:[],breakablePrefixWidths:[],discretionaryHyphenWidth:0,tabStopAdvance:0,chunks:[]}}function St(e,t,n){let r=bt(),i=ct(),{cache:a,emojiCorrection:o}=vt(t,ft(e.normalized)),s=Q(`-`,Z(`-`,a),o),c=Q(` `,Z(` `,a),o)*8;if(e.len===0)return xt(n);let l=[],u=[],d=[],f=[],p=e.chunks.length<=1,m=n?[]:null,h=[],g=[],_=n?[]:null,v=Array.from({length:e.len}),y=Array.from({length:e.len});function b(e,t,n,r,i,a,o,s){i!==`text`&&i!==`space`&&i!==`zero-width-break`&&(p=!1),l.push(t),u.push(n),d.push(r),f.push(i),m?.push(a),h.push(o),g.push(s),_!==null&&_.push(e)}for(let t=0;t<e.len;t++){v[t]=l.length;let n=e.texts[t],c=e.isWordLike[t],u=e.kinds[t],d=e.starts[t];if(u===`soft-hyphen`){b(n,0,s,s,u,d,null,null),y[t]=l.length;continue}if(u===`hard-break`){b(n,0,0,0,u,d,null,null),y[t]=l.length;continue}if(u===`tab`){b(n,0,0,0,u,d,null,null),y[t]=l.length;continue}let f=Z(n,a);if(u===`text`&&f.containsCJK){let e=``,s=0;for(let t of r.segment(n)){let n=t.segment;if(e.length===0){e=n,s=t.index;continue}if(H.has(e)||Ce.has(n)||W.has(n)||i.carryCJKAfterClosingQuote&&V(n)&&Fe(e)){e+=n;continue}let r=Z(e,a),c=Q(e,r,o);b(e,c,c,c,`text`,d+s,null,null),e=n,s=t.index}if(e.length>0){let t=Z(e,a),n=Q(e,t,o);b(e,n,n,n,`text`,d+s,null,null)}y[t]=l.length;continue}let p=Q(n,f,o),m=u===`space`||u===`preserved-space`||u===`zero-width-break`?0:p,h=u===`space`||u===`zero-width-break`?0:p;c&&n.length>1?b(n,p,m,h,u,d,gt(n,f,a,o),i.preferPrefixWidthsForBreakableRuns?_t(n,f,a,o):null):b(n,p,m,h,u,d,null,null),y[t]=l.length}let x=Ct(e.chunks,v,y),S=m===null?null:fe(e.normalized,m);return _===null?{widths:l,lineEndFitAdvances:u,lineEndPaintAdvances:d,kinds:f,simpleLineWalkFastPath:p,segLevels:S,breakableWidths:h,breakablePrefixWidths:g,discretionaryHyphenWidth:s,tabStopAdvance:c,chunks:x}:{widths:l,lineEndFitAdvances:u,lineEndPaintAdvances:d,kinds:f,simpleLineWalkFastPath:p,segLevels:S,breakableWidths:h,breakablePrefixWidths:g,discretionaryHyphenWidth:s,tabStopAdvance:c,chunks:x,segments:_}}function Ct(e,t,n){let r=[];for(let i=0;i<e.length;i++){let a=e[i],o=a.startSegmentIndex<t.length?t[a.startSegmentIndex]:n[n.length-1]??0,s=a.endSegmentIndex<t.length?t[a.endSegmentIndex]:n[n.length-1]??0,c=a.consumedEndSegmentIndex<t.length?t[a.consumedEndSegmentIndex]:n[n.length-1]??0;r.push({startSegmentIndex:o,endSegmentIndex:s,consumedEndSegmentIndex:c})}return r}function wt(e,t,n,r){return St(et(e,ct(),r?.whiteSpace),t,n)}function Tt(e,t,n){return wt(e,t,!0,n)}var Et=` .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~^`,Dt=[400,600,800],Ot=class{constructor(e,t){this.options=t,this.dpr=1,this.cellW=0,this.cellH=0,this.cols=0,this.rows=0,this.lookup=[],this.paletteBuilt=!1,this.canvas=e,this.ctx=e.getContext(`2d`),this.bCanvas=document.createElement(`canvas`),this.bCanvas.width=28,this.bCanvas.height=28,this.bCtx=this.bCanvas.getContext(`2d`,{willReadFrequently:!0})}estimateBrightness(e,t){this.bCtx.clearRect(0,0,28,28),this.bCtx.font=t,this.bCtx.fillStyle=`#fff`,this.bCtx.textBaseline=`middle`,this.bCtx.fillText(e,1,28/2);let n=this.bCtx.getImageData(0,0,28,28).data,r=0;for(let e=3;e<n.length;e+=4)r+=n[e];return r/(7140*28)}buildPalette(){if(this.paletteBuilt)return;let e=this.options.fontSize,t=this.options.fontFamily,n=[];for(let r of Dt){let i=`${r} ${e}px ${t}`;for(let e of Et){if(e===` `)continue;let t=Tt(e,i),r=t.widths.length>0?t.widths[0]:0;if(r<=0)continue;let a=this.estimateBrightness(e,i);a>0&&n.push({char:e,width:r,brightness:a,font:i})}}let r=Math.max(...n.map(e=>e.brightness));if(r>0)for(let e of n)e.brightness/=r;n.sort((e,t)=>e.brightness-t.brightness),this.lookup=[];for(let r=0;r<256;r++){let i=r/255;if(i<.02){this.lookup.push({char:` `,font:`400 ${e}px ${t}`});continue}let a=0,o=n.length-1;for(;a<o;){let e=a+o>>1;n[e].brightness<i?a=e+1:o=e}let s=n[a],c=1/0,l=Math.max(0,a-12),u=Math.min(n.length,a+12);for(let e=l;e<u;e++){let t=n[e],r=Math.abs(t.brightness-i)*2,a=Math.abs(t.width-this.cellW)/Math.max(this.cellW,1);r+a<c&&(c=r+a,s=t)}this.lookup.push({char:s.char,font:s.font})}this.paletteBuilt=!0}resize(){this.dpr=window.devicePixelRatio||1;let e=window.innerWidth,t=window.innerHeight;return this.canvas.width=Math.round(e*this.dpr),this.canvas.height=Math.round(t*this.dpr),this.cellW=this.options.fontSize*.7,this.cellH=this.options.fontSize*1.4,this.cols=Math.floor(e/this.cellW),this.rows=Math.floor(t/this.cellH),{cols:this.cols,rows:this.rows}}render(e,t,n){this.buildPalette();let{ctx:r,dpr:i,cols:a,rows:o,cellW:s,cellH:c,lookup:l}=this,u=this.canvas.width/i,d=this.canvas.height/i;r.setTransform(i,0,0,i,0,0),r.fillStyle=`#0a0a12`,r.fillRect(0,0,u,d),r.textBaseline=`top`,t.update?.(n,a,o);let f=new Set,p=new Map;for(let t of e)if(t.bgModifier?.type===`dim`){let e=`${t.col},${t.row}`;p.set(e,t.bgModifier.amount)}else t.char!==` `&&f.add(`${t.col},${t.row}`);for(let e=0;e<o;e++){let i=e*c;for(let o=0;o<a;o++){let a=`${o},${e}`,c=p.get(a);if(f.has(a)&&c===void 0)continue;let[u,d,m]=t.sample(o,e,n);if(c!==void 0){let e=u*c,t=d*c,n=m*c,a=.299*e+.587*t+.114*n,f=l[Math.min(255,a|0)];if(f&&f.char!==` `){let[a,c,l]=se(e,t,n);r.font=f.font,r.fillStyle=`hsl(${a*360}, ${Math.min(100,c*120)}%, ${Math.min(100,(l*1.4+.15)*100)}%)`,r.fillText(f.char,o*s,i)}continue}let h=.299*u+.587*d+.114*m,g=l[Math.min(255,h|0)];if(!g||g.char===` `)continue;let[_,v,y]=se(u,d,m);r.font=g.font,r.fillStyle=`hsl(${_*360}, ${Math.min(100,v*120)}%, ${Math.min(100,(y*1.4+.15)*100)}%)`,r.fillText(g.char,o*s,i)}}for(let i of e){if(i.char===` `)continue;let e=i.col*s,a=i.row*c,[o,l,u]=t.sample(i.col,i.row,n),[d,f,p]=se(o,l,u),m=`400`;i.font.includes(`bold`)||i.font.includes(`800`)?m=`800`:i.font.includes(`700`)?m=`700`:i.font.includes(`600`)&&(m=`600`);let h=Math.sin(i.col*7.3+i.row*13.7)*.3,g=Math.sin((i.col+i.row*2)*.06+h-n*.0025),_=Math.max(0,g)**3,v=Math.max(0,-g)**2,y=i.font.includes(`heading`),b=y?1:.5,x=.15+_*.8*b-v*.35*b,S=-_*1*b+v*.3*b;i.font.includes(`dim`)&&(x=-.1,S=0),y&&(x+=.05),i.interactive?.hovered&&(x+=.1);let C=p*1.4+.15+x,w=Math.min(1,C),T=Math.min(1,Math.max(0,f*1.3+S));r.font=`${m} ${this.options.fontSize}px "Courier New", Courier, monospace`,r.fillStyle=`hsl(${d*360}, ${Math.min(100,T*100)}%, ${Math.min(100,w*100)}%)`,r.fillText(i.char,e,a)}}},kt=class{constructor(){this.data=new Map,this.watchers=new Map,this.globalListeners=new Set}get(e){return this.data.get(e)}set(e,t){if(this.data.get(e)===t)return;this.data.set(e,t);let n=this.watchers.get(e);if(n)for(let e of n)e(t);for(let n of this.globalListeners)n(e,t)}watch(e,t){return this.watchers.has(e)||this.watchers.set(e,new Set),this.watchers.get(e).add(t),()=>{this.watchers.get(e)?.delete(t)}}onChange(e){return this.globalListeners.add(e),()=>{this.globalListeners.delete(e)}}},At=class{constructor(){this.index=new Map,this.handlers=new Map,this.hoveredId=null}update(e){this.index.clear();for(let t of e)t.interactive&&this.index.set(`${t.col},${t.row}`,t)}hitTest(e,t){let n=this.index.get(`${e},${t}`);return n?.interactive?{id:n.interactive.id,action:n.interactive.action}:null}hover(e,t){let n=this.index.get(`${e},${t}`)?.interactive?.id??null;if(n!==this.hoveredId){if(this.hoveredId!==null)for(let e of this.index.values())e.interactive&&e.interactive.id===this.hoveredId&&(e.interactive.hovered=!1);if(this.hoveredId=n,n!==null)for(let e of this.index.values())e.interactive&&e.interactive.id===n&&(e.interactive.hovered=!0)}}click(e,t){let n=this.hitTest(e,t);if(!n)return;let r=this.handlers.get(n.action);if(r)for(let e of r)e(n.action);for(let[e,t]of this.handlers)if(e.endsWith(`:*`)&&n.action.startsWith(e.slice(0,-1)))for(let e of t)e(n.action)}fireAction(e){let t=this.handlers.get(e);if(t)for(let n of t)n(e)}on(e,t){return this.handlers.has(e)||this.handlers.set(e,new Set),this.handlers.get(e).add(t),()=>{this.handlers.get(e)?.delete(t)}}};function jt(e,t){t?.mode;let n=document.createElement(`video`);n.src=e,n.muted=!0,n.loop=!0,n.playsInline=!0,n.style.display=`none`,document.body.appendChild(n);let r=document.createElement(`canvas`),i=r.getContext(`2d`),a=null,o=0,s=0,c=0,l=0,u=0,d=0;function f(){if(!n.videoWidth||!n.videoHeight)return;let e=n.videoWidth/n.videoHeight;e>u*1/(d*2)?(s=d,o=Math.round(d*e*(2/1))):(o=u,s=Math.round(u/e*(1/2))),c=Math.floor((u-o)/2),l=Math.floor((d-s)/2),r.width=o,r.height=s}return{setup(e,t){u=e,d=t,n.play().catch(()=>{})},update(e,t,r){u=t,d=r,!(!n.videoWidth||!n.videoHeight)&&(f(),i.drawImage(n,0,0,o,s),a=i.getImageData(0,0,o,s).data)},sample(e,t,n){if(!a)return[0,0,0];let r=e-c,i=t-l;if(r<0||r>=o||i<0||i>=s)return[0,0,0];let u=(i*o+r)*4;return[a[u],a[u+1],a[u+2]]},teardown(){n.pause(),n.remove(),a=null}}}function Mt(e){return e=e.replace(`#`,``),e.length===3&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16)]}function Nt(e,t,n){if(t===0){let e=Math.round(n*255);return[e,e,e]}let r=(e,t,n)=>(n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e),i=n<.5?n*(1+t):n+t-n*t,a=2*n-i,o=r(a,i,e+1/3),s=r(a,i,e),c=r(a,i,e-1/3);return[Math.round(o*255),Math.round(s*255),Math.round(c*255)]}function $(e,t){let n=0,r=0;if(e===`rainbow`)return{setup(e,t){n=e,r=t},sample(e,t,r){return Nt(n>1?e/n:0,.8,.5)},teardown(){}};let i=Mt(t?.from??`#000000`),a=Mt(t?.to??`#ffffff`),o=t?.angle??0;return{setup(e,t){n=e,r=t},sample(e,t,s){let c=o*Math.PI/180,l=Math.cos(c),u=Math.sin(c),d=n>1?e/(n-1):0,f=r>1?t/(r-1):0,p=d*l+f*u,m=Math.min(0,l)+Math.min(0,u),h=Math.max(0,l)+Math.max(0,u)-m,g=h>0?Math.max(0,Math.min(1,(p-m)/h)):0;return[Math.round(i[0]+(a[0]-i[0])*g),Math.round(i[1]+(a[1]-i[1])*g),Math.round(i[2]+(a[2]-i[2])*g)]},teardown(){}}}function Pt(e){return e=e.replace(`#`,``),e.length===3&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16)]}function Ft(e){let t=Pt(e);return{setup(){},sample(){return t},teardown(){}}}function It(e,t,n={}){let r=new kt,i=new Ot(t,{fontSize:n.fontSize??14,fontFamily:n.fontFamily??`"Courier New", Courier, monospace`}),a=new At,o=n.background??Ft(`#0a0a12`),s=m(e),c=[],l=null;function u(){let{cols:e,rows:t}=i.resize();c=oe(j(d(s,r),e,t)),a.update(c),o.setup(e,t)}function d(e,t){return{type:`root`,children:f(e.children,t)}}function f(e,t){let n=[];for(let r of e)if(r.type===`conditional`){let e=String(t.get(r.key)??``);(r.operator===`==`?e===r.value:e!==r.value)&&n.push(...f(r.children,t))}else if(r.type===`each`){let e=t.get(r.collection);if(Array.isArray(e))for(let i of e)n.push(...f(r.children,t))}else r.children?n.push({...r,children:f(r.children,t)}):n.push(r);return n}function p(e){i.render(c,o,e),l=requestAnimationFrame(p)}function h(e){let n=t.getBoundingClientRect(),r=e.clientX-n.left,a=e.clientY-n.top;return{col:Math.floor(r/i.cellW),row:Math.floor(a/i.cellH)}}return t.addEventListener(`mousemove`,e=>{let{col:n,row:r}=h(e);a.hover(n,r);let i=a.hitTest(n,r);t.style.cursor=i?`pointer`:`default`}),t.addEventListener(`click`,e=>{let{col:t,row:n}=h(e);a.hitTest(t,n)?a.click(t,n):a.fireAction(`backdrop-click`)}),t.addEventListener(`touchstart`,e=>{let n=e.touches[0];if(!n)return;let r=t.getBoundingClientRect(),o=Math.floor((n.clientX-r.left)/i.cellW),s=Math.floor((n.clientY-r.top)/i.cellH);a.click(o,s)}),t.addEventListener(`wheel`,e=>{let{row:t}=h(e),n=te();for(let o of n)if(t>=o.top&&t<o.bottom){let t=o.bottom-o.top,n=Math.max(0,o.contentHeight-t),l=re(o.id),u=Math.max(0,Math.min(n,l+Math.sign(e.deltaY)));if(u!==l){ne(o.id,u);let e=d(s,r),{cols:t,rows:n}={cols:i.cols,rows:i.rows};c=oe(j(e,t,n)),a.update(c)}e.preventDefault();break}},{passive:!1}),window.addEventListener(`resize`,()=>u()),a.on(`menu-select:*`,e=>{let t=e.split(`:`);if(t.length>=3){let e=t[1],n=t.slice(2).join(`:`);r.set(e,n)}}),r.onChange(()=>u()),{state:r,on:(e,t)=>a.on(e,t),start(){u(),l=requestAnimationFrame(p)},stop(){l!==null&&(cancelAnimationFrame(l),l=null)},destroy(){this.stop(),o.teardown()},setMarkup(e){s=m(e),u()},setBackground(e){o.teardown(),o=e,u()}}}var Lt=`flf2a$ 7 7 13 0 7 0 64 0
Font Author: ?

More Info:

https://web.archive.org/web/20120819044459/http://www.roysac.com/thedrawfonts-tdf.asp

FIGFont created with: http://patorjk.com/figfont-editor
$  $@
$  $@
$  $@
$  $@
$  $@
$  $@
$  $@@
██╗@
██║@
██║@
╚═╝@
██╗@
╚═╝@
   @@
@
@
@
@
@
@
@@
 ██╗ ██╗ @
████████╗@
╚██╔═██╔╝@
████████╗@
╚██╔═██╔╝@
 ╚═╝ ╚═╝ @
         @@
▄▄███▄▄·@
██╔════╝@
███████╗@
╚════██║@
███████║@
╚═▀▀▀══╝@
        @@
██╗ ██╗@
╚═╝██╔╝@
  ██╔╝ @
 ██╔╝  @
██╔╝██╗@
╚═╝ ╚═╝@
       @@
   ██╗   @
   ██║   @
████████╗@
██╔═██╔═╝@
██████║  @
╚═════╝  @
         @@
@
@
@
@
@
@
@@
 ██╗@
██╔╝@
██║ @
██║ @
╚██╗@
 ╚═╝@
    @@
██╗ @
╚██╗@
 ██║@
 ██║@
██╔╝@
╚═╝ @
    @@
      @
▄ ██╗▄@
 ████╗@
▀╚██╔▀@
  ╚═╝ @
      @
      @@
@
@
@
@
@
@
@@
   @
   @
   @
   @
▄█╗@
╚═╝@
   @@
      @
      @
█████╗@
╚════╝@
      @
      @
      @@
   @
   @
   @
   @
██╗@
╚═╝@
   @@
    ██╗@
   ██╔╝@
  ██╔╝ @
 ██╔╝  @
██╔╝   @
╚═╝    @
       @@
 ██████╗ @
██╔═████╗@
██║██╔██║@
████╔╝██║@
╚██████╔╝@
 ╚═════╝ @
         @@
 ██╗@
███║@
╚██║@
 ██║@
 ██║@
 ╚═╝@
    @@
██████╗ @
╚════██╗@
 █████╔╝@
██╔═══╝ @
███████╗@
╚══════╝@
        @@
██████╗ @
╚════██╗@
 █████╔╝@
 ╚═══██╗@
██████╔╝@
╚═════╝ @
        @@
██╗  ██╗@
██║  ██║@
███████║@
╚════██║@
     ██║@
     ╚═╝@
        @@
███████╗@
██╔════╝@
███████╗@
╚════██║@
███████║@
╚══════╝@
        @@
 ██████╗ @
██╔════╝ @
███████╗ @
██╔═══██╗@
╚██████╔╝@
 ╚═════╝ @
         @@
███████╗@
╚════██║@
    ██╔╝@
   ██╔╝ @
   ██║  @
   ╚═╝  @
        @@
 █████╗ @
██╔══██╗@
╚█████╔╝@
██╔══██╗@
╚█████╔╝@
 ╚════╝ @
        @@
 █████╗ @
██╔══██╗@
╚██████║@
 ╚═══██║@
 █████╔╝@
 ╚════╝ @
        @@
   @
██╗@
╚═╝@
██╗@
╚═╝@
   @
   @@
   @
██╗@
╚═╝@
▄█╗@
▀═╝@
   @
   @@
  ██╗@
 ██╔╝@
██╔╝ @
╚██╗ @
 ╚██╗@
  ╚═╝@
     @@
@
@
@
@
@
@
@@
██╗  @
╚██╗ @
 ╚██╗@
 ██╔╝@
██╔╝ @
╚═╝  @
     @@
██████╗ @
╚════██╗@
  ▄███╔╝@
  ▀▀══╝ @
  ██╗   @
  ╚═╝   @
        @@
 ██████╗ @
██╔═══██╗@
██║██╗██║@
██║██║██║@
╚█║████╔╝@
 ╚╝╚═══╝ @
         @@
 █████╗ @
██╔══██╗@
███████║@
██╔══██║@
██║  ██║@
╚═╝  ╚═╝@
        @@
██████╗ @
██╔══██╗@
██████╔╝@
██╔══██╗@
██████╔╝@
╚═════╝ @
        @@
 ██████╗@
██╔════╝@
██║     @
██║     @
╚██████╗@
 ╚═════╝@
        @@
██████╗ @
██╔══██╗@
██║  ██║@
██║  ██║@
██████╔╝@
╚═════╝ @
        @@
███████╗@
██╔════╝@
█████╗  @
██╔══╝  @
███████╗@
╚══════╝@
        @@
███████╗@
██╔════╝@
█████╗  @
██╔══╝  @
██║     @
╚═╝     @
        @@
 ██████╗ @
██╔════╝ @
██║  ███╗@
██║   ██║@
╚██████╔╝@
 ╚═════╝ @
         @@
██╗  ██╗@
██║  ██║@
███████║@
██╔══██║@
██║  ██║@
╚═╝  ╚═╝@
        @@
██╗@
██║@
██║@
██║@
██║@
╚═╝@
   @@
     ██╗@
     ██║@
     ██║@
██   ██║@
╚█████╔╝@
 ╚════╝ @
        @@
██╗  ██╗@
██║ ██╔╝@
█████╔╝ @
██╔═██╗ @
██║  ██╗@
╚═╝  ╚═╝@
        @@
██╗     @
██║     @
██║     @
██║     @
███████╗@
╚══════╝@
        @@
███╗   ███╗@
████╗ ████║@
██╔████╔██║@
██║╚██╔╝██║@
██║ ╚═╝ ██║@
╚═╝     ╚═╝@
           @@
███╗   ██╗@
████╗  ██║@
██╔██╗ ██║@
██║╚██╗██║@
██║ ╚████║@
╚═╝  ╚═══╝@
          @@
 ██████╗ @
██╔═══██╗@
██║   ██║@
██║   ██║@
╚██████╔╝@
 ╚═════╝ @
         @@
██████╗ @
██╔══██╗@
██████╔╝@
██╔═══╝ @
██║     @
╚═╝     @
        @@
 ██████╗ @
██╔═══██╗@
██║   ██║@
██║▄▄ ██║@
╚██████╔╝@
 ╚══▀▀═╝ @
         @@
██████╗ @
██╔══██╗@
██████╔╝@
██╔══██╗@
██║  ██║@
╚═╝  ╚═╝@
        @@
███████╗@
██╔════╝@
███████╗@
╚════██║@
███████║@
╚══════╝@
        @@
████████╗@
╚══██╔══╝@
   ██║   @
   ██║   @
   ██║   @
   ╚═╝   @
         @@
██╗   ██╗@
██║   ██║@
██║   ██║@
██║   ██║@
╚██████╔╝@
 ╚═════╝ @
         @@
██╗   ██╗@
██║   ██║@
██║   ██║@
╚██╗ ██╔╝@
 ╚████╔╝ @
  ╚═══╝  @
         @@
██╗    ██╗@
██║    ██║@
██║ █╗ ██║@
██║███╗██║@
╚███╔███╔╝@
 ╚══╝╚══╝ @
          @@
██╗  ██╗@
╚██╗██╔╝@
 ╚███╔╝ @
 ██╔██╗ @
██╔╝ ██╗@
╚═╝  ╚═╝@
        @@
██╗   ██╗@
╚██╗ ██╔╝@
 ╚████╔╝ @
  ╚██╔╝  @
   ██║   @
   ╚═╝   @
         @@
███████╗@
╚══███╔╝@
  ███╔╝ @
 ███╔╝  @
███████╗@
╚══════╝@
        @@
███╗@
██╔╝@
██║ @
██║ @
███╗@
╚══╝@
    @@
@
@
@
@
@
@
@@
███╗@
╚██║@
 ██║@
 ██║@
███║@
╚══╝@
    @@
 ███╗ @
██╔██╗@
╚═╝╚═╝@
      @
      @
      @
      @@
        @
        @
        @
        @
███████╗@
╚══════╝@
        @@
@
@
@
@
@
@
@@
 █████╗ @
██╔══██╗@
███████║@
██╔══██║@
██║  ██║@
╚═╝  ╚═╝@
        @@
██████╗ @
██╔══██╗@
██████╔╝@
██╔══██╗@
██████╔╝@
╚═════╝ @
        @@
 ██████╗@
██╔════╝@
██║     @
██║     @
╚██████╗@
 ╚═════╝@
        @@
██████╗ @
██╔══██╗@
██║  ██║@
██║  ██║@
██████╔╝@
╚═════╝ @
        @@
███████╗@
██╔════╝@
█████╗  @
██╔══╝  @
███████╗@
╚══════╝@
        @@
███████╗@
██╔════╝@
█████╗  @
██╔══╝  @
██║     @
╚═╝     @
        @@
 ██████╗ @
██╔════╝ @
██║  ███╗@
██║   ██║@
╚██████╔╝@
 ╚═════╝ @
         @@
██╗  ██╗@
██║  ██║@
███████║@
██╔══██║@
██║  ██║@
╚═╝  ╚═╝@
        @@
██╗@
██║@
██║@
██║@
██║@
╚═╝@
   @@
     ██╗@
     ██║@
     ██║@
██   ██║@
╚█████╔╝@
 ╚════╝ @
        @@
██╗  ██╗@
██║ ██╔╝@
█████╔╝ @
██╔═██╗ @
██║  ██╗@
╚═╝  ╚═╝@
        @@
██╗     @
██║     @
██║     @
██║     @
███████╗@
╚══════╝@
        @@
███╗   ███╗@
████╗ ████║@
██╔████╔██║@
██║╚██╔╝██║@
██║ ╚═╝ ██║@
╚═╝     ╚═╝@
           @@
███╗   ██╗@
████╗  ██║@
██╔██╗ ██║@
██║╚██╗██║@
██║ ╚████║@
╚═╝  ╚═══╝@
          @@
 ██████╗ @
██╔═══██╗@
██║   ██║@
██║   ██║@
╚██████╔╝@
 ╚═════╝ @
         @@
██████╗ @
██╔══██╗@
██████╔╝@
██╔═══╝ @
██║     @
╚═╝     @
        @@
 ██████╗ @
██╔═══██╗@
██║   ██║@
██║▄▄ ██║@
╚██████╔╝@
 ╚══▀▀═╝ @
         @@
██████╗ @
██╔══██╗@
██████╔╝@
██╔══██╗@
██║  ██║@
╚═╝  ╚═╝@
        @@
███████╗@
██╔════╝@
███████╗@
╚════██║@
███████║@
╚══════╝@
        @@
████████╗@
╚══██╔══╝@
   ██║   @
   ██║   @
   ██║   @
   ╚═╝   @
         @@
██╗   ██╗@
██║   ██║@
██║   ██║@
██║   ██║@
╚██████╔╝@
 ╚═════╝ @
         @@
██╗   ██╗@
██║   ██║@
██║   ██║@
╚██╗ ██╔╝@
 ╚████╔╝ @
  ╚═══╝  @
         @@
██╗    ██╗@
██║    ██║@
██║ █╗ ██║@
██║███╗██║@
╚███╔███╔╝@
 ╚══╝╚══╝ @
          @@
██╗  ██╗@
╚██╗██╔╝@
 ╚███╔╝ @
 ██╔██╗ @
██╔╝ ██╗@
╚═╝  ╚═╝@
        @@
██╗   ██╗@
╚██╗ ██╔╝@
 ╚████╔╝ @
  ╚██╔╝  @
   ██║   @
   ╚═╝   @
         @@
███████╗@
╚══███╔╝@
  ███╔╝ @
 ███╔╝  @
███████╗@
╚══════╝@
        @@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@@`,Rt=`sidebar width=20 align=left {
  box valign=center padding=1 margin=1 background=dim(0.15) {
    menu bind=currentBg {
      - fire
      - fireworks
      - fireworks 2
      - ink
      - lightning
      - mountains
      - parkour
      - rainbow
      - ocean
      - ember
    }
  }
}

{#if scene == "title"}
  box align=center valign=center padding=2 margin=2 background=dim(0.25) {
    # CHARCOAL

    ---

    A text UI framework for canvas.
    Everything is characters on a grid.

    row gap=4 align=center {
      [* credits *](-> goToCredits)
      [* syntax *](-> goToSyntax)
    }
  }
{/if}

{#if scene == "credits"}
  box align=center valign=center width=52 padding=2 background=dim(0.15) {
    ## Credits

    ---

    Charcoal is built on top of pretext,
    a text layout library by Cheng Lou
    that measures and positions text
    without DOM queries.

    pretext handles the hard parts:
    character width measurement,
    line breaking, and text shaping,
    letting charcoal focus on the
    grid-to-canvas rendering pipeline.

    github.com/chenglou/pretext

    ---

    Made with figlet for ASCII art
    headings and Baloo 2 for that
    thick character density.

    [* back *](-> goToTitle)
  }
{/if}

{#if scene == "syntax"}
  box align=center valign=center width=56 padding=2 background=dim(0.15) {
    ## .coal Syntax Reference

    ---

    scroll height=20 {
      ### Headings
      Use one hash for large figlet titles,
      two for bold section heads,
      three for smaller bold text.

      # Big

      ---

      ### Text
      Wrap words in double stars for
      **bold**, single stars for *dim*,
      and backticks for \`code\`.

      ---

      ### Boxes & Containers

      box border=single padding=1 {
        border=single draws a frame.
        Add padding, margin, width.
      }

      box background=dim(0.3) padding=1 {
        background=dim(n) creates
        a transparent overlay at
        the given opacity level.
      }

      ---

      ### Buttons

      [* like this one *](-> goToTitle)

      Syntax: [label](-> action)
      The app handles the action.

      ---

      ### Layout

      row gap=2 {
        box padding=1 background=dim(0.2) {
          row splits
        }
        box padding=1 background=dim(0.2) {
          horizontally
        }
      }

      Use align=center, valign=center
      for positioning within parents.

      ---

      ### Menus

      Menus bind to state. Clicking
      an item sets the bound key.

      ---

      ### Conditionals

      Show or hide blocks based on
      app state. Scenes, modals,
      and tabs are all built this way.

      ---

      ### Scroll

      This pane is a scroll block!
      Set height=N to clip content
      and enable wheel scrolling.
    }

    [* back *](-> goToTitle)
  }
{/if}
`;w(`ANSI Shadow`,Lt),T(`ANSI Shadow`);var zt={fire:`./13717343_2048_1080_30fps.mp4`,fireworks:`./fireworks.mp4`,"fireworks 2":`./fireworks_2.mp4`,ink:`./ink_2.mp4`,lightning:`./lightning.mp4`,mountains:`./mountains.mp4`,parkour:`./parkour.mp4`},Bt=document.getElementById(`canvas`);document.fonts.ready.then(()=>{let e=It(Rt,Bt,{background:jt(zt.fire,{mode:`cover`}),fontSize:14,fontFamily:`"Baloo 2", cursive`});e.state.set(`scene`,`title`),e.state.set(`currentBg`,`fire`),e.on(`goToCredits`,()=>e.state.set(`scene`,`credits`)),e.on(`goToSyntax`,()=>e.state.set(`scene`,`syntax`)),e.on(`goToTitle`,()=>e.state.set(`scene`,`title`)),e.on(`backdrop-click`,()=>{e.state.get(`scene`)!==`title`&&e.state.set(`scene`,`title`)});let t={rainbow:()=>$(`rainbow`),ocean:()=>$(`linear`,{from:`#003366`,to:`#00ccff`,angle:45}),ember:()=>$(`linear`,{from:`#330000`,to:`#ff4400`,angle:90})};e.state.watch(`currentBg`,n=>{let r=zt[n];if(r)e.setBackground(jt(r,{mode:`cover`}));else{let r=t[n];r&&e.setBackground(r())}}),e.start()});