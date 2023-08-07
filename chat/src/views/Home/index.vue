<template>
  <div class="border" id="border" @dragover.capture="dragover" @dragleave.capture="dragleave" @drop.capture="drop">
    <div class="border-title">择栖聊天室</div>
    <div class="border-hello">你好，<span v-html="formatMessage(removeSlash(username))"></span></div>
    <div class="home">
      <ul class="home-list">
        <li class="home-list-item">
          <div class="home-list-tool" @click="checkRequest">
            <i :class="isCheckRequest ? 'el-icon-chat-round' : 'el-icon-connection'"></i>
          </div>
          <form :action="false">
            <i class="el-icon-zoom-in home-list-item-icon" v-if="isAdd" @click="isAdd = !isAdd" title="添加好友"></i>
            <i class="el-icon-search home-list-item-icon" @click="isAdd = !isAdd" title="搜索用户" v-else></i>
            <el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync" :placeholder="isAdd ? '添加好友' : '搜索好友'"
              @select="handleSelect" class="home-list-item-search" clearable>
              <template slot-scope="{ item }">
                <h1 class="username">{{ item.username }}</h1>
                <p class="email">{{ item.email }}</p>
              </template>

            </el-autocomplete>
            <input class="home-list-item-search-btn" type="submit" :value="isAdd ? '添加' : '查询'" @click="submitUser" />
          </form>
        </li>
        <UserItem v-for="user in friendList" :key="user.id" :user="user" @changeUser="changeUser" :to="to"
          v-if="!isCheckRequest"></UserItem>
        <li class="home-list-item home-list-hr" v-if="isCheckRequest">好友请求</li>
        <RequestItem v-for="user in requestList" :key="user.request_id" :user="user"
          v-if="isCheckRequest && user.from_id != userId" @resolveUser="resolveUser" @rejectUser="rejectUser">
        </RequestItem>
        <li class="home-list-item home-list-hr" v-if="isCheckRequest">我的请求</li>
        <RequestItem v-for="user in sendList" :key="user.request_id" :user="user" v-if="isCheckRequest"></RequestItem>

      </ul>
      <router-view :server="server" :unread_msg="unread_msg" :isDrag="isDrag" :isChangeAvatar="isChangeAvatar"
        :onlineList="onlineList" :friendList="friendList" :isMobile="isMobile"
        @cancelChangeAvatar="isChangeAvatar = false" @changeOnlinelist="changeOnlinelist"></router-view>
    </div>
  </div>
</template>

<script>
import { io } from "@/utils/socketio.js";

import { removeSlash, formatMessage } from '@/utils/message'
import UserItem from "./UserItem";
import RequestItem from "./RequestItem";
import { WebSocketType } from "@/ws/index";

import { Autocomplete } from 'element-ui'

