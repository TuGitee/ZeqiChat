(self["webpackChunkchat"]=self["webpackChunkchat"]||[]).push([[945],{7945:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return S}});var a=function(){var e=this,t=e._self._c;return t("div",{staticClass:"register"},[e.isMobile?e._e():t("angry-face",{ref:"face"}),t("div",{staticClass:"register-box"},[t("h1",{staticClass:"register-box-title no-select"},[e._v("注册")]),t("p",{staticClass:"has-account no-select"},[t("i",{staticClass:"el-icon-warning-outline"}),e._v(" 已有账号? "),t("a",{attrs:{href:"javascript:void(0);"},on:{click:function(t){return e.$emit("changeChoice")}}},[e._v("点我登录")])]),t("el-form",{ref:"Form",attrs:{"label-position":"left","label-width":"max-content",model:e.form,rules:e.rules,"show-message":!1},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.register.apply(null,arguments)}}},[t("el-form-item",{staticClass:"top",attrs:{prop:"email"}},[t("el-input",{attrs:{type:"email",placeholder:"请输入邮箱"},model:{value:e.form.email,callback:function(t){e.$set(e.form,"email",t)},expression:"form.email"}})],1),t("el-form-item",{attrs:{prop:"captcha"}},[t("el-input",{attrs:{placeholder:"请输入验证码"},model:{value:e.form.captcha,callback:function(t){e.$set(e.form,"captcha",t)},expression:"form.captcha"}},[t("el-button",{attrs:{slot:"append",disabled:e.seconds>=0},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.getCaptcha.apply(null,arguments)}},slot:"append"},[e._v(e._s(e.seconds>=0?`重新发送(${e.seconds}s)`:"获取验证码"))])],1)],1),t("el-form-item",{staticClass:"top",attrs:{prop:"username"}},[t("el-input",{attrs:{placeholder:"请输入用户名",autocomplete:"off"},model:{value:e.form.username,callback:function(t){e.$set(e.form,"username",t)},expression:"form.username"}})],1),t("el-form-item",{attrs:{prop:"password"}},[t("el-input",{attrs:{"show-password":"",placeholder:"请输入密码"},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1),t("el-form-item",{attrs:{prop:"repassword"}},[t("el-input",{attrs:{"show-password":"",placeholder:"请再次输入密码"},model:{value:e.form.repassword,callback:function(t){e.$set(e.form,"repassword",t)},expression:"form.repassword"}})],1),t("el-form-item",{staticClass:"top",attrs:{prop:"avatar"}},[t("el-upload",{ref:"upload",staticClass:"avatar-uploader",attrs:{action:"#","on-change":e.handleAvatarChange,"on-exceed":e.handleAvatarExceed,"show-file-list":!1,limit:1,accept:"image/*",name:"image","auto-upload":!1}},[t("img",{staticClass:"avatar",attrs:{src:e.avatarURL}}),t("p",{staticClass:"el-upload__tip no-select",attrs:{slot:"tip"},slot:"tip"},[e._v("上传头像")])])],1),t("el-form-item",{staticStyle:{"margin-bottom":"0px"},attrs:{prop:"protocol",required:""}},[t("el-checkbox",{attrs:{label:"protocol"},model:{value:e.form.protocol,callback:function(t){e.$set(e.form,"protocol",t)},expression:"form.protocol"}},[e._v("您已阅读并同意"),t("a",{attrs:{href:"https://tugitee.github.io/ZeqiChat/protocol",target:"_blank"}},[e._v("择栖Chat服务协议")])])],1),t("el-form-item",[t("el-button",{staticClass:"form-button",attrs:{type:"primary",id:"register"},on:{click:e.register}},[e._v("注册")])],1)],1)],1)],1)},o=[],s=r(4359),n=r.n(s),i=r(5583),l=r.n(i),u=r(9371),c=r.n(u),p=r(8787),m=r.n(p),f=r(1168),d=r.n(f),g=r(1540),h=r.n(g),b=r(8319),y=r.n(b),v=r(5981),w=r.n(v),x=r(3822),j={name:"Register",data(){return{form:{email:"",username:"",password:"",repassword:"",captcha:"",avatar:null,protocol:["protocol"]},rules:{email:[{required:!0,message:"请输入邮箱",trigger:"blur"},{type:"email",message:"请输入正确的邮箱地址",trigger:["blur","change"]}],username:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:3,max:20,message:"长度在 3 到 20 个字符",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,max:20,message:"长度在 6 到 20 个字符",trigger:"blur"}],repassword:[{required:!0,message:"请再次输入密码",trigger:"blur"},{min:6,max:20,message:"长度在 6 到 20 个字符",trigger:"blur"}],captcha:[{required:!0,message:"请输入验证码",trigger:"blur"},{min:6,max:6,message:"请输入6位验证码",trigger:["blur","change"]}],protocol:[{type:"array",required:!0,message:"请勾选同意协议",trigger:"change"}]},seconds:-1,timer:null,isAnger:!1}},methods:{getCaptcha(){const e=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;if(!e.test(this.form.email))return this.$notify.warning({title:"警告",message:"邮箱格式不正确",offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))}),void this.$refs.face.handleError();this.seconds=60,this.timer=setInterval((()=>{this.seconds<0?clearInterval(this.timer):this.seconds--}),1e3),this.$axios.post("/api/captcha",{email:this.form.email}).catch((e=>{console.log(e),this.$refs.face.handleError()}))},register(){this.$refs.Form.validate(((e,t)=>{if(!e)return this.$notify.warning({title:"警告",dangerouslyUseHTMLString:!0,message:"<li>"+Object.entries(t).map((e=>{let[t,r]=e;return r.map((e=>e.message)).join(", ")})).join("</li><li>")+"</li>",offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))}),void this.$refs.face.handleError();{const e=new FormData;e.append("email",this.form.email),e.append("username",this.form.username),e.append("password",this.form.password),e.append("repassword",this.form.repassword),e.append("captcha",this.form.captcha),e.append("avatar",this.form.avatar),this.$axios.post("/api/user",e,{headers:{"Content-Type":"multipart/form-data"}}).then((e=>{1===e.data.ok?(this.$notify.success({title:"成功",message:"注册成功",offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))}),this.$emit("changeChoice")):(this.$notify.error({title:"出错",message:e.data.msg,offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))}),this.$refs.face.handleError())})).catch((e=>{console.log(e),this.$refs.face.handleError()}))}}))},handleAvatarChange(e,t){this.form.avatar=t[0].raw},handleAvatarExceed(e,t){t.splice(0,1,{uid:+new Date,name:e[0].name,raw:e[0]}),this.form.avatar=e[0]}},components:{[w().name]:w(),[y().name]:y(),[h().name]:h(),[d().name]:d(),[m().name]:m(),[c().name]:c(),[l().name]:l(),[n().name]:n(),AngryFace:()=>r.e(107).then(r.bind(r,2107))},computed:{...(0,x.rn)({isMobile:e=>e.mobile.isMobile}),avatarURL(){return this.form.avatar?URL.createObjectURL(this.form.avatar):"https://zeqichat.xyz/images/default_avatar.png"}}},C=j,_=r(1001),$=(0,_.Z)(C,a,o,!1,null,"19b9848f",null),S=$.exports},5583:function(e,t,r){r(7658),e.exports=function(e){var t={};function r(a){if(t[a])return t[a].exports;var o=t[a]={i:a,l:!1,exports:{}};return e[a].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(a,o,function(t){return e[t]}.bind(null,o));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/dist/",r(r.s=140)}({140:function(e,t,r){"use strict";r.r(t);var a="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o={name:"ElCol",props:{span:{type:Number,default:24},tag:{type:String,default:"div"},offset:Number,pull:Number,push:Number,xs:[Number,Object],sm:[Number,Object],md:[Number,Object],lg:[Number,Object],xl:[Number,Object]},computed:{gutter:function(){var e=this.$parent;while(e&&"ElRow"!==e.$options.componentName)e=e.$parent;return e?e.gutter:0}},render:function(e){var t=this,r=[],o={};return this.gutter&&(o.paddingLeft=this.gutter/2+"px",o.paddingRight=o.paddingLeft),["span","offset","pull","push"].forEach((function(e){(t[e]||0===t[e])&&r.push("span"!==e?"el-col-"+e+"-"+t[e]:"el-col-"+t[e])})),["xs","sm","md","lg","xl"].forEach((function(e){if("number"===typeof t[e])r.push("el-col-"+e+"-"+t[e]);else if("object"===a(t[e])){var o=t[e];Object.keys(o).forEach((function(t){r.push("span"!==t?"el-col-"+e+"-"+t+"-"+o[t]:"el-col-"+e+"-"+o[t])}))}})),e(this.tag,{class:["el-col",r],style:o},this.$slots.default)},install:function(e){e.component(o.name,o)}};t["default"]=o}})},9371:function(e){e.exports=function(e){var t={};function r(a){if(t[a])return t[a].exports;var o=t[a]={i:a,l:!1,exports:{}};return e[a].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(a,o,function(t){return e[t]}.bind(null,o));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/dist/",r(r.s=139)}({139:function(e,t,r){"use strict";r.r(t);var a={name:"ElRow",componentName:"ElRow",props:{tag:{type:String,default:"div"},gutter:Number,type:String,justify:{type:String,default:"start"},align:String},computed:{style:function(){var e={};return this.gutter&&(e.marginLeft="-"+this.gutter/2+"px",e.marginRight=e.marginLeft),e}},render:function(e){return e(this.tag,{class:["el-row","start"!==this.justify?"is-justify-"+this.justify:"",this.align?"is-align-"+this.align:"",{"el-row--flex":"flex"===this.type}],style:this.style},this.$slots.default)},install:function(e){e.component(a.name,a)}};t["default"]=a}})}}]);