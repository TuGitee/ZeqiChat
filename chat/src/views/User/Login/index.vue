<template>
  <div class="login">
    <angry-face ref="face" v-if="!isMobile"></angry-face>
    <div class="login-box">
      <h1 class="login-box-title no-select">登录</h1>
      <p class="no-account no-select" v-if="!isMobile"><i class="el-icon-warning-outline"></i> 没有账号? <a
          @click="$emit('changeChoice')" href="javascript:void(0);">点我注册</a></p>
      <el-form label-position="right" label-width="max-content" :model="form" :rules="rules" ref="Form"
        @keyup.enter.native="login" :show-message="false">
        <el-form-item prop="email" :label="isMobile ? '' : '邮箱'">
          <el-input type="email" v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="isMobile ? '' : '密码'" v-if="isPassword">
          <el-input :type="show ? 'text' : 'password'" clearable v-model="form.password" placeholder="请输入密码">
            <i slot="prefix" class="el-icon-view" @click="show = !show" :class="{ hidden: !show }"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha" :label="isMobile ? '' : '验证码'" v-else>
          <el-input v-model="form.captcha">
            <el-button slot="append" type="button" @click.prevent="getCaptcha" :disabled="seconds >= 0">{{ seconds >= 0
              ? `重新发送(${seconds}s)` : "获取验证码" }}</el-button></el-input>
        </el-form-item>

        <el-form-item prop="protocol" required>
          <el-checkbox v-model="form.protocol" label="protocol">您已阅读并同意<a href="https://tugitee.github.io/ZeqiChat/protocol" target="_blank">择栖Chat服务协议</a></el-checkbox>
        </el-form-item>

        <el-form-item>

          <el-button v-if="!isMobile" @click="isPassword = !isPassword">{{ isPassword ? "使用验证码登录" : "使用密码登录"
          }}</el-button>
          <div class="tool" v-if="isMobile">
            <p class="another-method" @click="isPassword = !isPassword">{{ isPassword ? "使用验证码登录" : "使用密码登录" }}</p>
            <p class="no-account"><i class="el-icon-warning-outline"></i> 没有账号? <a @click="$emit('changeChoice')">点我注册</a></p>
          </div>

          <el-button type="primary" class="form-button" id="login" @click="login">登录</el-button>
        </el-form-item>

      </el-form>


    </div>
  </div>
</template>

<script>
import { Input, Form, Button, FormItem, Checkbox } from 'element-ui';
import { mapState } from 'vuex'
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
        captcha: "",
        protocol: ['protocol']
      },
      isPassword: true,
      seconds: -1,
      timer: null,
      angerTimer: null,
      show: false
    };
  },
  methods: {
    login() {
      this.$refs.Form.validate((valid, error) => {
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
                this.$refs.face.handleError()
              }
            })
            .catch((error) => {
              this.$refs.face.handleError()
              console.log(error);
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
      this.$axios.get(`/api/login?email=${this.form.email}`)
    },
  },
  components: {
    [Input.name]: Input,
    [Form.name]: Form,
    [Button.name]: Button,
    [FormItem.name]: FormItem,
    [Checkbox.name]: Checkbox,
    AngryFace: ()=>import('@/components/AngryFace.vue')
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
        ],
        protocol: [
          { type: 'array', required: true, message: '请勾选同意协议', trigger: 'change' }
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
  border: 1px solid #ddd;
  border-radius: 10px;
  position: relative;
  width: 100%;
  height: fit-content;
  display: flex;
  backdrop-filter: blur(20px);
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 0 15px -5px #333;

  .el-input {
    /deep/ .el-input__inner {
      text-align: center;
      background-color: transparent;

      &::placeholder {
        user-select: none;
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

  .login-box {
    padding: 40px;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
    gap: 10px;

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

        /deep/ .el-form-item__label {
          user-select: none;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    /deep/ .el-input__prefix {
      width: 30px;
    }

  }

  @media screen and (max-width: 600px) {
    border: none !important;
    box-sizing: border-box;
    box-shadow: none !important;
    height: unset !important;
    margin-top: var(--safe-top);

    .login-box {
      .login-box-title {
        text-align: center;
        padding: 30px 0;
      }
    }

    .another-method {
      text-align: left;
      width: fit-content;
      color: #0080ff;
    }

    .form-button {
      margin-top: 20px;
      width: 100%;
      height: 42px;
    }

    .el-form-item {
      margin-bottom: 30px;

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

    .tool {
      display: flex;
      justify-content: space-between;
    }




  }
}
</style>