(self["webpackChunkchat"]=self["webpackChunkchat"]||[]).push([[804],{1804:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return O}});var s=function(){var e=this,t=e._self._c;return t("div",{staticClass:"border",style:{"--background-color":e.color},attrs:{id:"border"},on:{"!dragover":function(t){return e.dragover.apply(null,arguments)},"!dragleave":function(t){return e.dragleave.apply(null,arguments)},"!drop":function(t){return e.drop.apply(null,arguments)},contextmenu:function(t){return t.preventDefault(),t.stopPropagation(),e.handleContextMenu.apply(null,arguments)}}},[t("Header"),t("div",{staticClass:"home"},[e.isMobile&&(e.$route.name.includes("chat")||e.$route.name.includes("post"))?e._e():t("SideBar",{staticClass:"home-side"}),e.isMobile&&(e.$route.name.includes("chat")||e.$route.name.includes("blog")||e.$route.name.includes("post"))?e._e():t("ul",{staticClass:"home-list"},[t("li",{staticClass:"home-list-item home-list-header"},[t("div",{staticClass:"home-list-tool",on:{click:e.checkRequest}},[t("i",{class:e.isCheckRequest?"el-icon-chat-round":"el-icon-connection"}),e.isRequest&&!e.isCheckRequest||e.isCheckRequest&&e.unread_count?t("i",{staticClass:"message"}):e._e()]),t("form",{attrs:{action:"#"},on:{submit:function(t){return t.preventDefault(),e.submitUser.apply(null,arguments)}}},[e.isAdd?t("i",{staticClass:"el-icon-zoom-in home-list-item-icon",attrs:{title:"添加好友"},on:{click:function(t){e.isAdd=!e.isAdd}}}):t("i",{staticClass:"el-icon-search home-list-item-icon",attrs:{title:"搜索用户"},on:{click:function(t){e.isAdd=!e.isAdd}}}),t("el-autocomplete",{staticClass:"home-list-item-search",attrs:{"fetch-suggestions":e.querySearchAsync,"trigger-on-focus":!1,placeholder:e.isAdd?"添加好友":"搜索好友",clearable:"",autofocus:e.isAdd},on:{select:e.handleSelect},scopedSlots:e._u([{key:"default",fn:function(i){let{item:s}=i;return[t("h1",{staticClass:"username"},[e._v(e._s(s.username))]),t("p",{staticClass:"email"},[e._v(e._s(s.email))])]}}],null,!1,4081816228),model:{value:e.state,callback:function(t){e.state=t},expression:"state"}}),t("input",{staticClass:"home-list-item-search-btn",attrs:{type:"submit"},domProps:{value:e.isAdd?"添加":"查询"}})],1)]),e._l(e.friendList,(function(i){return e.isCheckRequest?e._e():t("UserItem",{key:i.id,attrs:{user:i},on:{changeUser:e.changeUser}})})),e.isCheckRequest?t("li",{staticClass:"home-list-item home-list-hr"},[e._v("好友请求")]):e._e(),e._l(e.requestList,(function(i){return e.isCheckRequest&&i.from_id!=e.userId?t("RequestItem",{key:i.request_id,attrs:{user:i},on:{resolveUser:e.resolveUser,rejectUser:e.rejectUser}}):e._e()})),e.isCheckRequest&&!e.requestList.length?t("li",{staticClass:"home-list-item no-request"},[e._v("暂无好友请求")]):e._e(),e.isCheckRequest?t("li",{staticClass:"home-list-item home-list-hr"},[e._v("我的请求")]):e._e(),e._l(e.sendList,(function(i){return e.isCheckRequest?t("RequestItem",{key:i.request_id,attrs:{user:i}}):e._e()})),e.isCheckRequest&&!e.sendList.length?t("li",{staticClass:"home-list-item no-request"},[e._v("暂无好友请求")]):e._e(),e.friendList.length?e._e():t("li",{staticClass:"home-list-item loading"},[t("i",{staticClass:"el-icon-loading"}),e._v(" "),t("span",[e._v("正在加载中...")])])],2),e.server&&e.userId?t("router-view",{key:e.$route.path,attrs:{isDrag:e.isDrag,isChangeAvatar:e.isChangeAvatar,onlineList:e.onlineList,friendList:e.friendList},on:{cancelChangeAvatar:function(t){e.isChangeAvatar=!1},changeFriendlist:e.changeFriendlist,changeUnread:e.changeUnread}}):e._e()],1),e.isMobile?e._e():t("ColorChange",{attrs:{color:e.color},on:{changeColor:e.changeColor}})],1)},n=[],r=i(2838),o=i.n(r),a=(i(7658),i(541),i(3648)),u=function(){var e=this,t=e._self._c;return t("li",{staticClass:"user",class:{active:e.user.id==e.to},on:{click:e.changeUser,contextmenu:function(t){return t.preventDefault(),t.stopPropagation(),e.handleContextMenu.apply(null,arguments)}}},[t("div",{staticClass:"user-title"},[t("div",{staticClass:"user-title-avatar"},[t("i",{staticClass:"user-title-avatar-online",style:{backgroundColor:e.user.online||e.user.id==e.userId?"#43da83":"#ff5e5e"}}),t("img",{staticClass:"user-title-avatar-img",style:{filter:e.user.online?"grayscale(0)":"grayscale(1)"},attrs:{src:`https://zeqichat.xyz${e.user.avatar}`,alt:"404 Not Found..."}}),e.user.id==e.userId||e.user.unread?t("i",{staticClass:"user-title-avatar-count"},[e._v(e._s(e.user.id==e.userId?"me":e.user.unread))]):e._e()]),t("div",{staticClass:"user-title-content"},[t("p",{staticClass:"user-title-content-header"},[t("span",{staticClass:"user-title-username",domProps:{innerHTML:e._s(e.filterMessage(e.formatMessage(e.user.username)))}}),e.user.last.create_time?t("span",{staticClass:"user-title-time"},[e._v(e._s(e.formatTime(e.user.last.create_time).slice(0,-3)))]):e._e()]),t("p",{staticClass:"user-title-message"},[e.user.last.username&&e.user.id==e.WORLD_ID?t("span",{staticClass:"user-title-name",domProps:{innerHTML:e._s(e.filterMessage(e.formatMessage(e.user.last.username)))}}):e._e(),e.user.last.username&&e.user.id==e.WORLD_ID?t("span",[e._v("  · ")]):e._e(),t("span",{staticClass:"user-title-msg"},[e._v(e._s(e.user.last.recall?"该消息已被撤回":e.filterMessage(e.user.last.message)))])])])])])},c=[],l=i(4781),h=i(3822),d=i(7768),f={name:"UserItem",props:{user:{type:Object}},data(){return{WORLD_ID:d.F}},computed:{...(0,h.rn)({userId:e=>e.user.userId}),to(){return this.$route.params.id}},methods:{filterMessage:a.t,formatMessage:a.w,formatTime:l.Z,changeUser(){this.$emit("changeUser",this.user.id,this.user.username,this.user.avatar)},handleContextMenu(e){this.$store.commit("SET_STATE",{x:e.clientX,y:e.clientY,menuList:[{label:"刷新页面",command:"refresh",icon:"el-icon-refresh"},{label:"私聊",command:"chat",id:this.user.id,icon:"el-icon-chat-line-round"},{label:"动态",command:"blog",id:this.user.id,icon:"el-icon-document"}],isShow:!0})}}},p=f,m=i(1001),g=(0,m.Z)(p,u,c,!1,null,"34770a65",null),v=g.exports,_=function(){var e=this,t=e._self._c;return t("li",{staticClass:"user"},[t("div",{staticClass:"user-title"},[t("div",{staticClass:"user-title-avatar"},[t("img",{staticClass:"user-title-avatar-img",attrs:{src:`https://zeqichat.xyz${e.user.avatar}`,alt:"404 Not Found..."}})]),t("div",{staticClass:"user-title-content"},[t("p",{staticClass:"user-title-content-header"},[t("span",{staticClass:"user-title-content-name"},[t("span",{staticClass:"user-title-username",domProps:{innerHTML:e._s(e.filterMessage(e.formatMessage(e.user.username)))}}),t("time",[e._v(e._s(e.formatTime(e.user.create_time)))])]),t("span",{staticClass:"user-title-btns"},[0===e.user.accept&&e.user.from_id==e.userId?t("button",{staticClass:"user-title-content-btn pending"},[e._v("等待同意...")]):e._e(),0===e.user.accept&&e.user.from_id!=e.userId?t("button",{staticClass:"user-title-content-btn resolve",on:{click:e.resolveUser}},[e._v("同意")]):e._e(),0===e.user.accept&&e.user.from_id!=e.userId?t("button",{staticClass:"user-title-content-btn reject",on:{click:e.rejectUser}},[e._v("拒绝")]):e._e(),1===e.user.accept?t("button",{staticClass:"user-title-content-btn resolved"},[t("i",{staticClass:"el-icon-check"}),e._v(" 已同意")]):e._e(),-1===e.user.accept?t("button",{staticClass:"user-title-content-btn rejected"},[t("i",{staticClass:"el-icon-close"}),e._v(" 已拒绝")]):e._e()])])])])])},b=[],y={name:"UserItem",props:{user:{type:Object}},computed:{...(0,h.rn)({userId:e=>e.user.userId,token:e=>e.user.token})},methods:{filterMessage:a.t,formatMessage:a.w,formatTime:l.Z,resolveUser(){this.$axios.put("/api/friend",{to:this.token,id:this.user.request_id}),this.$emit("resolveUser",this.user.request_id)},rejectUser(){this.$axios.delete(`/api/friend?to=${this.token}&id=${this.user.request_id}`),this.$emit("rejectUser",this.user.request_id)}}},w=y,C=(0,m.Z)(w,_,b,!1,null,"da765304",null),x=C.exports;function $(e){let t,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:500;return function(){let s=this,n=arguments;t&&clearTimeout(t),t=setTimeout((()=>{e.apply(s,n)}),i)}}var k={name:"Home",data(){return{isDrag:!1,WORLD_ID:d.F,onlineList:[],mobileShow:!1,isChangeAvatar:!1,state:"",allUserList:[],friendList:[],requestList:[],sendList:[],isAdd:!1,isCheckRequest:!1,color:localStorage.getItem("color")||"#ff0000"}},components:{UserItem:v,RequestItem:x,[o().name]:o(),SideBar:()=>i.e(386).then(i.bind(i,386)),ColorChange:()=>i.e(931).then(i.bind(i,6029)),Header:()=>i.e(347).then(i.bind(i,6347))},computed:{...(0,h.rn)({userId:e=>e.user.userId,token:e=>e.user.token,username:e=>e.user.username,avatar:e=>e.user.avatar,isMobile:e=>e.mobile.isMobile,server:e=>e.server.server}),url(){return URL.createObjectURL(this.file)},isRequest(){return this.requestList.some((e=>0==e.accept))},unread_count(){return this.friendList.reduce(((e,t)=>e+t.unread?t.unread:0),0)}},methods:{filterMessage:a.t,formatMessage:a.w,debounceFun:$,changeUnread(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;0==t?this.friendList.find((t=>t.id==e)).unread=0:this.friendList.find((t=>t.id==e)).unread++},handleContextMenu(e){this.$store.commit("SET_STATE",{x:e.clientX,y:e.clientY,menuList:[{label:"刷新页面",command:"refresh",icon:"el-icon-refresh"},{label:"添加好友",command:"add",icon:"el-icon-user"}],isShow:!0})},changeColor(e){this.color=e,localStorage.setItem("color",e)},checkRequest(){this.isCheckRequest=!this.isCheckRequest},resolveUser(e){this.requestList.find((t=>t.request_id==e)).accept=1,this.getFriend(),this.server.emit(d.B.FriendAccept,{to:this.requestList.find((t=>t.request_id==e)).from_id})},rejectUser(e){this.requestList.find((t=>t.request_id==e)).accept=-1,this.server.emit(d.B.FriendReject,{to:this.requestList.find((t=>t.request_id==e)).from_id})},handleSelect(e){this.state=e.username},async querySearchAsync(e,t){if(!e.trim())return;const i=this.debounceFun((async()=>{if(this.isAdd){const i=await this.$axios.get(`/api/user?key=${e}`);this.allUserList=i.data.data,t(this.allUserList)}else t(this.friendList.filter((t=>t.username.includes(e)))||item.email.includes(e))}),100);i()},submitUser(e,t){let i;i=t||(this.state.trim()&&this.isAdd?this.allUserList.find((e=>e.username===this.state))?.id:this.friendList.find((e=>e.username===this.state))?.id),i?this.isAdd?this.$axios.post("/api/friend",{from:this.token,to:i}).then((e=>{this.getRequestFriend(),this.getFriend(),this.server.emit(d.B.FriendRequest,{to:i}),this.$notify.success({title:"成功",message:e.data.msg,offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))})})):(this.$router.replace({name:"chat",params:{id:i}}),this.$nextTick((()=>{setTimeout((()=>{document.querySelector(".user.active")?.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"})}),300)}))):this.$notify.error({title:"出错",message:"该用户不存在",offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))})},async getFriend(){let e=await this.$axios.get(`/api/friend?user=${this.token}`);this.friendList=e.data.data.sort(((e,t)=>new Date(t.last.create_time??"1970-01-01")-new Date(e.last.create_time??"1970-01-01")))},async getRequestFriend(){let e=await this.$axios.get(`/api/friend/request?user=${this.token}`);this.requestList=e.data.data.request.reverse(),this.sendList=e.data.data.send.reverse()},dragover(e){e.preventDefault(),this.isDrag=!0},dragleave(e){e.preventDefault(),this.isDrag=!1},drop(){this.isDrag=!1},changeUser(e){this.isMobile?this.$router.push({name:"chat",params:{id:e}}):this.$router.replace({name:"chat",params:{id:e}})},changeFriendlist(e,t){const i=this.friendList.findIndex((t=>t.id==e));if(-1==i)return;const s=this.friendList.splice(i,1);s[0].last=t,this.friendList.unshift(s[0])},async init(){await this.getFriend(),this.getRequestFriend(),this.server.emit(d.B.GroupList),this.isMobile||"home"===this.$route.name&&this.$router.replace({name:"chat",params:{id:localStorage.getItem("to")??this.WORLD_ID}})}},async created(){let e=await this.$axios.get(`/api/user/${localStorage.getItem("token")}`);this.$store.dispatch("login",{username:e.data.data.username,avatar:e.data.data.avatar,token:localStorage.getItem("token"),userId:e.data.data.id}),this.$store.commit("SET_SERVER",`wss://zeqichat.xyz?token=${localStorage.getItem("token")}`),this.init(),this.server.on(d.B.GroupList,(e=>{let t=e.data;t=t.filter((e=>e.to==this.userId||e.id==this.WORLD_ID)),t.reduce(((e,t)=>(-1==e.findIndex((e=>e.id==t.id))&&e.push(t),e)),[]),this.onlineList=t})),this.$bus.$on("changeInfo",(()=>{this.isChangeAvatar=!0})),this.$bus.$on("mobileBack",(()=>{this.isMobile&&this.$router.replace("/home")})),this.$bus.$on("changeUser",(e=>{this.changeUser(e)})),this.$bus.$on("changeAvatar",(()=>{this.isChangeAvatar=!0})),this.$bus.$on("addFriend",(e=>{this.isAdd=!0,this.isCheckRequest=!0,this.submitUser(null,e)})),this.server.on(d.B.Error,(e=>{this.$store.dispatch("logout"),this.$notify.error({title:"Error",message:e.data,offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))}),this.$router.replace("/")})),this.server.on(d.B.FriendRequest,(e=>{this.getRequestFriend()})),this.server.on(d.B.FriendAccept,(e=>{this.friendList.unshift(e.data),this.sendList.find((t=>t.to_id==e.id))&&(this.sendList.find((t=>t.to_id==e.id)).accept=1)})),this.server.on(d.B.FriendReject,(e=>{this.sendList.find((t=>t.to_id==e.id)).accept=-1}))},beforeDestroy(){this.server.disconnect()},watch:{onlineList(){this.friendList.forEach((e=>{const t=this.onlineList.findIndex((t=>t.id==e.id));e.online=-1!=t})),this.friendList.sort(((e,t)=>e.online&&!t.online?-1:!e.online&&t.online?1:0))}}},S=k,L=(0,m.Z)(S,s,n,!1,null,"d0e99104",null),O=L.exports},2838:function(e,t,i){e.exports=function(e){var t={};function i(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=e,i.c=t,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(s,n,function(t){return e[t]}.bind(null,n));return s},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/dist/",i(i.s=65)}({0:function(e,t,i){"use strict";function s(e,t,i,s,n,r,o,a){var u,c="function"===typeof e?e.options:e;if(t&&(c.render=t,c.staticRenderFns=i,c._compiled=!0),s&&(c.functional=!0),r&&(c._scopeId="data-v-"+r),o?(u=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"===typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),n&&n.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(o)},c._ssrRegister=u):n&&(u=a?function(){n.call(this,this.$root.$options.shadowRoot)}:n),u)if(c.functional){c._injectStyles=u;var l=c.render;c.render=function(e,t){return u.call(t),l(e,t)}}else{var h=c.beforeCreate;c.beforeCreate=h?[].concat(h,u):[u]}return{exports:e,options:c}}i.d(t,"a",(function(){return s}))},10:function(e,t){e.exports=i(5981)},11:function(e,t){e.exports=i(4511)},12:function(e,t){e.exports=i(9305)},15:function(e,t){e.exports=i(5095)},19:function(e,t){e.exports=i(8973)},22:function(e,t){e.exports=i(9528)},3:function(e,t){e.exports=i(5402)},4:function(e,t){e.exports=i(8816)},5:function(e,t){e.exports=i(4857)},65:function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.close,expression:"close"}],staticClass:"el-autocomplete",attrs:{"aria-haspopup":"listbox",role:"combobox","aria-expanded":e.suggestionVisible,"aria-owns":e.id}},[i("el-input",e._b({ref:"input",on:{input:e.handleInput,change:e.handleChange,focus:e.handleFocus,blur:e.handleBlur,clear:e.handleClear},nativeOn:{keydown:[function(t){if(!("button"in t)&&e._k(t.keyCode,"up",38,t.key,["Up","ArrowUp"]))return null;t.preventDefault(),e.highlight(e.highlightedIndex-1)},function(t){if(!("button"in t)&&e._k(t.keyCode,"down",40,t.key,["Down","ArrowDown"]))return null;t.preventDefault(),e.highlight(e.highlightedIndex+1)},function(t){return!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleKeyEnter(t)},function(t){return!("button"in t)&&e._k(t.keyCode,"tab",9,t.key,"Tab")?null:e.close(t)}]}},"el-input",[e.$props,e.$attrs],!1),[e.$slots.prepend?i("template",{slot:"prepend"},[e._t("prepend")],2):e._e(),e.$slots.append?i("template",{slot:"append"},[e._t("append")],2):e._e(),e.$slots.prefix?i("template",{slot:"prefix"},[e._t("prefix")],2):e._e(),e.$slots.suffix?i("template",{slot:"suffix"},[e._t("suffix")],2):e._e()],2),i("el-autocomplete-suggestions",{ref:"suggestions",class:[e.popperClass?e.popperClass:""],attrs:{"visible-arrow":"","popper-options":e.popperOptions,"append-to-body":e.popperAppendToBody,placement:e.placement,id:e.id}},e._l(e.suggestions,(function(t,s){return i("li",{key:s,class:{highlighted:e.highlightedIndex===s},attrs:{id:e.id+"-item-"+s,role:"option","aria-selected":e.highlightedIndex===s},on:{click:function(i){e.select(t)}}},[e._t("default",[e._v("\n        "+e._s(t[e.valueKey])+"\n      ")],{item:t})],2)})),0)],1)},n=[];s._withStripped=!0;var r=i(19),o=i.n(r),a=i(10),u=i.n(a),c=i(12),l=i.n(c),h=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":e.doDestroy}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-autocomplete-suggestion el-popper",class:{"is-loading":!e.parent.hideLoading&&e.parent.loading},style:{width:e.dropdownWidth},attrs:{role:"region"}},[i("el-scrollbar",{attrs:{tag:"ul","wrap-class":"el-autocomplete-suggestion__wrap","view-class":"el-autocomplete-suggestion__list"}},[!e.parent.hideLoading&&e.parent.loading?i("li",[i("i",{staticClass:"el-icon-loading"})]):e._t("default")],2)],1)])},d=[];h._withStripped=!0;var f=i(5),p=i.n(f),m=i(4),g=i.n(m),v=i(15),_=i.n(v),b={components:{ElScrollbar:_.a},mixins:[p.a,g.a],componentName:"ElAutocompleteSuggestions",data:function(){return{parent:this.$parent,dropdownWidth:""}},props:{options:{default:function(){return{gpuAcceleration:!1}}},id:String},methods:{select:function(e){this.dispatch("ElAutocomplete","item-click",e)}},updated:function(){var e=this;this.$nextTick((function(t){e.popperJS&&e.updatePopper()}))},mounted:function(){this.$parent.popperElm=this.popperElm=this.$el,this.referenceElm=this.$parent.$refs.input.$refs.input||this.$parent.$refs.input.$refs.textarea,this.referenceList=this.$el.querySelector(".el-autocomplete-suggestion__list"),this.referenceList.setAttribute("role","listbox"),this.referenceList.setAttribute("id",this.id)},created:function(){var e=this;this.$on("visible",(function(t,i){e.dropdownWidth=i+"px",e.showPopper=t}))}},y=b,w=i(0),C=Object(w["a"])(y,h,d,!1,null,null,null);C.options.__file="packages/autocomplete/src/autocomplete-suggestions.vue";var x=C.exports,$=i(11),k=i.n($),S=i(3),L=i(22),O=i.n(L),I={name:"ElAutocomplete",mixins:[g.a,O()("input"),k.a],inheritAttrs:!1,componentName:"ElAutocomplete",components:{ElInput:u.a,ElAutocompleteSuggestions:x},directives:{Clickoutside:l.a},props:{valueKey:{type:String,default:"value"},popperClass:String,popperOptions:Object,placeholder:String,clearable:{type:Boolean,default:!1},disabled:Boolean,name:String,size:String,value:String,maxlength:Number,minlength:Number,autofocus:Boolean,fetchSuggestions:Function,triggerOnFocus:{type:Boolean,default:!0},customItem:String,selectWhenUnmatched:{type:Boolean,default:!1},prefixIcon:String,suffixIcon:String,label:String,debounce:{type:Number,default:300},placement:{type:String,default:"bottom-start"},hideLoading:Boolean,popperAppendToBody:{type:Boolean,default:!0},highlightFirstItem:{type:Boolean,default:!1}},data:function(){return{activated:!1,suggestions:[],loading:!1,highlightedIndex:-1,suggestionDisabled:!1}},computed:{suggestionVisible:function(){var e=this.suggestions,t=Array.isArray(e)&&e.length>0;return(t||this.loading)&&this.activated},id:function(){return"el-autocomplete-"+Object(S["generateId"])()}},watch:{suggestionVisible:function(e){var t=this.getInput();t&&this.broadcast("ElAutocompleteSuggestions","visible",[e,t.offsetWidth])}},methods:{getMigratingConfig:function(){return{props:{"custom-item":"custom-item is removed, use scoped slot instead.",props:"props is removed, use value-key instead."}}},getData:function(e){var t=this;this.suggestionDisabled||(this.loading=!0,this.fetchSuggestions(e,(function(e){t.loading=!1,t.suggestionDisabled||(Array.isArray(e)?(t.suggestions=e,t.highlightedIndex=t.highlightFirstItem?0:-1):console.error("[Element Error][Autocomplete]autocomplete suggestions must be an array"))})))},handleInput:function(e){if(this.$emit("input",e),this.suggestionDisabled=!1,!this.triggerOnFocus&&!e)return this.suggestionDisabled=!0,void(this.suggestions=[]);this.debouncedGetData(e)},handleChange:function(e){this.$emit("change",e)},handleFocus:function(e){this.activated=!0,this.$emit("focus",e),this.triggerOnFocus&&this.debouncedGetData(this.value)},handleBlur:function(e){this.$emit("blur",e)},handleClear:function(){this.activated=!1,this.$emit("clear")},close:function(e){this.activated=!1},handleKeyEnter:function(e){var t=this;this.suggestionVisible&&this.highlightedIndex>=0&&this.highlightedIndex<this.suggestions.length?(e.preventDefault(),this.select(this.suggestions[this.highlightedIndex])):this.selectWhenUnmatched&&(this.$emit("select",{value:this.value}),this.$nextTick((function(e){t.suggestions=[],t.highlightedIndex=-1})))},select:function(e){var t=this;this.$emit("input",e[this.valueKey]),this.$emit("select",e),this.$nextTick((function(e){t.suggestions=[],t.highlightedIndex=-1}))},highlight:function(e){if(this.suggestionVisible&&!this.loading)if(e<0)this.highlightedIndex=-1;else{e>=this.suggestions.length&&(e=this.suggestions.length-1);var t=this.$refs.suggestions.$el.querySelector(".el-autocomplete-suggestion__wrap"),i=t.querySelectorAll(".el-autocomplete-suggestion__list li"),s=i[e],n=t.scrollTop,r=s.offsetTop;r+s.scrollHeight>n+t.clientHeight&&(t.scrollTop+=s.scrollHeight),r<n&&(t.scrollTop-=s.scrollHeight),this.highlightedIndex=e;var o=this.getInput();o.setAttribute("aria-activedescendant",this.id+"-item-"+this.highlightedIndex)}},getInput:function(){return this.$refs.input.getInput()}},mounted:function(){var e=this;this.debouncedGetData=o()(this.debounce,this.getData),this.$on("item-click",(function(t){e.select(t)}));var t=this.getInput();t.setAttribute("role","textbox"),t.setAttribute("aria-autocomplete","list"),t.setAttribute("aria-controls","id"),t.setAttribute("aria-activedescendant",this.id+"-item-"+this.highlightedIndex)},beforeDestroy:function(){this.$refs.suggestions.$destroy()}},A=I,E=Object(w["a"])(A,s,n,!1,null,null,null);E.options.__file="packages/autocomplete/src/autocomplete.vue";var M=E.exports;M.install=function(e){e.component(M.name,M)};t["default"]=M}})},9528:function(e,t){"use strict";t.__esModule=!0,t["default"]=function(e){return{methods:{focus:function(){this.$refs[e].focus()}}}}},5095:function(e,t,i){e.exports=function(e){var t={};function i(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=e,i.c=t,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(s,n,function(t){return e[t]}.bind(null,n));return s},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/dist/",i(i.s=133)}({133:function(e,t,i){"use strict";i.r(t);var s=i(16),n=i(39),r=i.n(n),o=i(3),a=i(2),u={vertical:{offset:"offsetHeight",scroll:"scrollTop",scrollSize:"scrollHeight",size:"height",key:"vertical",axis:"Y",client:"clientY",direction:"top"},horizontal:{offset:"offsetWidth",scroll:"scrollLeft",scrollSize:"scrollWidth",size:"width",key:"horizontal",axis:"X",client:"clientX",direction:"left"}};function c(e){var t=e.move,i=e.size,s=e.bar,n={},r="translate"+s.axis+"("+t+"%)";return n[s.size]=i,n.transform=r,n.msTransform=r,n.webkitTransform=r,n}var l={name:"Bar",props:{vertical:Boolean,size:String,move:Number},computed:{bar:function(){return u[this.vertical?"vertical":"horizontal"]},wrap:function(){return this.$parent.wrap}},render:function(e){var t=this.size,i=this.move,s=this.bar;return e("div",{class:["el-scrollbar__bar","is-"+s.key],on:{mousedown:this.clickTrackHandler}},[e("div",{ref:"thumb",class:"el-scrollbar__thumb",on:{mousedown:this.clickThumbHandler},style:c({size:t,move:i,bar:s})})])},methods:{clickThumbHandler:function(e){e.ctrlKey||2===e.button||(this.startDrag(e),this[this.bar.axis]=e.currentTarget[this.bar.offset]-(e[this.bar.client]-e.currentTarget.getBoundingClientRect()[this.bar.direction]))},clickTrackHandler:function(e){var t=Math.abs(e.target.getBoundingClientRect()[this.bar.direction]-e[this.bar.client]),i=this.$refs.thumb[this.bar.offset]/2,s=100*(t-i)/this.$el[this.bar.offset];this.wrap[this.bar.scroll]=s*this.wrap[this.bar.scrollSize]/100},startDrag:function(e){e.stopImmediatePropagation(),this.cursorDown=!0,Object(a["on"])(document,"mousemove",this.mouseMoveDocumentHandler),Object(a["on"])(document,"mouseup",this.mouseUpDocumentHandler),document.onselectstart=function(){return!1}},mouseMoveDocumentHandler:function(e){if(!1!==this.cursorDown){var t=this[this.bar.axis];if(t){var i=-1*(this.$el.getBoundingClientRect()[this.bar.direction]-e[this.bar.client]),s=this.$refs.thumb[this.bar.offset]-t,n=100*(i-s)/this.$el[this.bar.offset];this.wrap[this.bar.scroll]=n*this.wrap[this.bar.scrollSize]/100}}},mouseUpDocumentHandler:function(e){this.cursorDown=!1,this[this.bar.axis]=0,Object(a["off"])(document,"mousemove",this.mouseMoveDocumentHandler),document.onselectstart=null}},destroyed:function(){Object(a["off"])(document,"mouseup",this.mouseUpDocumentHandler)}},h={name:"ElScrollbar",components:{Bar:l},props:{native:Boolean,wrapStyle:{},wrapClass:{},viewClass:{},viewStyle:{},noresize:Boolean,tag:{type:String,default:"div"}},data:function(){return{sizeWidth:"0",sizeHeight:"0",moveX:0,moveY:0}},computed:{wrap:function(){return this.$refs.wrap}},render:function(e){var t=r()(),i=this.wrapStyle;if(t){var s="-"+t+"px",n="margin-bottom: "+s+"; margin-right: "+s+";";Array.isArray(this.wrapStyle)?(i=Object(o["toObject"])(this.wrapStyle),i.marginRight=i.marginBottom=s):"string"===typeof this.wrapStyle?i+=n:i=n}var a=e(this.tag,{class:["el-scrollbar__view",this.viewClass],style:this.viewStyle,ref:"resize"},this.$slots.default),u=e("div",{ref:"wrap",style:i,on:{scroll:this.handleScroll},class:[this.wrapClass,"el-scrollbar__wrap",t?"":"el-scrollbar__wrap--hidden-default"]},[[a]]),c=void 0;return c=this.native?[e("div",{ref:"wrap",class:[this.wrapClass,"el-scrollbar__wrap"],style:i},[[a]])]:[u,e(l,{attrs:{move:this.moveX,size:this.sizeWidth}}),e(l,{attrs:{vertical:!0,move:this.moveY,size:this.sizeHeight}})],e("div",{class:"el-scrollbar"},c)},methods:{handleScroll:function(){var e=this.wrap;this.moveY=100*e.scrollTop/e.clientHeight,this.moveX=100*e.scrollLeft/e.clientWidth},update:function(){var e=void 0,t=void 0,i=this.wrap;i&&(e=100*i.clientHeight/i.scrollHeight,t=100*i.clientWidth/i.scrollWidth,this.sizeHeight=e<100?e+"%":"",this.sizeWidth=t<100?t+"%":"")}},mounted:function(){this.native||(this.$nextTick(this.update),!this.noresize&&Object(s["addResizeListener"])(this.$refs.resize,this.update))},beforeDestroy:function(){this.native||!this.noresize&&Object(s["removeResizeListener"])(this.$refs.resize,this.update)},install:function(e){e.component(h.name,h)}};t["default"]=h},16:function(e,t){e.exports=i(2740)},2:function(e,t){e.exports=i(3766)},3:function(e,t){e.exports=i(5402)},39:function(e,t){e.exports=i(8667)}})},2740:function(e,t,i){"use strict";i(7658),t.__esModule=!0,t.removeResizeListener=t.addResizeListener=void 0;var s=i(566),n=o(s),r=i(9070);function o(e){return e&&e.__esModule?e:{default:e}}var a="undefined"===typeof window,u=function(e){var t=e,i=Array.isArray(t),s=0;for(t=i?t:t[Symbol.iterator]();;){var n;if(i){if(s>=t.length)break;n=t[s++]}else{if(s=t.next(),s.done)break;n=s.value}var r=n,o=r.target.__resizeListeners__||[];o.length&&o.forEach((function(e){e()}))}};t.addResizeListener=function(e,t){a||(e.__resizeListeners__||(e.__resizeListeners__=[],e.__ro__=new n.default((0,r.debounce)(16,u)),e.__ro__.observe(e)),e.__resizeListeners__.push(t))},t.removeResizeListener=function(e,t){e&&e.__resizeListeners__&&(e.__resizeListeners__.splice(e.__resizeListeners__.indexOf(t),1),e.__resizeListeners__.length||e.__ro__.disconnect())}},566:function(e,t,i){"use strict";i.r(t);i(7658);var s=function(){if("undefined"!==typeof Map)return Map;function e(e,t){var i=-1;return e.some((function(e,s){return e[0]===t&&(i=s,!0)})),i}return function(){function t(){this.__entries__=[]}return Object.defineProperty(t.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),t.prototype.get=function(t){var i=e(this.__entries__,t),s=this.__entries__[i];return s&&s[1]},t.prototype.set=function(t,i){var s=e(this.__entries__,t);~s?this.__entries__[s][1]=i:this.__entries__.push([t,i])},t.prototype.delete=function(t){var i=this.__entries__,s=e(i,t);~s&&i.splice(s,1)},t.prototype.has=function(t){return!!~e(this.__entries__,t)},t.prototype.clear=function(){this.__entries__.splice(0)},t.prototype.forEach=function(e,t){void 0===t&&(t=null);for(var i=0,s=this.__entries__;i<s.length;i++){var n=s[i];e.call(t,n[1],n[0])}},t}()}(),n="undefined"!==typeof window&&"undefined"!==typeof document&&window.document===document,r=function(){return"undefined"!==typeof i.g&&i.g.Math===Math?i.g:"undefined"!==typeof self&&self.Math===Math?self:"undefined"!==typeof window&&window.Math===Math?window:Function("return this")()}(),o=function(){return"function"===typeof requestAnimationFrame?requestAnimationFrame.bind(r):function(e){return setTimeout((function(){return e(Date.now())}),1e3/60)}}(),a=2;function u(e,t){var i=!1,s=!1,n=0;function r(){i&&(i=!1,e()),s&&c()}function u(){o(r)}function c(){var e=Date.now();if(i){if(e-n<a)return;s=!0}else i=!0,s=!1,setTimeout(u,t);n=e}return c}var c=20,l=["top","right","bottom","left","width","height","size","weight"],h="undefined"!==typeof MutationObserver,d=function(){function e(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=u(this.refresh.bind(this),c)}return e.prototype.addObserver=function(e){~this.observers_.indexOf(e)||this.observers_.push(e),this.connected_||this.connect_()},e.prototype.removeObserver=function(e){var t=this.observers_,i=t.indexOf(e);~i&&t.splice(i,1),!t.length&&this.connected_&&this.disconnect_()},e.prototype.refresh=function(){var e=this.updateObservers_();e&&this.refresh()},e.prototype.updateObservers_=function(){var e=this.observers_.filter((function(e){return e.gatherActive(),e.hasActive()}));return e.forEach((function(e){return e.broadcastActive()})),e.length>0},e.prototype.connect_=function(){n&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),h?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},e.prototype.disconnect_=function(){n&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},e.prototype.onTransitionEnd_=function(e){var t=e.propertyName,i=void 0===t?"":t,s=l.some((function(e){return!!~i.indexOf(e)}));s&&this.refresh()},e.getInstance=function(){return this.instance_||(this.instance_=new e),this.instance_},e.instance_=null,e}(),f=function(e,t){for(var i=0,s=Object.keys(t);i<s.length;i++){var n=s[i];Object.defineProperty(e,n,{value:t[n],enumerable:!1,writable:!1,configurable:!0})}return e},p=function(e){var t=e&&e.ownerDocument&&e.ownerDocument.defaultView;return t||r},m=k(0,0,0,0);function g(e){return parseFloat(e)||0}function v(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];return t.reduce((function(t,i){var s=e["border-"+i+"-width"];return t+g(s)}),0)}function _(e){for(var t=["top","right","bottom","left"],i={},s=0,n=t;s<n.length;s++){var r=n[s],o=e["padding-"+r];i[r]=g(o)}return i}function b(e){var t=e.getBBox();return k(0,0,t.width,t.height)}function y(e){var t=e.clientWidth,i=e.clientHeight;if(!t&&!i)return m;var s=p(e).getComputedStyle(e),n=_(s),r=n.left+n.right,o=n.top+n.bottom,a=g(s.width),u=g(s.height);if("border-box"===s.boxSizing&&(Math.round(a+r)!==t&&(a-=v(s,"left","right")+r),Math.round(u+o)!==i&&(u-=v(s,"top","bottom")+o)),!C(e)){var c=Math.round(a+r)-t,l=Math.round(u+o)-i;1!==Math.abs(c)&&(a-=c),1!==Math.abs(l)&&(u-=l)}return k(n.left,n.top,a,u)}var w=function(){return"undefined"!==typeof SVGGraphicsElement?function(e){return e instanceof p(e).SVGGraphicsElement}:function(e){return e instanceof p(e).SVGElement&&"function"===typeof e.getBBox}}();function C(e){return e===p(e).document.documentElement}function x(e){return n?w(e)?b(e):y(e):m}function $(e){var t=e.x,i=e.y,s=e.width,n=e.height,r="undefined"!==typeof DOMRectReadOnly?DOMRectReadOnly:Object,o=Object.create(r.prototype);return f(o,{x:t,y:i,width:s,height:n,top:i,right:t+s,bottom:n+i,left:t}),o}function k(e,t,i,s){return{x:e,y:t,width:i,height:s}}var S=function(){function e(e){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=k(0,0,0,0),this.target=e}return e.prototype.isActive=function(){var e=x(this.target);return this.contentRect_=e,e.width!==this.broadcastWidth||e.height!==this.broadcastHeight},e.prototype.broadcastRect=function(){var e=this.contentRect_;return this.broadcastWidth=e.width,this.broadcastHeight=e.height,e},e}(),L=function(){function e(e,t){var i=$(t);f(this,{target:e,contentRect:i})}return e}(),O=function(){function e(e,t,i){if(this.activeObservations_=[],this.observations_=new s,"function"!==typeof e)throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=e,this.controller_=t,this.callbackCtx_=i}return e.prototype.observe=function(e){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!==typeof Element&&Element instanceof Object){if(!(e instanceof p(e).Element))throw new TypeError('parameter 1 is not of type "Element".');var t=this.observations_;t.has(e)||(t.set(e,new S(e)),this.controller_.addObserver(this),this.controller_.refresh())}},e.prototype.unobserve=function(e){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!==typeof Element&&Element instanceof Object){if(!(e instanceof p(e).Element))throw new TypeError('parameter 1 is not of type "Element".');var t=this.observations_;t.has(e)&&(t.delete(e),t.size||this.controller_.removeObserver(this))}},e.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},e.prototype.gatherActive=function(){var e=this;this.clearActive(),this.observations_.forEach((function(t){t.isActive()&&e.activeObservations_.push(t)}))},e.prototype.broadcastActive=function(){if(this.hasActive()){var e=this.callbackCtx_,t=this.activeObservations_.map((function(e){return new L(e.target,e.broadcastRect())}));this.callback_.call(e,t,e),this.clearActive()}},e.prototype.clearActive=function(){this.activeObservations_.splice(0)},e.prototype.hasActive=function(){return this.activeObservations_.length>0},e}(),I="undefined"!==typeof WeakMap?new WeakMap:new s,A=function(){function e(t){if(!(this instanceof e))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var i=d.getInstance(),s=new O(t,i,this);I.set(this,s)}return e}();["observe","unobserve","disconnect"].forEach((function(e){A.prototype[e]=function(){var t;return(t=I.get(this))[e].apply(t,arguments)}}));var E=function(){return"undefined"!==typeof r.ResizeObserver?r.ResizeObserver:A}();t["default"]=E},8973:function(e,t,i){var s=i(2895);e.exports=function(e,t,i){return void 0===i?s(e,t,!1):s(e,i,!1!==t)}},9070:function(e,t,i){var s=i(2895),n=i(8973);e.exports={throttle:s,debounce:n}},2895:function(e){e.exports=function(e,t,i,s){var n,r=0;function o(){var o=this,a=Number(new Date)-r,u=arguments;function c(){r=Number(new Date),i.apply(o,u)}function l(){n=void 0}s&&!n&&c(),n&&clearTimeout(n),void 0===s&&a>e?c():!0!==t&&(n=setTimeout(s?l:c,void 0===s?e-a:e))}return"boolean"!==typeof t&&(s=i,i=t,t=void 0),o}}}]);