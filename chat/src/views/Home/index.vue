<template>
  <div class="border" id="border" @dragover.capture="dragover" @dragleave.capture="dragleave" @drop.capture="drop"
    :style="{ '--background-color': color }" @contextmenu.prevent.stop="handleContextMenu">
    <Header></Header>
    <div class="home">
      <SideBar class="home-side" v-if="!isMobile || !$route.name.includes('chat') && !$route.name.includes('post')" />
      <ul class="home-list"
        v-if="!isMobile || !$route.name.includes('chat') && !$route.name.includes('blog') && !$route.name.includes('post')">
        <li class="home-list-item home-list-header">
          <div class="home-list-tool" @click="checkRequest">
            <i :class="isCheckRequest ? 'el-icon-chat-round' : 'el-icon-connection'"></i>
            <i class="message" v-if="isRequest && !isCheckRequest || isCheckRequest && unread_count"></i>
          </div>
          <form action="#" @submit.prevent="submitUser">
            <i class="el-icon-zoom-in home-list-item-icon" v-if="isAdd" @click="isAdd = !isAdd" title="添加好友"></i>
            <i class="el-icon-search home-list-item-icon" @click="isAdd = !isAdd" title="搜索用户" v-else></i>
            <el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false"
              :placeholder="isAdd ? '添加好友' : '搜索好友'" @select="handleSelect" class="home-list-item-search" clearable
              :autofocus="isAdd">
              <template slot-scope="{ item }">
                <h1 class="username">{{ item.username }}</h1>
                <p class="email">{{ item.email }}</p>
              </template>

            </el-autocomplete>
            <input class="home-list-item-search-btn" type="submit" :value="isAdd ? '添加' : '查询'" />
          </form>
        </li>
        <UserItem v-for="user in friendList" :key="user.id" :user="user" @changeUser="changeUser" v-if="!isCheckRequest">
        </UserItem>

        <li class="home-list-item home-list-hr" v-if="isCheckRequest">好友请求</li>
        <RequestItem v-for="user in requestList" :key="user.request_id" :user="user"
          v-if="isCheckRequest && user.from_id != userId" @resolveUser="resolveUser" @rejectUser="rejectUser">
        </RequestItem>
        <li class="home-list-item no-request" v-if="isCheckRequest && !requestList.length">暂无好友请求</li>
        <li class="home-list-item home-list-hr" v-if="isCheckRequest">我的请求</li>
        <RequestItem v-for="user in sendList" :key="user.request_id" :user="user" v-if="isCheckRequest"></RequestItem>
        <li class="home-list-item no-request" v-if="isCheckRequest && !sendList.length">暂无好友请求</li>
        <li class="home-list-item loading" v-if="!friendList.length"><i class="el-icon-loading"></i> <span>正在加载中...</span>
        </li>
      </ul>
      <router-view v-if="server && userId" :isDrag="isDrag" :isChangeAvatar="isChangeAvatar" :onlineList="onlineList"
        :friendList="friendList" @cancelChangeAvatar="isChangeAvatar = false" @changeFriendlist="changeFriendlist"
        @changeUnread="changeUnread" :key="$route.path"></router-view>
    </div>
    <ColorChange v-if="!isMobile" :color="color" @changeColor="changeColor" />
  </div>
</template>

<script>

import { filterMessage, formatMessage } from '@/utils/message'
import UserItem from "./UserItem";
import RequestItem from "./RequestItem";
import { WebSocketType, WORLD_ID } from "@/ws";

import { Autocomplete } from 'element-ui'

