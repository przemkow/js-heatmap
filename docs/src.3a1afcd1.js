parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"dIX1":[function(require,module,exports) {
"use strict";function e(e){var a=Array.from({length:e.y},function(t,a){return Array.from({length:e.x},function(e,t){return{value:0}})}),n=function(e,t){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=a.length-1,c=a[0].length-1,o=Math.max(0,e-n);o<=Math.min(e+n,r);o++)for(var l=Math.max(0,t-n);l<=Math.min(t+n,c);l++)o===e&&l===t||(a[o][l].value+=2*(n-Math.max(Math.abs(l-t),Math.abs(o-e))))},r=document.getElementById("app");r.innerHTML="";var c=document.createElement("div");c.classList.add("heatmap"),a.forEach(function(r,o){var l,d=((l=document.createElement("div")).classList.add("row"),l);r.forEach(function(r,c){var l,u,i,s;d.appendChild((l=o,u=c,(s=document.createElement("div")).classList.add("cell"),e.showValues&&(i=document.createTextNode(a[l][u].value),s.appendChild(i)),s.style.backgroundColor=t(a[l][u].value),a[l][u]=new Proxy(a[l][u],{set:function(a,n,r){if(s.style.backgroundColor=t(r),e.showValues){var c=document.createTextNode(r);s.replaceChild(c,i),i=c}return Reflect.set.apply(Reflect,arguments)}}),s.addEventListener("mouseenter",function(){a[l][u].value+=e.hoverIncrease,n(l,u,e.hoverRadius)}),s.addEventListener("click",function(){a[l][u].value+=e.clickIncrease,n(l,u,e.clickRadius)}),s))}),c.appendChild(d)}),r.appendChild(c)}function t(e){return"hsl(".concat(240*(1-(e=e>130?130:e)/100),", 100%, 50%)")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.renderHeatMap=e;
},{}],"H99C":[function(require,module,exports) {
"use strict";var e=require("./heatmap");document.getElementById("updateConfig").addEventListener("submit",function(t){t.preventDefault();var n={x:parseInt(document.getElementById("size-x").value),y:parseInt(document.getElementById("size-y").value),hoverIncrease:parseInt(document.getElementById("hover-increase").value),hoverRadius:parseInt(document.getElementById("hover-radius").value),clickIncrease:parseInt(document.getElementById("click-increase").value),clickRadius:parseInt(document.getElementById("click-radius").value),showValues:document.getElementById("show-values").checked};(0,e.renderHeatMap)(n)});var t=document.createElement("style");document.body.appendChild(t),document.getElementById("square-size").addEventListener("input",function(e){var n=e.target.value,a=document.createElement("style");a.innerHTML=".cell {width: ".concat(n,"px; height: ").concat(n,"px; line-height: ").concat(n,"px; font-size: ").concat(n/1.2,"px"),document.body.replaceChild(a,t),t=a});
},{"./heatmap":"dIX1"}]},{},["H99C"], null)
//# sourceMappingURL=/src.3a1afcd1.js.map