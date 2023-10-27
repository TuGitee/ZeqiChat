"use strict";(self["webpackChunkchat"]=self["webpackChunkchat"]||[]).push([[31],{31:function(t,e,a){a.r(e),a.d(e,{default:function(){return h}});var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"upload"},[e("div",{staticClass:"upload-header"},[e("div",{staticClass:"upload-header-left",on:{click:t.goBack}},[e("i",{staticClass:"el-icon-arrow-left"}),t._v(" 取消 ")]),t._m(0),e("div",{staticClass:"upload-header-right"},[e("span",{staticClass:"upload-header-right-send",on:{click:t.submit}},[t.isLoading?e("i",{staticClass:"el-icon-loading"}):t._e(),t._v("发布")])])]),e("div",{staticClass:"upload-content"},[e("el-input",{attrs:{type:"textarea",maxlength:"2048",rows:4,placeholder:"这一刻的想法...",resize:"none",autosize:""},model:{value:t.textarea,callback:function(e){t.textarea=e},expression:"textarea"}}),e("el-upload",{ref:"upload",staticClass:"upload-content-image",attrs:{action:"#","list-type":"picture-card","auto-upload":!1,multiple:"",limit:9,"on-change":t.handleChange,accept:"image/*"},scopedSlots:t._u([{key:"file",fn:function(a){let{file:s}=a;return e("div",{},[e("img",{staticClass:"el-upload-list__item-thumbnail",attrs:{src:s.url,alt:"",preview:"上传文件",draggable:"true"}}),e("span",{staticClass:"el-upload-list__item-actions"},[t.disabled?t._e():e("span",{staticClass:"el-upload-list__item-delete",on:{click:function(e){return t.handleRemove(s)}}},[e("i",{staticClass:"el-icon-delete"})])])])}}])},[e("i",{staticClass:"el-icon-plus",attrs:{slot:"default"},slot:"default"})]),e("div",{staticClass:"upload-content-choices"},[e("button",{staticClass:"upload-content-choices-item",on:{click:t.clearAll}},[t._m(1),t._m(2)]),t._m(3)])],1)])},i=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"upload-header-center"},[e("span",{staticClass:"upload-header-center-send"},[t._v("发表动态")])])},function(){var t=this,e=t._self._c;return e("span",{staticClass:"upload-content-choices-item-left"},[e("i",{staticClass:"el-icon-delete"}),t._v("清空所有图片")])},function(){var t=this,e=t._self._c;return e("span",{staticClass:"upload-content-choices-item-right"},[e("i",{staticClass:"el-icon-arrow-right"})])},function(){var t=this,e=t._self._c;return e("button",{staticClass:"upload-content-choices-item"},[e("span",{staticClass:"upload-content-choices-item-left"},[e("i",{staticClass:"el-icon-location-outline"}),t._v("所在位置")]),e("span",{staticClass:"upload-content-choices-item-right"},[e("i",{staticClass:"el-icon-arrow-right"})])])}],o=a(8787),l=a.n(o),n=a(5981),r=a.n(n),c=(a(7658),a(2801),a(3767),a(8585),a(8696),{name:"Post",data(){return{textarea:"",isLoading:!1}},methods:{goBack(){this.$router.go(-1)},handleChange(t,e){e.length},async submit(){if(this.isLoading)return;if(!this.textarea.trim()&&0===this.$refs.upload.uploadFiles.length)return void this.$notify.error({title:"错误",message:"请输入内容",duration:2e3,offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))});this.isLoading=!0;let t=this.$refs.upload.uploadFiles;for(let s=0;s<t.length;s++){let e=t[s].raw,a=new FileReader;a.readAsDataURL(e),await new Promise((i=>{a.onload=a=>{let o=new Image;o.src=a.target.result,o.onload=()=>{let a=document.createElement("canvas"),l=a.getContext("2d"),n=o.width,r=o.height;a.width=n,a.height=r,l.drawImage(o,0,0,n,r);let c=a.toDataURL("image/jpeg",.5);t[s].raw=this.dataURLtoFile(c,e.name),i()}}}))}let e=[];for(let s=0;s<t.length;s++){const i=new FormData;i.append("image",t[s].raw);try{let t=await this.$axios.post("/api/image",i,{headers:{"Content-Type":"multipart/form-data"}});if(200!==t.status)return void this.$notify.error({title:"错误",message:"上传失败",duration:2e3,offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))});e.push(t.data.image)}catch(a){return this.isLoading=!1,void this.$notify.error({title:"错误",message:"上传失败",duration:2e3,offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))})}}this.$axios.post("/api/blog",{content:this.textarea,images:JSON.stringify(e),user:this.token}).then((t=>{this.textarea="",this.$notify({title:"成功",message:"发布成功",type:"success",duration:2e3,offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))}),this.isLoading=!1,this.$router.go(-1)})).catch((t=>{this.isLoading=!1,this.$notify.error({title:"错误",message:"发布失败",duration:2e3,offset:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))})}))},dataURLtoFile(t,e){let a=t.split(","),s=a[0].match(/:(.*?);/)[1],i=atob(a[1]),o=i.length,l=new Uint8Array(o);while(o--)l[o]=i.charCodeAt(o);return new File([l],e,{type:s})},clearAll(){0!==this.$refs.upload.uploadFiles&&this.$confirm("确认删除所有图片？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",closeOnClickModal:!0}).then((()=>{this.$refs.upload.clearFiles()})).catch((()=>{}))},handleRemove(t){this.$refs.upload.handleRemove(t)}},components:{[r().name]:r(),[l().name]:l()},computed:{token(){return localStorage.getItem("token")}}}),u=c,d=a(1001),p=(0,d.Z)(u,s,i,!1,null,"f0ab204e",null),h=p.exports}}]);