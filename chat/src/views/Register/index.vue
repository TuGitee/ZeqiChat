<template>
  <div class="register">
    <div class="register-image"></div>
    <div class="register-box">
      <h1 class="register-box-title">注册</h1>
      <div class="register-box-form">
        <div>
          <label for="email">邮箱：</label>
          <input type="email" name="email" placeholder="email" id="email" v-model="email" />
        </div>
        <div>
          <label for="username">用户名：</label>
          <input type="text" name="username" placeholder="username" id="username" v-model="username" />
        </div>
        <div>
          <label for="password">密码：</label>
          <input type="password" name="password" placeholder="password" id="password" v-model="password" />
        </div>
        <div>
          <label for="password2">确认密码：</label>
          <input type="password" name="repassword" placeholder="repassword" id="repassword" v-model="repassword" />
        </div>
        <div>
          <label for="captcha">验证码：</label>
          <input type="text" name="captcha" placeholder="captcha" id="captcha" v-model="captcha" />
          <button class="form-button" id="CaptchaButton" @click="getCaptcha" :disabled="seconds >= 0">{{ seconds >= 0 ?
            `重新发送(${seconds}s)` : "获取验证码" }}</button>
        </div>
        <div>
          <label for="avatar">头像：</label>
          <input type="file" accept="image/*,image/gif" name="avatar" id="avatar" @change="uploadAvatar" />
        </div>
        <div>
          <input type="submit" class="form-button" value="注册" id="register" @click="register" />
        </div>
        <div>已有帐号？<router-link to="/login">点我登录</router-link></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      repassword: "",
      captcha: "",
      avatar: null,
      seconds: -1,
      timer: null
    }
  },
  methods: {
    getCaptcha() {
      if (!this.email.trim()) {
        alert("请填写邮箱");
        return;
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
        { email: this.email },
      ).catch((error) => {
        console.log(error);
      });
    },
    uploadAvatar(e) {
      this.avatar = e.target.files[0];
    },
    register() {
      if (
        !this.email.trim() ||
        !this.username.trim() ||
        !this.password.trim() ||
        !this.repassword.trim() ||
        !this.captcha.trim()
      ) {
        alert("请填写完整");
        return;
      }
      const formdata = new FormData();
      formdata.append("email", this.email);
      formdata.append("username", this.username);
      formdata.append("password", this.password);
      formdata.append("repassword", this.repassword);
      formdata.append("captcha", this.captcha);
      formdata.append("avatar", this.avatar);
      this.$axios
        .post("/api/user", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.ok === 1) {
            alert("注册成功");
            this.$router.push('/login')
          } else {
            alert(res.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
};
</script>

<style scoped>
input {
  border: none;
  border-radius: 0;
}

.register {
  border: 1px solid #ddd;
  border-radius: 10px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 800px;
  height: 500px;
  display: flex;
  overflow: hidden;
}

.register-image {
  background-color: #dd99ff;
  background-image:
    radial-gradient(at 42% 29%, hsla(241, 72%, 67%, 1) 0px, transparent 50%),
    radial-gradient(at 49% 23%, hsla(319, 69%, 70%, 1) 0px, transparent 50%),
    radial-gradient(at 41% 16%, hsla(130, 72%, 68%, 1) 0px, transparent 50%),
    radial-gradient(at 45% 79%, hsla(250, 99%, 65%, 1) 0px, transparent 50%),
    radial-gradient(at 77% 87%, hsla(87, 66%, 63%, 1) 0px, transparent 50%),
    radial-gradient(at 95% 4%, hsla(350, 62%, 78%, 1) 0px, transparent 50%),
    radial-gradient(at 63% 44%, hsla(144, 92%, 64%, 1) 0px, transparent 50%);
  width: 40%;
  height: 100%;
  object-fit: cover;
}

.register-box {
  flex: 1;
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.register-box-title {
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 20px;
  margin: 0;
}

.register-box-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.register-box-form div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-box-form div label {
  width: 100px;
  font-weight: 500;
}

.register-box-form div:nth-last-child(n + 3) input {
  outline: none;
  border: none;
  flex: 1;
}

.register-box-form div:nth-last-child(n + 4) input {
  border-bottom: 1px solid #000;
}

.register-box-form .form-button {
  flex: 1;
  height: 30px;
  border-radius: 10px;
  border: none;
  color: white;
  background-color: blueviolet;

}

.register-box-form .form-button:disabled {
  pointer-events: none;
  cursor: not-allowed;
  filter: brightness(.8);
}

.register-box-form .form-button:active {
  background-color: #eee;
  color: #000;
  cursor: pointer;
}

#captcha {
  margin-right: 10px;
  width: 50px;
}

@media screen and (max-width: 800px) {
  .register {
    width: 90%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    flex-direction: column;
    border: none;
    margin-top: constant(safe-area-inset-top);
    margin-top: env(safe-area-inset-top);
    gap: 30px;
    justify-content: center;
    align-items: center;
  }

  .register-image {
    width: 100%;
    height: 40%;
    border-radius: 10px;
  }

  .register-box {
    width: 100%;
    height: 60%;
    padding: 20px;
    flex: 0;
    gap: 30px;
  }

  .register-box-form {
    flex: 0;
    gap: 20px;
  }

  .register-box-form div label {
    width: fit-content;
    font-weight: 500;
  }

  .register-box-form div:nth-last-child(n + 3) input {
    outline: none;
    border: none;
    flex: 1;
  }

  .register-box-form div:nth-last-child(n + 4) input {
    border-bottom: 1px solid #000;
  }

  .register-box-form .form-button {
    flex: 1;
    height: 30px;
    border-radius: 10px;
    border: none;
    color: white;
    background-color: blueviolet;
    width: 5rem;
  }

  .register-box-form .form-button:active {
    background-color: #eee;
    color: #000;
    cursor: pointer;
  }
}
</style>