<template>
    <div class="change-avatar">
        <div class="change-avatar-content">
            <div class="change-avatar-content-title">更改信息</div>
            <div class="change-avatar-content-body">
                <div class="change-avatar-content-body-item">
                    <div class="change-avatar-content-body-item-title">头像</div>
                    <div class="change-avatar-content-body-item-content">
                        <div class="change-avatar-content-body-item-content-avatar">
                            <img :src="`http://47.120.2.219:3000${avatar}`" v-if="!file" alt="404 Not Found..."
                                class="change-avatar-content-body-item-content-avatar-img">
                            <img v-else :src="url" alt="404 Not Found..."
                                class="change-avatar-content-body-item-content-avatar-img" @click="ResetPhoto" />
                        </div>
                        <div class="change-avatar-content-body-item-content-file">
                            <input type="file" id="file" accept="image/*"
                                class="change-avatar-content-body-item-content-file-input" @change="uploadPhoto">
                            <label for="file" class="change-avatar-content-body-item-content-file-label">选择图片</label>
                        </div>
                    </div>
                </div>
                <div class="change-avatar-content-body-item">
                    <div class="change-avatar-content-body-item-title">用户名</div>
                    <div class="change-avatar-content-body-item-content">
                        <input type="text" class="change-avatar-content-body-item-content-input" v-model="username">
                    </div>
                </div>
            </div>
            <div class="change-avatar-content-footer">
                <div class="change-avatar-content-footer-btn change-avatar-content-footer-btn__cancel" @click="cancel">取消
                </div>
                <div class="change-avatar-content-footer-btn change-avatar-content-footer-btn__confirm" @click="confirm">确定
                </div>
            </div>
        </div>
        <div class="box" v-if="loading">
            <span>修改信息中...</span>
            <div class="loader">
                <div class="loader__bar"></div>
                <div class="loader__bar"></div>
                <div class="loader__bar"></div>
                <div class="loader__bar"></div>
                <div class="loader__bar"></div>
                <div class="loader__ball"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChangeAvatar',
    data() {
        return {
            loading: false,
            file: null,
            username: "",
        }
    },
    computed: {
        avatar() {
            return localStorage.getItem("avatar")
        },
        url() {
            return URL.createObjectURL(this.file)
        }
    },
    methods: {
        uploadPhoto(e) {
            this.file = e.target.files[0]
            e.target.value = ''
        },
        ResetPhoto() {
            this.file = null
        },
        cancel() {
            this.$emit("cancel")
        },
        async confirm() {
            this.loading = true
            const formdata = new FormData();
            formdata.append("token", localStorage.getItem("token"));
            formdata.append("username", this.username);
            formdata.append("avatar", this.file);
            let res = await this.$axios.put("/api/user", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.data.ok) {
                localStorage.setItem("username", res.data.username);
                localStorage.setItem("avatar", res.data.avatar);
                localStorage.setItem("token", res.data.newToken);
                this.$router.go(0)
            } else {
                alert(res.data.msg);
            }
            this.loading = false
            this.$emit("cancel")
        }
    },
    mounted() {
        this.username = localStorage.getItem("username")
    }
}
</script>

<style lang="less" scoped>
.box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0005;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
}

.loader {
    position: relative;
    width: 75px;
    height: 100px;
}

.loader__bar {
    position: absolute;
    bottom: 0;
    width: 10px;
    height: 50%;
    background: var(--bar-color);
    transform-origin: center bottom;
    box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
}

.loader__bar:nth-child(1) {
    left: 0;
    transform: scale(1, 0.2);
    animation: barUp1 4s infinite;
}

.loader__bar:nth-child(2) {
    left: 15px;
    transform: scale(1, 0.4);
    animation: barUp2 4s infinite;
}

.loader__bar:nth-child(3) {
    left: 30px;
    transform: scale(1, 0.6);
    animation: barUp3 4s infinite;
}

.loader__bar:nth-child(4) {
    left: 45px;
    transform: scale(1, 0.8);
    animation: barUp4 4s infinite;
}

.loader__bar:nth-child(5) {
    left: 60px;
    transform: scale(1, 1);
    animation: barUp5 4s infinite;
}

.loader__ball {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 10px;
    height: 10px;
    background: var(--bar-color);
    border-radius: 50%;
    animation: ball 4s infinite;
}

@keyframes ball {
    0% {
        transform: translate(0, 0);
    }

    5% {
        transform: translate(8px, -14px);
    }

    10% {
        transform: translate(15px, -10px);
    }

    17% {
        transform: translate(23px, -24px);
    }

    20% {
        transform: translate(30px, -20px);
    }

    27% {
        transform: translate(38px, -34px);
    }

    30% {
        transform: translate(45px, -30px);
    }

    37% {
        transform: translate(53px, -44px);
    }

    40% {
        transform: translate(60px, -40px);
    }

    50% {
        transform: translate(60px, 0);
    }

    57% {
        transform: translate(53px, -14px);
    }

    60% {
        transform: translate(45px, -10px);
    }

    67% {
        transform: translate(37px, -24px);
    }

    70% {
        transform: translate(30px, -20px);
    }

    77% {
        transform: translate(22px, -34px);
    }

    80% {
        transform: translate(15px, -30px);
    }

    87% {
        transform: translate(7px, -44px);
    }

    90% {
        transform: translate(0, -40px);
    }

    100% {
        transform: translate(0, 0);
    }
}

