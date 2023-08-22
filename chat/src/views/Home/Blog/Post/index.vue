<template>
    <div class="upload">
        <div class="upload-header">
            <div class="upload-header-left" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                取消
            </div>
            <div class="upload-header-center">
                <span class="upload-header-center-send">发表动态</span>
            </div>
            <div class="upload-header-right">
                <span class="upload-header-right-send" @click="submit"><i class="el-icon-loading"
                        v-if="isLoading"></i>发布</span>
            </div>
        </div>
        <div class="upload-content">
            <el-input type="textarea" maxlength="2048" :rows="4" placeholder="这一刻的想法..." v-model="textarea" resize="none"
                autosize></el-input>
            <el-upload action="#" class="upload-content-image" list-type="picture-card" ref="upload" :auto-upload="false"
                multiple :limit="9" :on-change="handleChange" accept="image/*">
                <i slot="default" class="el-icon-plus"></i>

                <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" preview="上传文件" draggable="true">

                    <span class="el-upload-list__item-actions">
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                </div>
            </el-upload>

            <div class="upload-content-choices">
                <button class="upload-content-choices-item" @click="clearAll">
                    <span class="upload-content-choices-item-left"><i class="el-icon-delete"></i>清空所有图片</span><span
                        class="upload-content-choices-item-right"><i class="el-icon-arrow-right"></i></span>
                </button>
                <button class="upload-content-choices-item">
                    <span class="upload-content-choices-item-left"><i class="el-icon-location-outline"></i>所在位置</span><span
                        class="upload-content-choices-item-right"><i class="el-icon-arrow-right"></i></span>
                </button>
            </div>
        </div>

        
    </div>
</template>
  
<script>
import { Input, Upload } from 'element-ui'
export default {
    name: "Post",
    data() {
        return {
            textarea: '',
            isLoading: false,
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        handleChange(file, fileList) {
            if (fileList.length > 9) {
                return;
            }
        },
        async submit() {
            if (this.isLoading) return;
            if (!this.textarea.trim() && this.$refs.upload.uploadFiles.length === 0) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入内容",
                    duration: 2000,
                })
                return;
            }

            this.isLoading = true;
            let files = this.$refs.upload.uploadFiles

            for (let i = 0; i < files.length; i++) {
                let file = files[i].raw
                let reader = new FileReader()
                reader.readAsDataURL(file)
                await new Promise((resolve) => {
                    reader.onload = (e) => {
                        let img = new Image()
                        img.src = e.target.result
                        img.onload = () => {
                            let canvas = document.createElement('canvas')
                            let ctx = canvas.getContext('2d')
                            let width = img.width
                            let height = img.height
                            canvas.width = width
                            canvas.height = height
                            ctx.drawImage(img, 0, 0, width, height)
                            let base64 = canvas.toDataURL('image/jpeg', 0.5)
                            files[i].raw = this.dataURLtoFile(base64, file.name)
                            resolve()
                        }
                    }
                })
            }

            let filesList = []
            for (let i = 0; i < files.length; i++) {
                const fd = new FormData()
                fd.append('image', files[i].raw)
                try {
                    let res = await this.$axios.post("/api/image", fd, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    if (res.status !== 200) {
                        this.$notify.error({
                            title: "错误",
                            message: "上传失败",
                            duration: 2000,
                        })
                        return;
                    }
                    filesList.push(res.data.image)
                } catch (err) {
                    this.isLoading = false;
                    this.$notify.error({
                        title: "错误",
                        message: "上传失败",
                        duration: 2000,
                    })
                    return;
                }
            }

            this.$axios.post('/api/blog', {
                content: this.textarea,
                images: JSON.stringify(filesList),
                user: this.token
            }).then(res => {
                this.textarea = ''
                this.$notify({
                    title: "成功",
                    message: "发布成功",
                    type: "success",
                    duration: 2000
                })
                this.isLoading = false;
                this.$router.go(-1)
            }).catch(err => {
                this.isLoading = false;
                this.$notify.error({
                    title: "错误",
                    message: "发布失败",
                    duration: 2000,
                })
            })

        },
        dataURLtoFile(dataurl, filename) {
            let arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], filename, {
                type: mime
            })
        },
        clearAll() {
            if (this.$refs.upload.uploadFiles === 0) return;
            this.$confirm("确认删除所有图片？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: true,
            }).then(() => {
                this.$refs.upload.clearFiles()
            }).catch(() => { })
        },
        handleRemove(file) {
            this.$refs.upload.handleRemove(file)
        }
    },
    components: {
        [Input.name]: Input,
        [Upload.name]: Upload,
    },
    computed: {
        token() {
            return localStorage.getItem('token')
        }
    }
}
</script>
  