import { debounceFun } from "@/utils/debounce";
import { mapState } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      isDrag: false,
      WORLD_ID,
      onlineList: [],
      mobileShow: false,
      isChangeAvatar: false,
      state: '',
      allUserList: [],
      friendList: [],
      requestList: [],
      sendList: [],
      isAdd: false,
      isCheckRequest: false,
      color: localStorage.getItem("color") || '#ff0000',
    }
  },
  components: {
    UserItem,
    RequestItem,
    [Autocomplete.name]: Autocomplete,
    SideBar: () => import("./SideBar"),
    ColorChange: () => import("@/components/ColorChange"),
    Header: () => import("./Header"),
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId,
      token: state => state.user.token,
      username: state => state.user.username,
      avatar: state => state.user.avatar,
      isMobile: state => state.mobile.isMobile,
      server: state => state.server.server
    }),
    url() {
      return URL.createObjectURL(this.file)
    },
    isRequest() {
      return this.requestList.some(item => item.accept == 0)
    },
    unread_count() {
      return this.friendList.reduce((a, b) => {
        return a + b.unread ? b.unread : 0
      }, 0)
    }
  },
  methods: {
    filterMessage,
    formatMessage,
    debounceFun,
    changeUnread(id, count = 1) {
      if (count == 0) {
        this.friendList.find(user => user.id == id).unread = 0
      } else {
        this.friendList.find(user => user.id == id).unread++
      }
    },
    handleContextMenu(e) {
      this.$store.commit('SET_STATE', {
        x: e.clientX,
        y: e.clientY,
        menuList: [
          {
            label: '刷新页面',
            command: 'refresh',
            icon: 'el-icon-refresh'
          },
          {
            label: '添加好友',
            command: 'add',
            icon: 'el-icon-user'
          }
        ],
        isShow: true
      })
    },
    changeColor(color) {
      this.color = color
      localStorage.setItem("color", color)
    },
    checkRequest() {
      this.isCheckRequest = !this.isCheckRequest
    },
    resolveUser(id) {
      this.requestList.find(item => item.request_id == id).accept = 1
      this.getFriend()
      this.server.emit(WebSocketType.FriendAccept, {
        to: this.requestList.find(item => item.request_id == id).from_id,
      })
    },
    rejectUser(id) {
      this.requestList.find(item => item.request_id == id).accept = -1
      this.server.emit(WebSocketType.FriendReject, {
        to: this.requestList.find(item => item.request_id == id).from_id,
      })
    },
    handleSelect(item) {
      this.state = item.username
    },
    async querySearchAsync(queryString, cb) {
      if (!queryString.trim()) return
      const debounce = this.debounceFun(async () => {
        if (this.isAdd) {
          const res = await this.$axios.get(`/api/user?key=${queryString}`)
          this.allUserList = res.data.data
          cb(this.allUserList)
        } else {
          cb(this.friendList.filter(item => item.username.includes(queryString)) || item.email.includes(queryString))
        }
      }, 100)
      debounce()
    },
    submitUser() {
      if (!this.state.trim()) return;
      let to;
      if (this.isAdd)
        to = this.allUserList.find(user => user.username === this.state)?.id
      else
        to = this.friendList.find(user => user.username === this.state)?.id
      if (!to) {
        this.$notify.error({
          title: '出错',
          message: "该用户不存在",
          offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
        })
        return
      }
      if (this.isAdd) {
        this.$axios.post('/api/friend', {
          from: this.token,
          to
        }).then(res => {
          this.getRequestFriend()
          this.getFriend()
          this.server.emit(WebSocketType.FriendRequest, {
            to
          })
          this.$notify.success({
            title: '成功',
            message: res.data.msg,
            offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
          })
        })
      }
      else {
        this.$router.replace({
          name: "chat",
          params: {
            id: to
          }
        })
        this.$nextTick(() => {
          setTimeout(() => {
            document.querySelector('.user.active')?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            })
          }, 300)
        })
      }
    },
    async getFriend() {
      let res = await this.$axios.get(`/api/friend?user=${this.token}`)
      this.friendList = res.data.data.sort((a, b) => {
        return new Date(b.last.create_time ?? '1970-01-01') - new Date(a.last.create_time ?? '1970-01-01')
      })
    },
    async getRequestFriend() {
      let res = await this.$axios.get(`/api/friend/request?user=${this.token}`)
      this.requestList = res.data.data.request.reverse()
      this.sendList = res.data.data.send.reverse()
    },
    dragover(e) {
      e.preventDefault()
      this.isDrag = true
    },
    dragleave(e) {
      e.preventDefault()
      this.isDrag = false
    },
    drop() {
      this.isDrag = false
    },
    changeUser(id) {
      if (this.isMobile) {
        this.$router.push({
          name: "chat",
          params: {
            id
          }
        })
      }
      else
        this.$router.replace({
          name: "chat",
          params: {
            id
          }
        })
    },
    changeFriendlist(id, last) {
      const index = this.friendList.findIndex(user => user.id == id)
      if (index == -1) return;
      const cur = this.friendList.splice(index, 1)
      cur[0].last = last
      this.friendList.unshift(cur[0])
    },
    async init() {
      await this.getFriend()
      this.getRequestFriend()

      window.addEventListener('resize', this.getMobile)

      this.server.emit(WebSocketType.GroupList);

      if (!this.isMobile) {
        if (this.$route.name === 'home') {
          this.$router.replace({
            name: "chat",
            params: {
              id: localStorage.getItem("to") ?? this.WORLD_ID
            }
          });
        }
      }
    },

    getMobile() {
      this.$store.dispatch('setMobile', window.innerWidth < 600)
    }
  },
  async created() {
    let res = await this.$axios.get(`/api/user/${localStorage.getItem('token')}`)

    this.$store.dispatch("login", {
      username: res.data.data.username,
      avatar: res.data.data.avatar,
      token: localStorage.getItem('token'),
      userId: res.data.data.id
    });

    this.$store.commit("SET_SERVER", `wss://zeqichat.xyz?token=${localStorage.getItem("token")}`)

    this.init();

    this.server.on(WebSocketType.GroupList, (data) => {
      let res = data.data;
      res = res.filter((item) => item.to == this.userId || item.id == this.WORLD_ID);
      res.reduce((a, b) => {
        if (a.findIndex(item => item.id == b.id) == -1) {
          a.push(b)
        }
        return a;
      }, []);
      this.onlineList = res;
    });

    this.$bus.$on('changeInfo', () => {
      this.isChangeAvatar = true
    })

    this.$bus.$on('mobileBack', () => {
      if (this.isMobile) {
        this.$router.replace("/home")
      }
    })

    this.$bus.$on('changeUser', (id) => {
      this.changeUser(id)
    })

    this.$bus.$on('changeAvatar', () => {
      this.isChangeAvatar = true
    })

    this.$bus.$on('addFriend', () => {
      this.isAdd = true
      this.isCheckRequest = true
    })

    this.server.on(WebSocketType.Error, (data) => {
      this.$store.dispatch('logout')
      this.$notify.error({
        title: 'Error',
        message: data.data,
        offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
      })
      this.$router.replace('/')
    })

    this.server.on(WebSocketType.FriendRequest, (data) => {
      this.getRequestFriend()
    })

    this.server.on(WebSocketType.FriendAccept, (data) => {
      this.friendList.unshift(data.data)
      this.sendList.find(item => item.to_id == data.id).accept = 1
    })

    this.server.on(WebSocketType.FriendReject, (data) => {
      this.sendList.find(item => item.to_id == data.id).accept = -1
    })

  },
  beforeDestroy() {
    this.server.disconnect();

  },
  watch: {
    onlineList() {
      this.friendList.forEach(item => {
        const index = this.onlineList.findIndex(user => user.id == item.id)
        if (index != -1) {
          item.online = true
        }
        else {
          item.online = false
        }
      })
      this.friendList.sort((a, b) => {
        if (a.online && !b.online) {
          return -1
        }
        else if (!a.online && b.online) {
          return 1
        }
        else {
          return 0
        }
      })
    },
  }
};
</script>