@keyframes barUp1 {
    0% {
        transform: scale(1, 0.2);
    }

    40% {
        transform: scale(1, 0.2);
    }

    50% {
        transform: scale(1, 1);
    }

    90% {
        transform: scale(1, 1);
    }

    100% {
        transform: scale(1, 0.2);
    }
}

@keyframes barUp2 {
    0% {
        transform: scale(1, 0.4);
    }

    40% {
        transform: scale(1, 0.4);
    }

    50% {
        transform: scale(1, 0.8);
    }

    90% {
        transform: scale(1, 0.8);
    }

    100% {
        transform: scale(1, 0.4);
    }
}

@keyframes barUp3 {
    0% {
        transform: scale(1, 0.6);
    }

    100% {
        transform: scale(1, 0.6);
    }
}

@keyframes barUp4 {
    0% {
        transform: scale(1, 0.8);
    }

    40% {
        transform: scale(1, 0.8);
    }

    50% {
        transform: scale(1, 0.4);
    }

    90% {
        transform: scale(1, 0.4);
    }

    100% {
        transform: scale(1, 0.8);
    }
}

@keyframes barUp5 {
    0% {
        transform: scale(1, 1);
    }

    40% {
        transform: scale(1, 1);
    }

    50% {
        transform: scale(1, 0.2);
    }

    90% {
        transform: scale(1, 0.2);
    }

    100% {
        transform: scale(1, 1);
    }
}

::-webkit-scrollbar {
    width: 5px;
    height: 10px;
}

.change-avatar {
    position: absolute;
    inset: 0;
    margin: auto;
    z-index: 10;
    width: 60%;
    height: fit-content;
    color: #333;
    overflow: hidden;
}

.change-avatar::after {
    position: fixed;
    content: "";
    inset: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
}

.change-avatar .change-avatar-content {
    padding: 30px 20px 50px 20px;
    border-radius: 10px;
    background-color: white;
}

.change-avatar .change-avatar-content .change-avatar-content-title {
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px 10px;
    background-color: #3876b5;
    color: white;
    border-radius: 0 0 10px 0;
}

.change-avatar .change-avatar-content .change-avatar-content-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item .change-avatar-content-body-item-title {
    font-weight: bold;
    padding-bottom: 20px;
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item .change-avatar-content-body-item-content {
    display: flex;
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item .change-avatar-content-body-item-content .change-avatar-content-body-item-content-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
    position: relative;

    &:hover {
        filter: brightness(.6);

        &::after {
            content: "Reset";
            color: white;
            position: absolute;
            font-weight: bold;
            pointer-events: none;
            filter: brightness(100);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item .change-avatar-content-body-item-content .change-avatar-content-body-item-content-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item .change-avatar-content-body-item-content .change-avatar-content-body-item-content-file {
    border-radius: 5px;
    background-color: #3876b5;
    display: inline-block;
    vertical-align: middle;
    margin-left: 20px;
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item .change-avatar-content-body-item-content .change-avatar-content-body-item-content-file input {
    display: none;
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item .change-avatar-content-body-item-content .change-avatar-content-body-item-content-file label {
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
    color: white;
    text-align: center;
    white-space: nowrap;
    line-height: 30px;
    padding: 10px 20px;
}

.change-avatar .change-avatar-content .change-avatar-content-body .change-avatar-content-body-item .change-avatar-content-body-item-content .change-avatar-content-body-item-content-input {
    width: 100%;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    display: inline-block;
    vertical-align: middle;
}

.change-avatar .change-avatar-content .change-avatar-content-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
}

.change-avatar .change-avatar-content .change-avatar-content-footer .change-avatar-content-footer-btn {
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    margin-left: 10px;
}

.change-avatar .change-avatar-content .change-avatar-content-footer .change-avatar-content-footer-btn.change-avatar-content-footer-btn__cancel {
    background-color: #ccc;
}

.change-avatar .change-avatar-content .change-avatar-content-footer .change-avatar-content-footer-btn.change-avatar-content-footer-btn__cancel:hover {
    background-color: #ff5e5e;
}

.change-avatar .change-avatar-content .change-avatar-content-footer .change-avatar-content-footer-btn.change-avatar-content-footer-btn__cancel:active {
    background-color: #ff0000;
}

.change-avatar .change-avatar-content .change-avatar-content-footer .change-avatar-content-footer-btn.change-avatar-content-footer-btn__confirm {
    background-color: #3876b5;
}

.change-avatar .change-avatar-content .change-avatar-content-footer .change-avatar-content-footer-btn.change-avatar-content-footer-btn__confirm:hover {
    background-color: #459c55;
}

.change-avatar .change-avatar-content .change-avatar-content-footer .change-avatar-content-footer-btn.change-avatar-content-footer-btn__confirm:active {
    background-color: #19d687;
}

@media screen and (max-width: 480px) {
    .change-avatar {
        width: 80%;
    }
}
</style>