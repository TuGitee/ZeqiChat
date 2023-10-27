<template>
  <div class="register">
    <angry-face ref="face" v-if="!isMobile"></angry-face>
    <div class="register-box">
      <h1 class="register-box-title no-select">注册</h1>
      <p class="has-account no-select"><i class="el-icon-warning-outline"></i> 已有账号? <a @click="$emit('changeChoice')"
          href="javascript:void(0);">点我登录</a></p>
      <el-form label-position="left" label-width="max-content" :model="form" :rules="rules" ref="Form"
        @keyup.enter.native="register" :show-message="false">

        <el-form-item prop="email" class="top">
          <el-input v-model="form.email" type="email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item prop="captcha">
          <el-input v-model="form.captcha" placeholder="请输入验证码">
            <el-button slot="append" @click.prevent.stop="getCaptcha" :disabled="seconds >= 0">{{ seconds >= 0 ?
              `重新发送(${seconds}s)` : "获取验证码" }}</el-button>
          </el-input>
        </el-form-item>

        <el-form-item prop="username" class="top">
          <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item prop="password">
          <el-input v-model="form.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item prop="repassword">
          <el-input v-model="form.repassword" show-password placeholder="请再次输入密码">
          </el-input>
        </el-form-item>



        <el-form-item prop="avatar" class="top">
          <el-upload class="avatar-uploader" action="#" :on-change="handleAvatarChange" :on-exceed="handleAvatarExceed"
            :show-file-list="false" :limit="1" accept="image/*" name="image" :auto-upload="false" ref="upload">
            <img class="avatar" :src="avatarURL" />
            <p slot="tip" class="el-upload__tip no-select">上传头像</p>
          </el-upload>
        </el-form-item>

        <el-form-item prop="protocol" style="margin-bottom: 0px;" required>
          <el-checkbox v-model="form.protocol" label="protocol">您已阅读并同意<a
              href="https://tugitee.github.io/ZeqiChat/protocol" target="_blank">择栖Chat服务协议</a></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="form-button" id="register" @click="register">注册</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { Input, Form, Button, FormItem, Upload, Row, Col, Checkbox } from 'element-ui';
import { mapState } from 'vuex'
export default {
  name: "Register",
  data() {
    return {
      form: {
        email: "",
        username: "",
        password: "",
        repassword: "",
        captcha: "",
        avatar: null,
        protocol: ['protocol']
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
        ],
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
        ],
        captcha: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 6, max: 6, message: "请输入6位验证码", trigger: ["blur", "change"] },
        ],
        protocol: [
          { type: 'array', required: true, message: '请勾选同意协议', trigger: 'change' }
        ]
      },
      seconds: -1,
      timer: null,
      isAnger: false,
    }
  },
  methods: {
    getCaptcha() {
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!emailReg.test(this.form.email)) {
        this.$notify.warning({
          title: '警告',
          message: "邮箱格式不正确",
          offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
        })
        this.$refs.face.handleError()
        return
      }
      this.seconds = 60
      this.timer = setInterval(() => {
        if (this.seconds < 0) {
          clearInterval(this.timer);
          return;
        }
        this.seconds--;
      }, 1000);
      this.$axios.post("/api/captcha",
        { email: this.form.email },
      ).catch((error) => {
        console.log(error);
        this.$refs.face.handleError()
      });
    },
    register() {
      this.$refs.Form.validate((valid, error) => {
        if (valid) {
          const formdata = new FormData();
          formdata.append("email", this.form.email);
          formdata.append("username", this.form.username);
          formdata.append("password", this.form.password);
          formdata.append("repassword", this.form.repassword);
          formdata.append("captcha", this.form.captcha);
          formdata.append("avatar", this.form.avatar);
          this.$axios
            .post("/api/user", formdata, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.data.ok === 1) {
                this.$notify.success({
                  title: '成功',
                  message: "注册成功",
                  offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                });
                this.$emit('changeChoice')
              } else {
                this.$notify.error({
                  title: '出错',
                  message: res.data.msg,
                  offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                });
                this.$refs.face.handleError()
              }
            })
            .catch((error) => {
              console.log(error);
              this.$refs.face.handleError()
            });
        } else {
          this.$notify.warning({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '<li>' + Object.entries(error).map(([a, b]) => {
              return b.map(_ => _.message).join(", ")
            }).join('</li><li>') + '</li>',
            offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
          });
          this.$refs.face.handleError()
          return;
        }
      });
    },
    handleAvatarChange(file, fileList) {
      this.form.avatar = fileList[0].raw
    },
    handleAvatarExceed(files, fileList) {
      fileList.splice(0, 1, { uid: +new Date(), name: files[0].name, raw: files[0] })
      this.form.avatar = files[0]
    }
  },
  components: {
    [Input.name]: Input,
    [Form.name]: Form,
    [Button.name]: Button,
    [FormItem.name]: FormItem,
    [Upload.name]: Upload,
    [Row.name]: Row,
    [Col.name]: Col,
    [Checkbox.name]: Checkbox,
    AngryFace: ()=> import('@/components/AngryFace.vue')
  },
  computed: {
    ...mapState({
      isMobile: state => state.mobile.isMobile
    }),
    avatarURL() {
      return this.form.avatar ? URL.createObjectURL(this.form.avatar) : 'https://zeqichat.xyz/images/default_avatar.png'
    }
  }
};
</script>

