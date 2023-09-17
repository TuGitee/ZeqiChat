<template>
  <div class="login">
    <div class="login-emoji" v-if="!isMobile">
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
    <div class="login-box">
      <h1 class="login-box-title">登录</h1>
      <p class="no-account">没有账号? <a @click="$emit('changeChoice')">点我注册</a></p>
      <el-form label-position="right" label-width="max-content" :model="form" :rules="rules" ref="Form"
        @keyup.enter.native="login">
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" @input.capture.stop.prevent.self></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="isPassword">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="captcha" label="验证码" v-else>
          <el-input v-model="form.captcha">
            <el-button slot="append" type="button" @click.prevent="getCaptcha" :disabled="seconds >= 0">{{ seconds >= 0
              ? `重新发送(${seconds}s)` : "获取验证码" }}</el-button></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="isPassword = !isPassword">{{ isPassword ? "使用验证码登录" : "使用密码登录" }}</el-button>
          <el-button type="primary" class="form-button" id="login" @click="login">登录</el-button>
        </el-form-item>

      </el-form>


    </div>
  </div>
</template>

<script>
import { Input, Form, Button, FormItem } from 'element-ui';
import { mapState } from 'vuex'
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
        captcha: "",
      },
      isPassword: true,
      seconds: -1,
      timer: null,
      isAnger: false,
      angerTimer: null,
    };
  },
  methods: {
    login() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const data = this.isPassword ? { email: this.form.email, password: this.form.password } : { email: this.form.email, captcha: this.form.captcha };
          this.$axios
            .post("/api/login", data)
            .then((res) => {
              if (res.data.ok === 1) {
                localStorage.setItem("token", res.data.token);
                this.$router.push("/home");
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
              this.handleError()
              console.log(error);
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
      this.$axios.get(`/api/login?email=${this.form.email}`)
    },

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
      clearTimeout(this.angerTimer)
      this.isAnger = true
      window.removeEventListener('mousemove', this.handleMouseMove)
      document.querySelectorAll('.eye').forEach((eye, index) => {
        eye.style.transition = 'all .5s'
        eye.style.transform = `rotate(${180 * (1 - index)}deg)`
      })
      this.angerTimer = setTimeout(() => {
        this.isAnger = false
        window.addEventListener('mousemove', this.handleMouseMove)
        document.querySelectorAll('.eye').forEach(eye => {
          eye.style.transition = 'none'
        })
      }, 1000);
    },
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
  },
  computed: {
    rules() {
      return {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { type: this.isPassword ? 'string' : 'email', message: this.isPassword ? '请输入正确的邮箱/用户名' : '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: this.isPassword, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: !this.isPassword, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位验证码', trigger: ['blur', 'change'] }
        ]
      }
    },
    ...mapState({
      isMobile: state => state.mobile.isMobile
    })
  }
};
</script>

<style scoped lang="less">
.login {
  @width: 400px;
  border: 1px solid #ddd;
  border-radius: 10px;
  position: relative;
  width: @width;
  height: 50%;
  display: flex;
  backdrop-filter: blur(20px);
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 0 15px -5px #333;

  .el-input {
    /deep/ .el-input__inner {
      background-color: transparent;
    }
  }

  .login-emoji {
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

  .login-box {
    padding: 40px;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;

    .login-box-title {
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 20px;
      margin: 0;
      text-align: left;
    }

    .no-account {
      text-align: left;
      font-size: 14px;

      a {
        color: #409eff;
      }
    }

    /deep/ .el-input-group__append {

      .el-button {
        box-sizing: content-box;
      }
    }

    .el-form {
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

  }

  @media screen and (max-width: 600px) {
    border: none !important;
    box-sizing: border-box;
    box-shadow: none !important;
    height: unset !important;

    .login-box {
      gap: 10px;
    }
  }
}
</style>