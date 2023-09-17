<template>
  <div class="register">
    <div class="register-emoji" v-if="!isMobile">
      <router-link to="/">
        <div class="face" :class="{ anger: isAnger }">
          <div class="eyes">
            <div class="eye"></div>
            <div class="eye"></div>
          </div>
          <transition name="el-fade-in-linear">
            <div class="shengqi" v-if="isAnger">💢</div>
          </transition>
        </div>
      </router-link>
    </div>
    <div class="register-box">
      <h1 class="register-box-title">注册</h1>
      <p class="has-account">已有账号? <a @click="$emit('changeChoice')" href="javascript:void(0);">点我登录</a></p>
      <el-form label-position="left" label-width="max-content" :model="form" :rules="rules" ref="Form"
        @keyup.enter.native="register">
        <el-row :gutter="20" width="100%" type="flex" class="row-bg" justify="space-between">
          <el-col :span="14">
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" width="100%" type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <el-form-item prop="password" label="密码">
              <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="repassword" label="确认密码">
              <el-input v-model="form.repassword" show-password>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row width="100%" type="flex" class="row-bg" justify="space-between">
          <el-form-item prop="captcha" label="验证码">
            <el-input v-model="form.captcha">
              <el-button slot="append" @click.prevent.stop="getCaptcha" :disabled="seconds >= 0">{{ seconds >= 0 ?
                `重新发送(${seconds}s)` : "获取验证码" }}</el-button>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row width="100%" type="flex" class="row-bg" justify="space-between">
          <el-form-item prop="avatar" label="头像" style="margin-left: 10px;">
            <el-upload class="avatar-uploader" action="#" :on-change="handleAvatarChange" :on-exceed="handleAvatarExceed"
              :limit="1" accept="image/*" name="image" :auto-upload="false" ref="upload">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="line-height: 1;">只能上传图片文件，且不超过2M</div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-button @click="resetForm" type="info">重置</el-button>
          <el-button type="primary" class="form-button" id="register" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Input, Form, Button, FormItem, Upload, Row, Col } from 'element-ui';
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
        ]
      },
      seconds: -1,
      timer: null,
      isAnger: false,
    }
  },
  methods: {
    handleMouseMove(e) {
      const eyes = document.querySelectorAll('.eye')

      eyes.forEach(eye => {
        const x = (eye.getBoundingClientRect().left) + (eye.clientWidth / 2)
        const y = (eye.getBoundingClientRect().top) + (eye.clientHeight / 2)
        const atan = Math.atan2(-(e.pageX - x), -(e.pageY - y))
        const rot = (atan * (180 / Math.PI) * -1) + 0
        eye.style.transform = `rotate(${rot + 90}deg)`
      })
    },

    handleError() {
      this.isAnger = true
      window.removeEventListener('mousemove', this.handleMouseMove)
      document.querySelectorAll('.eye').forEach((eye, index) => {
        eye.style.transition = 'all .5s'
        eye.style.transform = `rotate(${180 * (1 - index)}deg)`
      })
      setTimeout(() => {
        this.isAnger = false
        window.addEventListener('mousemove', this.handleMouseMove)
        document.querySelectorAll('.eye').forEach(eye => {
          eye.style.transition = 'none'
        })
      }, 1000);
    },
    getCaptcha() {
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!emailReg.test(this.form.email)) {
        this.$notify.warning({
          title: '警告',
          message: "邮箱格式不正确",
          offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
        })
        this.handleError()
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
        this.handleError()
      });
    },
    register() {
      this.$refs.Form.validate((valid) => {
        console.log(this.form);
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
                this.handleError()
              }
            })
            .catch((error) => {
              console.log(error);
              this.handleError()
            });
        } else {
          this.$notify.warning({
            title: '警告',
            message: "请填写完整",
            offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
          });
          this.handleError()
          return;
        }
      });
    },
    resetForm() {
      this.$refs.Form.resetFields()
      this.$refs.upload.clearFiles()
    },
    handleAvatarChange(file, fileList) {
      this.form.avatar = fileList[0].raw
    },
    handleAvatarExceed(files, fileList) {
      fileList.splice(0, 1, { uid: +new Date(), name: files[0].name, raw: files[0] })
      this.form.avatar = files[0]
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.handleMouseMove)
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.handleMouseMove)
  },
  components: {
    [Input.name]: Input,
    [Form.name]: Form,
    [Button.name]: Button,
    [FormItem.name]: FormItem,
    [Upload.name]: Upload,
    [Row.name]: Row,
    [Col.name]: Col,
  },
  computed: {
    ...mapState({
      isMobile: state => state.mobile.isMobile
    })
  }
};
</script>

<style scoped lang="less">
.register {
  @width: 400px;
  @height: fit-content;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: @width;
  height: @height;
  display: flex;
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 999;

  .register-emoji {
    background-color: white;
    height: 60px;
    width: 60px;
    position: absolute;
    top: 40px;
    right: 40px;
    border-radius: 50%;

    .face {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #f1c40f;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &:before {
        content: "";
        position: absolute;
        bottom: 18%;
        width: 50%;
        height: 10px;
        border-bottom-left-radius: 13px;
        border-bottom-right-radius: 13px;
        background-color: #b57700;
        transition: 0.5s;
      }

      &:hover {
        background: linear-gradient(180deg, #f44336, #ffcd00);

        &:before {
          height: 3px;
          bottom: 22.5%;
          background-color: #d35400;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      &.anger {
        background: linear-gradient(180deg, #e74c3c, #ff992c);

        &:before {
          height: 3px;
          bottom: 22.5%;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          background-color: #c0392b;
        }

      }

      .shengqi {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(25%, -25%);
        font-size: 20px;
      }

      .eyes {
        position: relative;
        top: -16%;
        display: flex;
        flex-wrap: wrap;

        .eye {
          position: relative;
          width: 20px;
          height: 20px;
          display: block;
          border-radius: 50%;
          background-color: white;
          margin: 0 0.1rem;
          transition: none !important;
          transform: rotate(-90deg);

          &:before {
            content: "";
            position: absolute;
            top: 50%;
            left: 5px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: black;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }

  .register-box {
    padding: 40px;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
    box-shadow: 0 0 15px -5px #333;
    border-radius: inherit;

    .register-box-title {
      font-size: 30px;
      font-weight: 700;
      text-align: left;
      margin-bottom: 22px;
    }

    .has-account {
      font-size: 14px;
      text-align: left;
      margin-bottom: 12px;

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
      &>.el-form-item {
        margin-bottom: 0;
      }
    }

    .el-form-item {
      width: 100%;
    }

    .el-input {
      /deep/ .el-input__inner {
        background-color: transparent;
      }
    }
  }

  @media screen and (max-width: 600px) {
    border: none !important;
    box-sizing: border-box;
    box-shadow: none !important;

    .register-box {
      gap: 10px;

      .register-box-title {
        margin-bottom: 0;
      }

      .has-account {
        margin-bottom: 0;
      }
    }
  }
}


#captcha {
  margin-right: 10px;
  width: 50px;
}
</style>