<style scoped lang="less">
.username {
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 16px;
  font-weight: bold;
  line-height: 2;
}

.email {
  font-size: 12px;
  color: #b4b4b4;
  line-height: 2;
  text-overflow: ellipsis;
  overflow: hidden;
}

.highlighted .email {
  color: #ddd;
}

.home::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.border {
  --bar-color: #fff;
  --BoarderTop: calc(50px + constant(safe-area-inset-top));
  --BoarderTop: calc(50px + env(safe-area-inset-top));
  --BoarderLeft: calc(0px + constant(safe-area-inset-left));
  --BoarderLeft: calc(0px + env(safe-area-inset-left));
  --background-color: #ff0000;
  height: 80%;
  width: 60%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: -99;
  color: white;
  background-color: var(--background-color);
  background-image:
    radial-gradient(at 40% 60%, hsla(200, 100%, 90%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 50%, hsla(326, 100%, 80%, 1) 0px, transparent 50%),
    radial-gradient(at 60% 40%, hsla(300, 100%, 80%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 70%, hsla(40, 100%, 80%, 1) 0px, transparent 50%),
    radial-gradient(at 10% 0%, hsla(80, 100%, 80%, 1) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(120, 100%, 80%, 1) 0px, transparent 50%),
    radial-gradient(at 20% 60%, hsla(245, 100%, 80%, 1) 0px, transparent 50%),
    radial-gradient(at 90% 90%, hsla(0, 100%, 80%, 1) 0px, transparent 50%);
  border-radius: 15px;
  min-width: 400px;
  min-height: 300px;
  resize: both;
  max-height: 100vh;
  max-width: 100vw;
  transition: none !important;
  overflow: hidden;

  .color {
    position: absolute;
    top: 10px;
    left: 39px;
    transform: translateX(-50%);
  }


}

.border::-webkit-resizer {
  display: none;
  visibility: hidden;
}

@media screen and (min-width: 600px) {
  .border {
    min-height: 500px;
    min-width: 800px;
  }
}

.border .border-title {
  position: absolute;
  left: 0;
  width: var(--BoarderLeft);
  text-align: center;
  line-height: 2;
  height: auto;
  white-space: break-all;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  font-size: calc(var(--BoarderLeft) * 0.6);
}

.border .home {
  border-radius: 10px;
  width: calc(100% - var(--BoarderLeft));
  height: calc(100% - var(--BoarderTop));
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  box-sizing: border-box;
  color: #333;
  word-break: break-word;
  gap: 10px;
}

.border .home::after {
  content: "";
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -99;
  background-size: cover;
}

.home-list {
  position: relative;
  padding: 0;
  margin: 0;
  height: 100%;
  list-style: none;
  width: 35%;
  padding: 0 10px 20px 5px;
  border-radius: 10px;
  overflow-y: overlay;
  min-width: 260px;
  max-width: 320px;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .home-list-item {
    width: 100%;
    height: 2rem;
    margin-bottom: .7rem;
    border-radius: inherit;
    overflow: hidden;
    position: sticky;
    top: 0;
    z-index: 9;
    display: flex;
    gap: 5px;


    &.home-list-header {
      backdrop-filter: blur(10px);
      z-index: 99;
    }

    .home-list-tool {
      height: 2rem;
      width: 2rem;
      margin-bottom: 0;
      right: 0;
      top: auto;
      line-height: 2rem;
      border-radius: inherit;
      background-color: #fffe;
      position: relative;

      &:hover {
        cursor: pointer;
        background-color: #fffe;
      }

      .message {
        height: 6px;
        width: 6px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: red;
        border-radius: 50%;
      }
    }

    &.home-list-hr {
      display: flex;
      align-items: center;
      margin: 20px 20px 0 10px;
      justify-content: flex-start;
      font-size: 1.2rem;
      width: fit-content;
      box-sizing: content-box;
      padding: .4rem 1.2rem;
      font-weight: bold;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        height: 50%;
        width: 5px;
        border-radius: 5px;
        left: 0;
        background-color: rgb(255, 31, 31);

      }
    }

    &.no-request {
      display: flex;
      pointer-events: none;
      color: #777;
      line-height: 14px;
      height: 14px;
      font-size: 14px;
      margin-top: 10px;
      justify-content: center;
      user-select: none;
    }

    form {
      display: flex;
      height: 100%;
      align-items: center;
      border-radius: inherit;
      position: relative;
      flex: 1;
      overflow: hidden;
      gap: 5px;

      .home-list-item-icon {
        position: absolute;
        z-index: 1;
        top: 50%;
        transform: translateY(-50%);
        width: 2rem;
        cursor: pointer;
      }

      .home-list-item-search {
        height: 100%;
        flex: 1;
        display: block;
        outline: none;
        border: none;
        background-color: #fffe;
        border-radius: 10px;

        /deep/ .el-input--suffix {
          height: 100%;

          .el-input__inner {
            padding: 0;
            border: none;
            height: 100%;
            line-height: 100%;
            padding-left: 2rem;
            padding-right: 2rem;
            border-radius: 10px;
          }
        }

        /deep/ .el-input__suffix {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .home-list-item-search-btn {
        display: block;
        width: 3rem;
        outline: none;
        border: none;
        background-color: #fffe;
        height: 100%;
        border-radius: 10px 0 0 10px;
        cursor: pointer;
        color: #333;
      }

    }

    &.loading {
      pointer-events: none;
      color: white;
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      padding: 20px;
      margin: auto;
      align-items: center;
      justify-content: center;
    }
  }
}

@media screen and (max-width: 600px) {
  .border {
    width: 100vw;
    height: 100vh;
    z-index: 999;
    min-width: 0;
    min-height: 0;
    max-height: 100vh;
    max-width: 100vw;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    top: 0;
    left: 0;
    border: none;
    background-color: transparent;
    background: transparent;
    resize: none;
    bottom: auto;
    right: auto;
    margin: 0;

    &::after {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      z-index: -999;
      background-color: #ff0000;
      background-image:
        radial-gradient(at 50% 0%, hsla(200, 100%, 90%, 1) 0px, transparent 50%),
        radial-gradient(at 50% 10%, hsla(326, 100%, 80%, 1) 0px, transparent 50%),
        radial-gradient(at 10% 40%, hsla(300, 100%, 80%, 1) 0px, transparent 50%),
        radial-gradient(at 0% 70%, hsla(40, 100%, 80%, 1) 0px, transparent 50%),
        radial-gradient(at 10% 0%, hsla(80, 100%, 80%, 1) 0px, transparent 50%),
        radial-gradient(at 100% 100%, hsla(120, 100%, 80%, 1) 0px, transparent 50%),
        radial-gradient(at 10% 90%, hsla(245, 100%, 80%, 1) 0px, transparent 50%),
        radial-gradient(at 90% 0%, hsla(0, 100%, 80%, 1) 0px, transparent 50%);
      filter: blur(10px);
      transform: scale(1.1);
    }
  }

  .border .border-title {
    display: none;
  }

  .border .home {
    width: 100%;
    height: calc(100vh - var(--BoarderTop));
    margin-top: var(--BoarderTop);
    box-sizing: border-box;
    flex-direction: column;
    border-radius: 0;
    border: none;
    overflow: hidden;
    position: static;
    background-color: white;

    .home-side {
      height: 55px;
      width: 100%;
      padding: 0;
      position: fixed;
      bottom: 0;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      z-index: 999;
      background-color: white;
      border-top: 0.1px solid #ccc;

      /deep/ .list {
        width: 100%;
        height: 100%;
        flex-direction: row;
        justify-content: space-evenly;
      }
    }
  }

  .border .home::after {
    content: "";
    display: none;
  }

  .border .home .home-list {
    width: 100%;
    height: calc(100% - 55px);
    padding: 0px 0px calc(20px + constant(safe-area-inset-bottom));
    padding: 0px 0px calc(20px + env(safe-area-inset-bottom));
    min-width: none;
    max-width: none;

    /deep/ .active {
      box-shadow: none;
    }
  }



  .home-list-item.home-list-header {
    backdrop-filter: blur(10px);
    z-index: 99;
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 5px;
    border-bottom: 0.1px solid #eee;
    border-radius: 0;
    box-sizing: content-box;
  }

  .home-list-tool {
    background-color: #eee !important;
    border-radius: 10px !important;
  }

  form {
    gap: 5px;
    border-radius: 10px !important;



    .home-list-item-search {
      background-color: #eee !important;
      border-radius: inherit !important;
    }

    .home-list-item-search-btn {
      background-color: #eee !important;
      border-radius: inherit !important;
    }
  }

}
</style>