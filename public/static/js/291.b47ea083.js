"use strict";(self["webpackChunkchat"]=self["webpackChunkchat"]||[]).push([[291],{4291:function(t,e,n){n.r(e),n.d(e,{default:function(){return c}});var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"net"},[e("div",{staticClass:"net-type"},[t._v("Type:"+t._s(t.netInfo.rtt<=0?"无网络":t.netInfo.effectiveType))]),e("div",{staticClass:"net-rtt"},[t._v("RTT:"+t._s(t.netInfo.rtt))]),e("div",{staticClass:"net-status"},[e("div",{staticClass:"net-status-strength"},t._l(3,(function(n){return e("div",{key:n,staticClass:"net-status-strength-bar",style:{height:33*n+"%",backgroundColor:t.strength>=n?t.strengthColor:""}})})),0)])])},r=[],i={name:"Net",data(){return{netInfo:{rtt:0,effectiveType:""}}},computed:{strength(){return this.netInfo.rtt<=0?0:this.netInfo.rtt<=150?3:this.netInfo.rtt<=550?2:1},strengthColor(){return 3==this.strength?"#0edb0e":2==this.strength?"#ff7f00":1==this.strength?"#ff0000":"transparent"}},mounted(){const t=navigator.connection||navigator.mozConnection||navigator.webkitConnection;t.addEventListener("change",(t=>{this.netInfo.effectiveType=t.target.effectiveType,this.netInfo.rtt=t.target.rtt})),this.netInfo.effectiveType=t.effectiveType,this.netInfo.rtt=t.rtt}},a=i,f=n(1001),o=(0,f.Z)(a,s,r,!1,null,"019464bf",null),c=o.exports}}]);