export default {
  name: "Home",
  data() {
    return {
      isDrag: false,
      to: 2023,
      WorldID: 2023,
      server: io(`ws://47.120.2.219:8080?token=${localStorage.getItem("token")}`),
      onlineList: [],
      mobileShow: false,
      unread_msg: 0,
      isChangeAvatar: false,
      isMobile: window.innerWidth < 600,
      state: '',
      allUserList: [],
      friendList: [],
      requestList: [],
      sendList: [],
      isAdd: true,
      isCheckRequest: false,
    }
  },
  components: {
    UserItem,
    RequestItem,
    ElAutocomplete: Autocomplete,
  },
  computed: {
    userId() {
      return localStorage.getItem("user");
    },
    token() {
      return localStorage.getItem("token");
    },
    username() {
      return localStorage.getItem("username");
    },
    url() {
      return URL.createObjectURL(this.file)
    }
  },
  methods: {
    removeSlash,
    formatMessage,
    checkRequest() {
      this.isCheckRequest = !this.isCheckRequest
    },
    resolveUser(id) {
      this.requestList.find(item => item.request_id == id).accept = 1
      this.getFriend()
    },
    rejectUser(id) {
      this.requestList.find(item => item.request_id == id).accept = -1
    },
    async loadAll() {
      const res = await this.$axios.get('/api/user')
      this.allUserList = res.data.data
    },
    handleSelect(item) {
      this.state = item.username
    },
    async querySearchAsync(queryString, cb) {
      console.log(this.friendList);
      const ls = queryString ? (this.isAdd ? this.allUserList.filter(item => item.username.includes(queryString) || item.email.includes(queryString)) : this.friendList.filter(item => item.username.includes(queryString)) || item.email.includes(queryString)) : []
      cb(ls)
    },
    submitUser() {
      if (!this.state.trim()) return;
      let to;
      if (this.isAdd)
        to = this.allUserList.find(user => user.username === this.state)?.id
      else
        to = this.friendList.find(user => user.username === this.state)?.id
      if (!to) {
        alert("该用户不存在")
        return
      }
      if (this.isAdd) {
        this.$axios.post('/api/friend', {
          from: this.token,
          to
        }).then(res => {
          this.getRequestFriend()
          this.getFriend()
          alert(res.data.msg)
        })
      }
      else {
        this.to = to
        this.$router.replace({
          name: "chat",
          params: {
            id: to
          }
        })
        this.$nextTick(() => {
          document.querySelector('.user.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
        })
      }
    },
    async getFriend() {
      let res = await this.$axios.get(`/api/friend?user=${this.token}`)
      this.friendList = res.data.data
    },
    async getRequestFriend() {
      let res = await this.$axios.get(`/api/friend/request?user=${this.token}`)
      this.requestList = res.data.data.request
      this.sendList = res.data.data.send
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
    async changeUser(id) {

      if (id === null) return;

      if (this.to == id && id == this.userId && !this.isMobile) {
        this.isChangeAvatar = true
        return;
      }

      if (this.to === id && !this.isMobile) return;
      this.to = id

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
    changeOnlinelist(id, last) {
      const cur = this.onlineList.splice(this.onlineList.findIndex(user => user.id == id), 1)
      cur[0].last = last
      this.onlineList = [...cur, ...this.onlineList]
    },
    async init() {
      this.server.emit(WebSocketType.GroupList);
      await this.loadAll()
      await this.getFriend()
      await this.getRequestFriend()

      window.addEventListener('resize', this.getMobile)

      if (localStorage.getItem("to")) {
        this.to = localStorage.getItem("to");
      }

      if (!this.isMobile) {
        this.$router.replace({
          name: "chat",
          params: {
            id: localStorage.getItem("to") ?? this.WorldID
          }
        });
      }
    },

    getMobile() {
      this.isMobile = window.innerWidth < 600
    }
  },
  mounted() {
    this.server.on(WebSocketType.GroupList, (data) => {
      let res = data.data;
      res = res.filter((item) => item.to == this.userId || item.id == this.WorldID);
      res.reduce((a, b) => {
        if (a.findIndex(item => item.id == b.id) == -1) {
          a.push(b)
        }
        return a;
      }, []);
      this.onlineList = res;
    });

    this.init();

  },
  beforeDestroy() {
    this.server.disconnect();
    window.indexedDB.deleteDatabase("chat");
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
    }
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


.border {
  --bar-color: #fff;
  --BoarderTop: calc(30px + constant(safe-area-inset-top));
  --BoarderTop: calc(30px + env(safe-area-inset-top));
  --BoarderLeft: calc(30px + constant(safe-area-inset-left));
  --BoarderLeft: 30px;
}

.home::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.border {
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
  background-color: hsla(0, 100%, 50%, 1);
  background-image:
    radial-gradient(at 40% 20%, hsla(28, 100%, 74%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%),
    radial-gradient(at 61% 48%, hsla(340, 100%, 76%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 1) 0px, transparent 50%);
  border-radius: 15px;
  min-width: 400px;
  min-height: 300px;
  resize: both;
  max-height: 100vh;
  max-width: 100vw;
  transition: none;
  overflow: hidden;
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
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  font-size: calc(var(--BoarderLeft) * 0.6);
}

.border .border-hello {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: var(--BoarderTop);
  line-height: var(--BoarderTop);
  font-weight: bold;
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
  justify-content: space-between;
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
  width: 30%;
  border-radius: 10px;
  overflow-y: overlay;

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

    .home-list-tool {
      height: 2rem;
      width: 2rem;
      margin-bottom: 0;
      right: 0;
      top: auto;
      line-height: 2rem;
      border-radius: inherit;
      background-color: #fffe;

      &:hover {
        cursor: pointer;
        background-color: #fffe;
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

    form {
      display: flex;
      height: 100%;
      align-items: center;
      border-radius: inherit;
      position: relative;
      flex: 1;
      background-color: #fffd;
      overflow: hidden;

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
        background-color: transparent;

        /deep/ .el-input--suffix {
          height: 100%;

          .el-input__inner {
            padding: 0;
            border: none;
            background-color: transparent;
            height: 100%;
            line-height: 100%;
            padding-left: 2rem;
            padding-right: 2rem;
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
  }
}

@media screen and (max-width: 600px) {
  .border {
    width: 100%;
    height: 100%;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    min-width: 0;
    min-height: 0;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    position: static;
    border: none;
    background-color: transparent;
    background: transparent;
    height: 100vh;
  }

  .border::after {
    content: "";
    height: 100%;
    width: 100%;
    position: fixed;
    inset: 0;
    z-index: -99;
    background-color: hsl(0, 100%, 50%);
    background-image: radial-gradient(at 40% 20%, hsl(28, 100%, 74%) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(355, 100%, 93%) 0px, transparent 50%), radial-gradient(at 61% 48%, hsl(340, 100%, 76%) 0px, transparent 50%), radial-gradient(at 0% 100%, hsl(22, 100%, 77%) 0px, transparent 50%), radial-gradient(at 0% 0%, hsl(343, 100%, 76%) 0px, transparent 50%);
  }

  .border .border-hello {
    display: none;
  }

  .border .border-title {
    position: static;
    width: 100%;
    height: 50px;
    transform: none;
    line-height: 50px;
  }

  .border .home {
    width: 100%;
    position: relative;
    flex-direction: column;
    border-radius: 0;
    border: none;
    overflow: hidden;
  }

  .border .home::after {
    content: "";
  }

  .border .home .home-list {
    width: 100%;
    padding: 0 20px calc(20px + constant(safe-area-inset-bottom));
    padding: 0 20px calc(20px + env(safe-area-inset-bottom));
  }

}
</style>