<template>
    <div class="upload">
        <div class="upload-content">
            <div class="upload-content-title">发送{{ isImage ? '图片' : '文件' }}</div>
            <div class="upload-content-msg">你确定要发送{{ isImage ? '图片' : '文件' }}吗？</div>
            <div class="upload-content-image" v-if="isImage"><img :src="url"></div>
            <div class="upload-content-file" v-else>
                <FileIcon :type="suffix"></FileIcon>
            </div>

            <div class="upload-content-file-name">{{ file.name }}</div>

            <div class="upload-content-btns">
                <button class="upload-content-btns-cancel" @click="cancel">取消</button>
                <button class="upload-content-btns-confirm" @click="confirm">确定</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Upload',
    props: {
        file: {
            type: File
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        confirm() {
            this.$emit('confirm')
        }
    },
    computed: {
        isImage() {
            return this.file.type.includes("image")
        },
        url() {
            return URL.createObjectURL(this.file)
        },
        suffix() {
            return this.file.name.split('.').pop().toLowerCase()
        },
        type() {
            switch (this.suffix) {
                case 'doc':
                case 'docx':
                case 'xls':
                case 'xlsx':
                case 'ppt':
                case 'pptx':
                case 'pdf':
                case 'txt':
                case 'zip':
                case 'csv':
                case 'ai':
                case 'psd':
                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'css':
                case 'htm':
                case 'html':
                case 'avi':
                case 'mp4':
                case 'dll':
                case 'waw':
                case 'mp3':
                case 'mp3':
                case 'wav':
                case 'wma':
                case 'aac':
                case 'ogg':
                case 'flac':
                case 'm4a':
                case 'json':
                case 'js':
                case 'jsp':
                case 'ts':
                case 'py':
                case 'md':
                    return this.suffix
                default:
                    return 'unknown'
            }
        }
    },
    components: {
        FileIcon: () => import('@/components/FileIcon')
    }
}
</script>

<style lang="less" scoped>
.upload {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    color: #333;

    &::after {
        position: fixed;
        content: "";
        inset: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: -1;
    }

    .upload-content {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        line-height: 1.5;
        display: flex;
        flex-direction: column;
        max-height: 80%;
        width: 90%;
        gap: 10px;

        .upload-content-title {
            font-size: 20px;
            font-weight: 700;
        }

        .upload-content-msg {
            font-size: 16px;
            font-weight: 400;
            text-align: center;
            margin: 10px 0;
        }

        .upload-content-image {
            object-fit: cover;
            border-radius: 10px;
            margin: 0 auto 20px;
            flex: 1;
            overflow: auto;

            img {
                width: 100%;
                height: 100%;
                max-height: fit-content;
                object-fit: cover;
                border-radius: 10px;
            }
        }

        .upload-content-btns {
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;

            button {
                margin: 0 10px;
                padding: 10px 20px;
                border-radius: 10px;
                border: none;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
            }

            .upload-content-btns-confirm {
                background-color: #3876b5;
                color: white;
            }
        }

        .upload-content-file {
            .icon {
                width: 100%;
            }
        }
    }
}
</style>