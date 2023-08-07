<template>
  <div class="login">
    <div class="login-image"></div>
    <div class="login-box">
      <h1 class="login-box-title">登录</h1>
      <div class="login-box-form">
        <div>
          <label for="email">邮箱{{ isPassword ? '/用户名' : '' }}：</label>
          <input type="email" name="email" placeholder="email" id="email" v-model="email" />
        </div>
        <div v-if="isPassword">
          <label for="password">密码：</label>
          <input type="password" name="password" placeholder="password" id="password" v-model="password" />
          <button class="change" @click="isPassword = !isPassword">使用验证码登录</button>
        </div>
        <div v-else>
          <label for="captcha">验证码：</label>
          <input type="text" name="captcha" placeholder="captcha" id="captcha" v-model="captcha" />
          <button class="change" @click="getCaptcha" :disabled="seconds >= 0">{{ seconds >= 0 ?
            `重新发送(${seconds}s)` : "获取验证码" }}</button>
          <button class="change" @click="isPassword = !isPassword">使用密码登录</button>
        </div>
        <div>
          <input type="submit" class="form-button" value="登录" id="login" @click="login" />
        </div>
        <div>没有账号？<router-link to="/register">点我注册</router-link></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      captcha: "",
      isPassword: true,
      seconds: -1,
      timer: null
    };
  },
  methods: {
    login() {
      if (this.isPassword && (!this.email.trim() || !this.password.trim()) || !this.isPassword && (!this.email.trim() || !this.captcha.trim())) {
        alert("请填写完整");
        return;
      }
      const data = this.isPassword ? { email: this.email, password: this.password } : { email: this.email, captcha: this.captcha };
      this.$axios
        .post("/api/login", data)
        .then((res) => {
          if (res.data.ok === 1) {
            localStorage.setItem("username", res.data.username);
            localStorage.setItem("user", res.data.user);
            localStorage.setItem("avatar", res.data.avatar);
            localStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          } else {
            alert(res.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCaptcha() {
      this.seconds = 60
      this.timer = setInterval(() => {
        if (this.seconds < 0) {
          clearInterval(this.timer);
          return;
        }
        this.seconds--;
      }, 1000);
      this.$axios.get(`/api/login?email=${this.email}`)
    }
  },
  mounted() {
    if (this.$route.query.captcha) this.isPassword = false
    setTimeout(() => {
      this.email = this.$route.query.email ?? ''
      this.captcha = this.$route.query.captcha ?? ''

      if (this.captcha && this.email)
        setTimeout(() => {
          this.login()
        }, 1000);

    }, 500)
  }
};
</script>

<style scoped>
input {
  border-radius: 0;
}

button:disabled {
  filter: brightness(.8);
}

.login {
  border: 1px solid #ddd;
  border-radius: 10px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 800px;
  height: 350px;
  display: flex;
  overflow: hidden;
}

.login-image {
  background-color: #ffaf99;
  background-image:
    radial-gradient(at 16% 36%, hsla(60, 79%, 74%, 1) 0px, transparent 50%),
    radial-gradient(at 39% 0%, hsla(4, 70%, 76%, 1) 0px, transparent 50%),
    radial-gradient(at 94% 37%, hsla(246, 68%, 73%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 47%, hsla(166, 61%, 68%, 1) 0px, transparent 50%),
    radial-gradient(at 90% 68%, hsla(311, 64%, 65%, 1) 0px, transparent 50%),
    radial-gradient(at 60% 13%, hsla(112, 78%, 66%, 1) 0px, transparent 50%),
    radial-gradient(at 71% 16%, hsla(290, 63%, 67%, 1) 0px, transparent 50%);
  width: 40%;
  height: 100%;
  object-fit: cover;
}

.login-box {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.login-box-title {
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 20px;
  margin: 0;
}

.login-box-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  white-space: nowrap;
}

.login-box-form div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.login-box-form div label {
  width: fit-content;
  font-weight: 500;
}

.login-box-form div input {
  outline: none;
  border: none;
  border-bottom: 1px solid #000;
  flex: 1;
}

.login-box-form .form-button {
  flex: 1;
  height: 40px;
  border-radius: 10px;
  border: none;
  color: white;
  background-color: blueviolet;
}

.login-box-form .form-button:active {
  background-color: #eee;
  color: #000;
  cursor: pointer;
}

.change {
  border-radius: 10px;
  border: none;
  padding: 5px 10px;
  color: white;
  background-color: blueviolet;
}

@media screen and (max-width: 800px) {
  .login {
    width: 90%;
    height: 100%;
    border: none;
    box-sizing: border-box;
    padding: 20px;
    flex-direction: column;
    border-radius: 10px;
    margin-top: constant(safe-area-inset-top);
    margin-top: env(safe-area-inset-top);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }

  .login-image {
    width: 100%;
    height: 40%;
    border-radius: 10px;
  }

  .login-box {
    flex: 0;
    gap: 40px;
    width: 100%;
    height: 60%;
    padding: 20px;
  }

  .login-box-form {
    flex: 0;
    gap: 20px;
  }

  .login-box-form div label {
    width: fit-content;
  }

  .login-box-form div input {
    width: 100%;
    flex: 1;
  }

  .login-box-form .form-button {
    width: 100%;
  }
}
</style>