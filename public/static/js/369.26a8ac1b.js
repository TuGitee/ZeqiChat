(self["webpackChunkchat"]=self["webpackChunkchat"]||[]).push([[369],{4369:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return g}});var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"box",on:{scroll:t.scroll}},[e("div",{staticClass:"info"},[e("div",{staticClass:"info-header",style:{background:t.userInfo.background?`url('https://zeqichat.xyz${t.userInfo.background}')  no-repeat center/cover`:`url(${n(5878)}) no-repeat center/cover`}},[e("div",{staticClass:"info-header-avatar"},[t.userInfo.avatar?e("img",{attrs:{src:`https://zeqichat.xyz${t.userInfo.avatar}`,alt:""},on:{contextmenu:function(e){return e.preventDefault(),e.stopPropagation(),t.handleContextMenu.apply(null,arguments)}}}):t._e(),e("span",{staticStyle:{"mix-blend-mode":"difference",color:"white"}},[t._v(t._s(t.userInfo.username))])]),t.id==t.userId||t.id==t.WORLD_ID?e("div",{staticClass:"info-header-info"},[e("router-link",{attrs:{to:"/home/post"}},[e("button",{staticClass:"info-header-info-post"},[e("i",{staticClass:"el-icon-edit"}),t._v("  动态")])])],1):t._e(),t.id==t.userId?e("div",{staticClass:"info-header-bg"},[t._m(0),e("input",{staticStyle:{display:"none"},attrs:{type:"file",id:"upload",accept:"image/*"},on:{change:t.fileChange}})]):e("div",{staticClass:"info-header-back"},[e("router-link",{attrs:{to:`/home/blog/${this.userId}`}},[e("button",{staticClass:"info-header-info-back"},[e("i",{staticClass:"el-icon-s-home"}),t._v("个人主页 ")])])],1),t.id==t.userId?e("div",{staticClass:"info-header-world"},[e("button",{staticClass:"info-header-info-world"},[e("router-link",{attrs:{to:`/home/blog/${t.WORLD_ID}`}},[e("i",{staticClass:"el-icon-s-promotion"}),t._v(" 推荐 ")])],1),e("input",{staticStyle:{display:"none"},attrs:{type:"file",id:"upload",accept:"image/*"},on:{change:t.fileChange}})]):t._e()])]),t._l(t.blogs,(function(n){return e("BlogItem",{key:n.blog_id,attrs:{blog:n},on:{deleteBlog:t.deleteBlog,commentBlog:t.commentBlog}})})),t.isRequest?e("div",{staticClass:"loading"},[e("i",{staticClass:"el-icon-loading"}),t._v(" "),e("span",[t._v("正在加载中...")])]):t._e(),!t.blogs.length&&t.blogEnd?e("div",{staticClass:"zero"},[e("el-empty",{attrs:{description:"暂无动态"}}),e("br"),t.id===t.userId?e("router-link",{attrs:{to:"/home/post"}},[e("i",{staticClass:"el-icon-thumb"}),t._v(" "),e("span",[t._v("快去发表动态吧")])]):t._e()],1):t._e(),t.blogEnd&&t.blogs.length?e("div",{staticClass:"end"},[e("i",{staticClass:"el-icon-s-promotion"}),t._v(" "),e("span",[t._v("已经到底了...")])]):t._e()],2)},o=[function(){var t=this,e=t._self._c;return e("button",{staticClass:"info-header-info-bg"},[e("label",{attrs:{for:"upload"}},[e("i",{staticClass:"el-icon-picture"})])])}],s=n(2244),a=n.n(s),r=n(9629),l=n.n(r),d=(n(7658),n(541),n(3822)),c=n(7768),u={name:"Blog",components:{BlogItem:()=>Promise.all([n.e(979),n.e(680)]).then(n.bind(n,9680)),[l().name]:l(),[a().name]:a()},data(){return{blogs:[],pageNo:0,pageDelta:0,isRequest:!1,blogEnd:!1,pageSize:2,userInfo:{},controller:null,file:null,WORLD_ID:c.F}},methods:{getRequestBlog(){this.isRequest||this.blogEnd||(this.isRequest=!0,this.$axios.get(`/api/blog?pageNo=${this.pageNo}&pageDelta=${this.pageDelta}&pageSize=${this.pageSize}${this.id==this.WORLD_ID?"":`&userId=${this.id}`}`,{signal:this.controller.signal}).then((t=>{if(!t.data.ok)return this.isRequest=!1,void(this.blogEnd=!0);this.blogs.push(...t.data.msg.reverse()),this.pageNo++,this.isRequest=!1,t.data.msg.length<this.pageSize&&(this.blogEnd=!0)})).catch((t=>{})))},deleteBlog(t){const e=this.blogs.findIndex((e=>e.blog_id===t));this.blogs.splice(e,1)},commentBlog(t,e){this.blogs.find((e=>e.blog_id===t)).commentList.unshift({username:this.username,avatar:this.avatar,msg:e,create_time:new Date})},scroll(t){t.target.scrollTop+t.target.clientHeight+100>=t.target.scrollHeight&&this.getRequestBlog()},init(){this.controller?.abort(),this.controller=new AbortController,this.$axios.get(`/api/user/${this.id}`,{signal:this.controller.signal}).then((t=>{this.userInfo=t.data.ok?t.data.data:{avatar:"/images/world.jpg",username:"推荐",id:this.WORLD_ID}})),this.blogs=[],this.pageNo=0,this.pageDelta=0,this.isRequest=!1,this.blogEnd=!1,this.getRequestBlog(),setTimeout((()=>{this.getRequestBlog()}),500)},fileChange(t){this.file=t.target.files[0];const e=new FormData;e.append("image",this.file),this.$axios.post("/api/image",e,{headers:{"Content-Type":"multipart/form-data"}}).then((t=>{t.data.ok?(this.userInfo.background=t.data.image,this.$axios.post("/api/user/background",{background:t.data.image,id:this.userId}).then((t=>{t.data.ok?this.$notify.success({title:"成功",message:"上传背景成功!",offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))}):this.$notify.error({title:"失败",message:"上传背景失败!",offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))})}))):this.$notify.error({title:"失败",message:"上传背景失败!",offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))})}))},handleContextMenu(t){this.$store.commit("SET_STATE",{x:t.clientX,y:t.clientY,menuList:[{label:"私聊",command:"chat",id:this.userInfo.id,icon:"el-icon-chat-dot-square"}],isShow:!0})}},computed:{...(0,d.rn)({avatar:t=>t.user.avatar,username:t=>t.user.username,userId:t=>t.user.userId}),id(){return this.$route.params.id}},beforeDestroy(){this.controller?.abort()},created(){this.init()},watch:{blogs(t){const e=/!\[(.+?)\]\((.+?)\)/g;t.forEach((t=>{t.content=t.content.replace(e,((e,n,i)=>`<img src="${i}" alt="${n}" preview="${t.blog_id}"/>`))})),this.$nextTick((()=>{this.$previewRefresh()}))}}},p=u,f=n(1001),h=(0,f.Z)(p,i,o,!1,null,"593bb5c0",null),g=h.exports},2244:function(t,e,n){t.exports=function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=82)}({0:function(t,e,n){"use strict";function i(t,e,n,i,o,s,a,r){var l,d="function"===typeof t?t.options:t;if(e&&(d.render=e,d.staticRenderFns=n,d._compiled=!0),i&&(d.functional=!0),s&&(d._scopeId="data-v-"+s),a?(l=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"===typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),o&&o.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},d._ssrRegister=l):o&&(l=r?function(){o.call(this,this.$root.$options.shadowRoot)}:o),l)if(d.functional){d._injectStyles=l;var c=d.render;d.render=function(t,e){return l.call(e),c(t,e)}}else{var u=d.beforeCreate;d.beforeCreate=u?[].concat(u,l):[l]}return{exports:t,options:d}}n.d(e,"a",(function(){return i}))},11:function(t,e){t.exports=n(4511)},13:function(t,e){t.exports=n(3630)},4:function(t,e){t.exports=n(8816)},82:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"dialog-fade"},on:{"after-enter":t.afterEnter,"after-leave":t.afterLeave}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.visible,expression:"visible"}],staticClass:"el-dialog__wrapper",on:{click:function(e){return e.target!==e.currentTarget?null:t.handleWrapperClick(e)}}},[n("div",{key:t.key,ref:"dialog",class:["el-dialog",{"is-fullscreen":t.fullscreen,"el-dialog--center":t.center},t.customClass],style:t.style,attrs:{role:"dialog","aria-modal":"true","aria-label":t.title||"dialog"}},[n("div",{staticClass:"el-dialog__header"},[t._t("title",[n("span",{staticClass:"el-dialog__title"},[t._v(t._s(t.title))])]),t.showClose?n("button",{staticClass:"el-dialog__headerbtn",attrs:{type:"button","aria-label":"Close"},on:{click:t.handleClose}},[n("i",{staticClass:"el-dialog__close el-icon el-icon-close"})]):t._e()],2),t.rendered?n("div",{staticClass:"el-dialog__body"},[t._t("default")],2):t._e(),t.$slots.footer?n("div",{staticClass:"el-dialog__footer"},[t._t("footer")],2):t._e()])])])},o=[];i._withStripped=!0;var s=n(13),a=n.n(s),r=n(11),l=n.n(r),d=n(4),c=n.n(d),u={name:"ElDialog",mixins:[a.a,c.a,l.a],props:{title:{type:String,default:""},modal:{type:Boolean,default:!0},modalAppendToBody:{type:Boolean,default:!0},appendToBody:{type:Boolean,default:!1},lockScroll:{type:Boolean,default:!0},closeOnClickModal:{type:Boolean,default:!0},closeOnPressEscape:{type:Boolean,default:!0},showClose:{type:Boolean,default:!0},width:String,fullscreen:Boolean,customClass:{type:String,default:""},top:{type:String,default:"15vh"},beforeClose:Function,center:{type:Boolean,default:!1},destroyOnClose:Boolean},data:function(){return{closed:!1,key:0}},watch:{visible:function(t){var e=this;t?(this.closed=!1,this.$emit("open"),this.$el.addEventListener("scroll",this.updatePopper),this.$nextTick((function(){e.$refs.dialog.scrollTop=0})),this.appendToBody&&document.body.appendChild(this.$el)):(this.$el.removeEventListener("scroll",this.updatePopper),this.closed||this.$emit("close"),this.destroyOnClose&&this.$nextTick((function(){e.key++})))}},computed:{style:function(){var t={};return this.fullscreen||(t.marginTop=this.top,this.width&&(t.width=this.width)),t}},methods:{getMigratingConfig:function(){return{props:{size:"size is removed."}}},handleWrapperClick:function(){this.closeOnClickModal&&this.handleClose()},handleClose:function(){"function"===typeof this.beforeClose?this.beforeClose(this.hide):this.hide()},hide:function(t){!1!==t&&(this.$emit("update:visible",!1),this.$emit("close"),this.closed=!0)},updatePopper:function(){this.broadcast("ElSelectDropdown","updatePopper"),this.broadcast("ElDropdownMenu","updatePopper")},afterEnter:function(){this.$emit("opened")},afterLeave:function(){this.$emit("closed")}},mounted:function(){this.visible&&(this.rendered=!0,this.open(),this.appendToBody&&document.body.appendChild(this.$el))},destroyed:function(){this.appendToBody&&this.$el&&this.$el.parentNode&&this.$el.parentNode.removeChild(this.$el)}},p=u,f=n(0),h=Object(f["a"])(p,i,o,!1,null,null,null);h.options.__file="packages/dialog/src/component.vue";var g=h.exports;g.install=function(t){t.component(g.name,g)};e["default"]=g}})},9629:function(t,e,n){t.exports=function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=69)}({0:function(t,e,n){"use strict";function i(t,e,n,i,o,s,a,r){var l,d="function"===typeof t?t.options:t;if(e&&(d.render=e,d.staticRenderFns=n,d._compiled=!0),i&&(d.functional=!0),s&&(d._scopeId="data-v-"+s),a?(l=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"===typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),o&&o.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},d._ssrRegister=l):o&&(l=r?function(){o.call(this,this.$root.$options.shadowRoot)}:o),l)if(d.functional){d._injectStyles=l;var c=d.render;d.render=function(t,e){return l.call(e),c(t,e)}}else{var u=d.beforeCreate;d.beforeCreate=u?[].concat(u,l):[l]}return{exports:t,options:d}}n.d(e,"a",(function(){return i}))},20:function(t,e){t.exports=n(4582)},69:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"el-empty"},[n("div",{staticClass:"el-empty__image",style:t.imageStyle},[t.image?n("img",{attrs:{src:t.image,ondragstart:"return false"}}):t._t("image",[n("img-empty")])],2),n("div",{staticClass:"el-empty__description"},[t.$slots.description?t._t("description"):n("p",[t._v(t._s(t.emptyDescription))])],2),t.$slots.default?n("div",{staticClass:"el-empty__bottom"},[t._t("default")],2):t._e()])},o=[];i._withStripped=!0;var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("svg",{attrs:{viewBox:"0 0 79 86",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}},[n("defs",[n("linearGradient",{attrs:{id:"linearGradient-1-"+t.id,x1:"38.8503086%",y1:"0%",x2:"61.1496914%",y2:"100%"}},[n("stop",{attrs:{"stop-color":"#FCFCFD",offset:"0%"}}),n("stop",{attrs:{"stop-color":"#EEEFF3",offset:"100%"}})],1),n("linearGradient",{attrs:{id:"linearGradient-2-"+t.id,x1:"0%",y1:"9.5%",x2:"100%",y2:"90.5%"}},[n("stop",{attrs:{"stop-color":"#FCFCFD",offset:"0%"}}),n("stop",{attrs:{"stop-color":"#E9EBEF",offset:"100%"}})],1),n("rect",{attrs:{id:"path-3-"+t.id,x:"0",y:"0",width:"17",height:"36"}})],1),n("g",{attrs:{id:"Illustrations",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"}},[n("g",{attrs:{id:"B-type",transform:"translate(-1268.000000, -535.000000)"}},[n("g",{attrs:{id:"Group-2",transform:"translate(1268.000000, 535.000000)"}},[n("path",{attrs:{id:"Oval-Copy-2",d:"M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z",fill:"#F7F8FC"}}),n("polygon",{attrs:{id:"Rectangle-Copy-14",fill:"#E5E7E9",transform:"translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) ",points:"13 58 53 58 42 45 2 45"}}),n("g",{attrs:{id:"Group-Copy",transform:"translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)"}},[n("polygon",{attrs:{id:"Rectangle-Copy-10",fill:"#E5E7E9",transform:"translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) ",points:"2.84078316e-14 3 18 3 23 7 5 7"}}),n("polygon",{attrs:{id:"Rectangle-Copy-11",fill:"#EDEEF2",points:"-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"}}),n("rect",{attrs:{id:"Rectangle-Copy-12",fill:"url(#linearGradient-1-"+t.id+")",transform:"translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) ",x:"38",y:"7",width:"17",height:"36"}}),n("polygon",{attrs:{id:"Rectangle-Copy-13",fill:"#F8F9FB",transform:"translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) ",points:"24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"}})]),n("rect",{attrs:{id:"Rectangle-Copy-15",fill:"url(#linearGradient-2-"+t.id+")",x:"13",y:"45",width:"40",height:"36"}}),n("g",{attrs:{id:"Rectangle-Copy-17",transform:"translate(53.000000, 45.000000)"}},[n("mask",{attrs:{id:"mask-4-"+t.id,fill:"white"}},[n("use",{attrs:{"xlink:href":"#path-3-"+t.id}})]),n("use",{attrs:{id:"Mask",fill:"#E0E3E9",transform:"translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) ","xlink:href":"#path-3-"+t.id}}),n("polygon",{attrs:{id:"Rectangle-Copy",fill:"#D5D7DE",mask:"url(#mask-4-"+t.id+")",transform:"translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) ",points:"7 0 24 0 20 18 -1.70530257e-13 16"}})]),n("polygon",{attrs:{id:"Rectangle-Copy-18",fill:"#F8F9FB",transform:"translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) ",points:"62 45 79 45 70 58 53 58"}})])])])])},a=[];s._withStripped=!0;var r=0,l={name:"ImgEmpty",data:function(){return{id:++r}}},d=l,c=n(0),u=Object(c["a"])(d,s,a,!1,null,null,null);u.options.__file="packages/empty/src/img-empty.vue";var p,f=u.exports,h=n(20),g={name:"ElEmpty",components:(p={},p[f.name]=f,p),props:{image:{type:String,default:""},imageSize:Number,description:{type:String,default:""}},computed:{emptyDescription:function(){return this.description||Object(h["t"])("el.empty.description")},imageStyle:function(){return{width:this.imageSize?this.imageSize+"px":""}}}},m=g,_=Object(c["a"])(m,i,o,!1,null,null,null);_.options.__file="packages/empty/src/index.vue";var y=_.exports;y.install=function(t){t.component(y.name,y)};e["default"]=y}})},7768:function(t,e,n){"use strict";n.d(e,{B:function(){return i},F:function(){return o}});const i={Error:0,GroupList:1,GroupChat:2,PrivateChat:3,System:4,PrivateRead:5,WorldItem:6,WorldRead:7,FriendRequest:8,FriendAccept:9,FriendReject:10,Recall:11},o=2023},5878:function(t,e,n){"use strict";t.exports=n.p+"static/img/bg.b6f3e009.png"}}]);