<style scoped lang="less">
.upload {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: #fffa;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    img {
        user-select: none;
        -webkit-user-drag: auto;
    }

    .upload-header {
        width: 100%;
        padding: .5rem 1rem;
        padding-top: calc(constant(safe-area-inset-top) + 0.5rem);
        padding-top: calc(env(safe-area-inset-top) + 0.5rem);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
        line-height: 1rem;

        user-select: none;

        .upload-header-left {
            width: fit-content;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            i {
                font-size: 1.1rem;
            }
        }

        .upload-header-center {
            width: fit-content;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
            font-size: 1.1rem;
        }

        .upload-header-right {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .upload-header-right-send {
                font-size: 1rem;
                color: white;
                background-color: red;
                line-height: 1;
                border-radius: .5rem;
                padding: .5rem .7rem;
            }
        }
    }

    .upload-content {
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        top: calc(constant(safe-area-inset-top) + 3rem);
        top: calc(env(safe-area-inset-top) + 3rem);
        padding: 0 1.2rem;

        /deep/ .el-textarea {

            textarea {
                border: none;
                line-height: 1.5;
                font-size: 16px;
                user-select: text;
                background-color: transparent;
                box-sizing: content-box;
                padding: 0;
            }
        }

        &-image {
            margin-top: 4rem;
            user-select: none;
            text-align: left;

            @image-size: calc(32% - 0.3rem);

            /deep/ .el-upload--picture-card {
                margin: 0.2rem;
                width: @image-size;
                height: unset;
                line-height: unset;
                aspect-ratio: 1 / 1;
                background-color: #fffa;
                position: relative;

                i {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }

            /deep/ .el-upload-list--picture-card {
                width: 100%;

                .el-upload-list__item {
                    margin: 5px;
                    border: none;
                    border-radius: .5rem;
                    height: unset;
                    width: @image-size;
                    aspect-ratio: 1/1;
                    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
                    background-color: #fffa;

                    &>div {
                        height: 100%;
                        width: 100%;
                    }
                }
            }

            .el-upload-list__item-thumbnail {
                object-fit: cover;
            }
        }

        &-choices {
            user-select: none;
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            margin-top: 1rem;
            padding-bottom: calc(constant(safe-area-inset-bottom) + 3rem);
            padding-bottom: calc(env(safe-area-inset-bottom) + 3rem);

            &-item {
                font-size: 1rem;
                line-height: 1;
                padding: 1.2rem 0.8rem;
                background-color: transparent;
                border: none;
                color: #333;
                border-top: 0.5px solid #efefef;
                display: flex;
                justify-content: space-between;
                align-items: center;


                .upload-content-choices-item-left {
                    font-size: 1rem;
                    line-height: 1;
                    display: flex;
                    align-items: center;

                    i {
                        font-size: 1.2rem;
                        margin-right: 1rem;
                    }

                }

                .upload-content-choices-item-right {
                    font-size: 1rem;
                    line-height: 1;
                    display: flex;
                    align-items: center;

                    i {
                        font-size: 1.2rem;
                        margin-left: .5rem;
                    }
                }

            }
        }
    }
}
</style>