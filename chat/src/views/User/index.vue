<template>
  <div class="box">
    <keep-alive>
      <Game class="game" v-if="!isMobile"></Game>
    </keep-alive>
    <div class="user">
      <Transition name="fade" @enter="enter" @leave="leave">
        <Login class="login user-choice" v-if="isLogin" @changeChoice="changeChoice"></Login>
      </Transition>
      <Transition name="fade" @enter="enter" @leave="leave">
        <Register class="register user-choice" v-if="!isLogin" @changeChoice="changeChoice"></Register>
      </Transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "User",
  components: {
    Game: () => import('@/components/Game.vue'),
    Login: () => import('./Login'),
    Register: () => import('./Register')
  },
  computed: {
    ...mapState({
      isMobile: state => state.mobile.isMobile
    })
  },
  data() {
    return {
      isLogin: true,
    }
  },
  methods: {
    changeChoice() {
      this.isLogin = !this.isLogin
    },
    enter(el, done) {
      setTimeout(() => {
        done()
      }, 2000)

    },
    leave(el, done) {
      el.style.position = 'absolute'
      setTimeout(() => {
        done()
      }, 2000)
    }
  }

};
</script>

<style scoped lang="less">
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .game {
    width: 50%;
    height: 70%;
    border-radius: 20px;
    overflow: hidden;
    margin-right: -120px;
  }

  .user {
    position: relative;

    @keyframes fade-in {
      0% {
        transform: rotateY(0deg) translateX(-100%) translateZ(-100px) scale(.8);
        z-index: -9;
        opacity: 0;
      }

      50% {
        transform: rotateY(10deg) translateX(150px) scale(0.9);
        z-index: -9;
        opacity: 1;
      }

      100% {
        transform: rotateY(0deg) translateX(0) scale(1);
      }
    }

    @keyframes fade-out {
      0% {
        top: 50%;
        transform: rotateY(0deg) translateX(0) translateY(-50%) scale(1);
        z-index: -9;
      }

      50% {
        top: 50%;
        transform: rotateY(10deg) translateX(calc(150px + 100%)) translateY(-50%) scale(0.9);
        opacity: 1;
        z-index: -9;
      }

      100% {
        top: 50%;
        transform: rotateY(0deg) translateX(-100%) translateY(-50%) scale(0.6);
        z-index: -9;
        opacity: 0;
      }
    }

    @media screen and (max-width: 600px) {
      @keyframes fade-in {
        0% {
          transform: rotateY(0deg) translateX(-100%) translateZ(-100px) scale(.8);
          z-index: -9;
          opacity: 0;
        }

        100% {
          transform: rotateY(0deg) translateX(0) scale(1);
        }
      }

      @keyframes fade-out {
        0% {
          top: 0;
          transform: rotateY(0deg) translateX(0) scale(1);
          z-index: -9;
        }

        100% {
          top: 0;
          transform: rotateY(0deg) translateX(-100%) scale(0.6);
          z-index: -9;
          opacity: 0;
        }
      }
    }

    .fade-enter-active {
      animation: fade-in 2s forwards;
    }

    .fade-leave-active {
      animation: fade-out 2s forwards;
    }

  }

  @media screen and (max-width: 600px) {
    align-items: flex-start;
  }

}
</style>