<style scoped lang="less">
.register {
  @height: fit-content;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 100%;
  height: @height;
  display: flex;
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 999;
  gap: 10px;
  box-shadow: 0 0 15px -5px #333;

  .form-button {
    width: 100%;
    height: 42px;
  }

  .register-box {
    padding: 40px;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
    border-radius: inherit;

    .register-box-title {
      font-size: 30px;
      font-weight: 700;
      text-align: left;
      margin-bottom: 12px;
    }

    .has-account {
      font-size: 14px;
      text-align: left;
      margin-bottom: 6px;

      a {
        color: #409eff;
      }
    }

    .el-row {
      max-width: unset;
    }

    /deep/ .el-input-group__append {

      .el-button {
        box-sizing: content-box;
      }
    }

    .el-form {
      .el-form-item {
        width: 100%;
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0px;
        }

        &.top {
          margin-top: 20px;
        }

        .el-upload {
          .avatar {
            border-radius: 50%;
            filter: drop-shadow(0 0 5px #dedede);
            object-fit: cover;
            height: 80px;
            width: 80px;
          }


        }

        /deep/ .el-upload__tip {
          line-height: 1;
        }
      }
    }



    .el-input {
      /deep/ .el-input__inner {
        background-color: transparent;

        &::placeholder {
          user-select: none;
        }
      }
    }


  }

  @media screen and (max-width: 600px) {
    border: none !important;
    box-sizing: border-box;
    box-shadow: none !important;
    height: unset !important;
    margin-top: var(--safe-top);

    .register-box {
      gap: 10px;

      .register-box-title {
        text-align: center;
        padding: 30px 0;
      }
    }

    .has-account {
      text-align: center !important;
    }

    .another-method {
      text-align: left;
      width: fit-content;
      color: #0080ff;
    }



    .el-form-item {
      margin-bottom: 20px !important;

      &.top {
        margin-top: 60px;
      }

      .el-input {

        /deep/ .el-input__inner {
          padding: 10px 40px;
          height: 45px;
          text-align: center;
          box-shadow: 2px 2px 20px -10px #888;
        }

        /deep/ .el-input__prefix,
        /deep/ .el-input__suffix {
          width: 30px;
          line-height: 45px;
        }

        /deep/ .el-input__prefix {
          left: 8px;
        }

        /deep/ .el-input__suffix {
          right: 8px;
        }

      }
    }


    .el-icon-view.hidden {
      position: relative;

      &::after {
        content: "";
        position: absolute;
        height: 100%;
        width: 1px;
        background-color: #C0C4CC;
        transform: rotate(45deg) translateX(-50%);
        left: 50%;
      }
    }


  }
}


#captcha {
  margin-right: 10px;
  width: 50px;
}</style>