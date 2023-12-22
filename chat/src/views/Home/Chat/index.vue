<template>
    <div class="home-content" :class="{ 'home-content__show': to }" ref="box" :style="{ height }" @click="isTool = false">
        <div class="mask" v-if="!isFriend">
            <el-empty description="对方不是您的好友，无法发送消息"></el-empty>
            <p @click.stop.prevent="addFriend"><i class="el-icon-thumb"></i><span>快去添加TA为好友吧</span></p>
        </div>
        <transition name="el-fade-in">
            <Firework :text="text" v-if="isFirework"></Firework>
        </transition>
        <audio :src="audioSrc" @play="play" @pause="pause" ref="audio" @ended="ended" id="audio"></audio>
        <div class=" home-content-title">
            <a class="home-content-title-back" id="back" href="javascript:;" v-if="isMobile" @click="goBack"></a>
            <router-link :to="{
                name: 'blog',
                params: {
                    id: to
                }
            }" class="home-content-title-box">
                <img :src="`${APP_MEDIA_URL}${toAvatar}`" class="home-content-title-img" v-if="toAvatar" alt="">
                <span class="home-content-title-name" v-html="filterMessage(formatMessage(toName))"></span>
            </router-link>
            <a id="logout" href="javascript:;" @click="logout">退出</a>
        </div>
        <div class="home-content-content" id="chat-content" ref="contentList" @scroll="handleScroll">
            <el-collapse-transition>
                <div class=" home-content-content-item__end" v-if="scrollFlag && msgList.length">消息到底了，快去和TA聊天吧！</div>
            </el-collapse-transition>
            <div class="home-content-content-item__end" v-if="!messageEnd">消息加载中...</div>
            <ChatItem v-for="msg in msgList" :key="msg.msg_id" :msg="msg" :isUserName="to === WORLD_ID"></ChatItem>
            <div class="bubble" v-if="unread_msg" @click="bubbleClick" :style="{ bottom: isDown ? '80px' : '220px' }">{{
                unread_msg }}</div>
        </div>
        <div class="home-content-input home-content-input__mobile" ref="input" v-if="isMobile">
            <div class="home-content-input-input">

                <div class="home-content-input-btns">
                    <button class="round" @click.stop="isTool = !isTool"><i class="el-icon-more"></i>
                    </button>
                </div>

                <textarea type="text" id="chat-input" maxlength="1000" rows="1" v-model="input" @keydown="handleKeyDown"
                    placeholder="发送信息" @input="fitHeight" ref="textarea"></textarea>

                <div class="home-content-input-btns">
                    <button id="chat-send" @touchstart.prevent="send" @mousedown="send">发送</button>
                </div>
            </div>

            <el-collapse-transition>
                <div class="home-content-input-tools" v-if="isTool" @click.stop>
                    <div class="tool-item">
                        <label id="image-send" for="chat-file" @click.stop="accept = 'image/*'" class="icon"><svg
                                t="1693136544258" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                p-id="5880" width="25" height="25">
                                <path
                                    d="M795.925333 211.413333h-552.32c-47.722667 0-86.506667 39.552-86.506666 88.256v420.778667c0 48.704 38.784 88.277333 86.485333 88.277333h552.32c47.744 0 86.528-39.573333 86.528-88.277333V299.669333c0-48.704-38.784-88.277333-86.506667-88.277333zM214.762667 720.426667V299.669333c0-16.192 12.970667-29.44 28.821333-29.44h552.32c15.872 0 28.842667 13.248 28.842667 29.44v264.96l-141.717334-66.773333L382.570667 746.026667a30.997333 30.997333 0 0 0-3.733334 3.84h-135.253333c-15.850667 0-28.821333-13.248-28.821333-29.44z m581.162666 29.44h-326.4l221.866667-183.338667 133.354667 62.826667v91.093333c0 16.170667-12.970667 29.397333-28.821334 29.397333z"
                                    fill="#333" p-id="5881"></path>
                                <path
                                    d="M459.306667 427.669333c0-51.114667-40.661333-92.693333-90.666667-92.693333-50.005333 0-90.666667 41.578667-90.666667 92.693333s40.661333 92.693333 90.666667 92.693334c50.005333 0 90.666667-41.578667 90.666667-92.693334z m-126.378667 0c0-20.074667 16.064-36.522667 35.712-36.522666 19.648 0 35.733333 16.426667 35.733333 36.522666 0 20.074667-16.085333 36.522667-35.733333 36.522667-19.776 0-35.712-16.298667-35.712-36.522667z"
                                    fill="#333" p-id="5882"></path>
                            </svg></label>
                        <span class="text">图片</span>
                    </div>
                    <div class="tool-item">
                        <a href="javascript:;" id="voice" class="icon" @mousedown="recordVoice" @mouseup="sendVoice"
                            @mouseleave="cancelVoice" @touchstart="recordVoice" @touchend="sendVoice"
                            @touchleave="cancelVoice" title="按住说话"
                            :class="{ 'voice-active': mediaRecorder?.state === 'recording' }">
                            <svg t="1690709285923" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                p-id="2312" width="20" height="20">
                                <path d="M256 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#333" p-id="2313">
                                </path>
                                <path
                                    d="M435.7 282.8a31.9 31.9 0 0 0 0 45.2 257.4 257.4 0 0 1 0 368 32 32 0 1 0 44.9 45.6 321.4 321.4 0 0 0 0-459.2 31.9 31.9 0 0 0-44.9 0.4z"
                                    fill="#333" p-id="2314"></path>
                                <path
                                    d="M660.9 105.2a32 32 0 0 0-44.9 45.6 505.2 505.2 0 0 1 0 722.4 32 32 0 1 0 44.9 45.6 569.1 569.1 0 0 0 0-813.6z"
                                    fill="#333" p-id="2315"></path>
                            </svg>
                        </a>
                        <span class="text">语音</span>
                    </div>
                    <div class="tool-item">
                        <a class="icon" href="javascript:;" @click.stop="keyboardEmoji">
                            <svg t="1693128544238" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                p-id="1543" width="20" height="20"
                                data-spm-anchor-id="a313x.search_index.0.i4.5db53a81QDmxwB">
                                <path
                                    d="M512 989.866667C249.173333 989.866667 34.133333 774.826667 34.133333 512S249.173333 34.133333 512 34.133333s477.866667 215.04 477.866667 477.866667-215.04 477.866667-477.866667 477.866667z m0-904.533334C276.48 85.333333 85.333333 276.48 85.333333 512s191.146667 426.666667 426.666667 426.666667 426.666667-191.146667 426.666667-426.666667S747.52 85.333333 512 85.333333z"
                                    fill="#333" p-id="1544"></path>
                                <path
                                    d="M512 786.773333c-128 0-179.2-100.693333-180.906667-104.106666-6.826667-11.946667-1.706667-27.306667 11.946667-34.133334 11.946667-6.826667 27.306667-1.706667 34.133333 11.946667 1.706667 3.413333 40.96 76.8 134.826667 76.8 95.573333 0 134.826667-75.093333 134.826667-76.8 6.826667-11.946667 22.186667-17.066667 34.133333-11.946667 11.946667 6.826667 17.066667 22.186667 11.946667 34.133334-1.706667 3.413333-52.906667 104.106667-180.906667 104.106666zM715.093333 447.146667h-90.453333c-13.653333 0-25.6-11.946667-25.6-25.6s11.946667-25.6 25.6-25.6h90.453333c13.653333 0 25.6 11.946667 25.6 25.6s-10.24 25.6-25.6 25.6zM353.28 491.52c-13.653333 0-25.6-11.946667-25.6-25.6V375.466667c0-13.653333 11.946667-25.6 25.6-25.6s25.6 11.946667 25.6 25.6v90.453333c0 15.36-10.24 25.6-25.6 25.6z"
                                    fill="#333" p-id="1545"></path>
                            </svg>
                        </a>
                        <span class="text">表情</span>
                    </div>
                    <div class="tool-item">
                        <label id="file-send" for="chat-file" @click.stop="accept = '*'" class="icon">
                            <svg t="1693141165392" viewBox="0 0 1260 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                p-id="15906" width="18" height="18">
                                <path
                                    d="M1058.848012 935.688021H88.993243l113.018307-453.124559h969.854769zM88.993243 88.839223h397.403905l52.566655 157.699962h554.052534v147.186632h-893.63312A88.837646 88.837646 0 0 0 115.802237 461.011134l-27.33466 109.338641zM1181.853983 394.251483V246.013518A88.311979 88.311979 0 0 0 1093.016337 157.701539h-490.972549l-31.014326-95.67131A88.311979 88.311979 0 0 0 486.922815 0.001577H88.993243A88.311979 88.311979 0 0 0 0.155598 88.839223V935.688021a88.837646 88.837646 0 0 0 0 10.513331v14.718663a87.260646 87.260646 0 0 0 26.808993 37.847991h5.782332a87.260646 87.260646 0 0 0 39.950657 14.718663h986.150432A88.837646 88.837646 0 0 0 1145.057325 946.201352l113.018307-453.124559a88.837646 88.837646 0 0 0-76.221649-98.82531z"
                                    fill="#333333" p-id="15907"></path>
                            </svg>
                        </label>
                        <span class="text">文件</span>
                    </div>
                </div>
            </el-collapse-transition>


        </div>

        <div class="home-content-input home-content-input__pc" ref="input" v-else>
            <div class="tool">
                <div class="tool-left" @contextmenu.prevent.stop>
                    <div class="home-content-input-btns">
                        <button class="home-content-input-btns__more round">
                            <label id="image-send" for="chat-file" @click="accept = 'image/*'">
                                <svg t="1693136544258" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="5880" width="25" height="25">
                                    <path
                                        d="M795.925333 211.413333h-552.32c-47.722667 0-86.506667 39.552-86.506666 88.256v420.778667c0 48.704 38.784 88.277333 86.485333 88.277333h552.32c47.744 0 86.528-39.573333 86.528-88.277333V299.669333c0-48.704-38.784-88.277333-86.506667-88.277333zM214.762667 720.426667V299.669333c0-16.192 12.970667-29.44 28.821333-29.44h552.32c15.872 0 28.842667 13.248 28.842667 29.44v264.96l-141.717334-66.773333L382.570667 746.026667a30.997333 30.997333 0 0 0-3.733334 3.84h-135.253333c-15.850667 0-28.821333-13.248-28.821333-29.44z m581.162666 29.44h-326.4l221.866667-183.338667 133.354667 62.826667v91.093333c0 16.170667-12.970667 29.397333-28.821334 29.397333z"
                                        fill="#333" p-id="5881"></path>
                                    <path
                                        d="M459.306667 427.669333c0-51.114667-40.661333-92.693333-90.666667-92.693333-50.005333 0-90.666667 41.578667-90.666667 92.693333s40.661333 92.693333 90.666667 92.693334c50.005333 0 90.666667-41.578667 90.666667-92.693334z m-126.378667 0c0-20.074667 16.064-36.522667 35.712-36.522666 19.648 0 35.733333 16.426667 35.733333 36.522666 0 20.074667-16.085333 36.522667-35.733333 36.522667-19.776 0-35.712-16.298667-35.712-36.522667z"
                                        fill="#333" p-id="5882"></path>
                                </svg>
                            </label>
                        </button>
                    </div>

                    <div class="home-content-input-btns">
                        <el-popover trigger="hover" width="200" placement="top"
                            @click.stop.prevent.native="$refs.textarea.focus()">
                            <div class="emoji-grid">
                                <a class="emoji-grid__item" v-for="item in emojiList" :key="item.icon_id"
                                    href="javascript:;" @click.stop.prevent="addEmoji(item)">
                                    <i class="iconfont" :class="`icon-${item.font_class}`"></i>
                                </a>
                            </div>

                            <a class="home-content-input-btns__emoji round" href="javascript:;" slot="reference">
                                <svg t="1693128544238" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="1543" width="20" height="20"
                                    data-spm-anchor-id="a313x.search_index.0.i4.5db53a81QDmxwB">
                                    <path
                                        d="M512 989.866667C249.173333 989.866667 34.133333 774.826667 34.133333 512S249.173333 34.133333 512 34.133333s477.866667 215.04 477.866667 477.866667-215.04 477.866667-477.866667 477.866667z m0-904.533334C276.48 85.333333 85.333333 276.48 85.333333 512s191.146667 426.666667 426.666667 426.666667 426.666667-191.146667 426.666667-426.666667S747.52 85.333333 512 85.333333z"
                                        fill="#333" p-id="1544"></path>
                                    <path
                                        d="M512 786.773333c-128 0-179.2-100.693333-180.906667-104.106666-6.826667-11.946667-1.706667-27.306667 11.946667-34.133334 11.946667-6.826667 27.306667-1.706667 34.133333 11.946667 1.706667 3.413333 40.96 76.8 134.826667 76.8 95.573333 0 134.826667-75.093333 134.826667-76.8 6.826667-11.946667 22.186667-17.066667 34.133333-11.946667 11.946667 6.826667 17.066667 22.186667 11.946667 34.133334-1.706667 3.413333-52.906667 104.106667-180.906667 104.106666zM715.093333 447.146667h-90.453333c-13.653333 0-25.6-11.946667-25.6-25.6s11.946667-25.6 25.6-25.6h90.453333c13.653333 0 25.6 11.946667 25.6 25.6s-10.24 25.6-25.6 25.6zM353.28 491.52c-13.653333 0-25.6-11.946667-25.6-25.6V375.466667c0-13.653333 11.946667-25.6 25.6-25.6s25.6 11.946667 25.6 25.6v90.453333c0 15.36-10.24 25.6-25.6 25.6z"
                                        fill="#333" p-id="1545"></path>
                                </svg>
                            </a>
                        </el-popover>
                    </div>

                    <div class="home-content-input-btns">

                        <a href="javascript:;" id="voice" class="home-content-input-btns__voice round"
                            @mousedown="recordVoice" @mouseup="sendVoice" @mouseleave="cancelVoice"
                            @touchstart="recordVoice" @touchend="sendVoice" @touchleave="cancelVoice" title="按住说话"
                            :class="{ 'voice-active': mediaRecorder?.state === 'recording' }">
                            <svg t="1690709285923" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2312" width="20" height="20">
                                <path d="M256 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#333" p-id="2313">
                                </path>
                                <path
                                    d="M435.7 282.8a31.9 31.9 0 0 0 0 45.2 257.4 257.4 0 0 1 0 368 32 32 0 1 0 44.9 45.6 321.4 321.4 0 0 0 0-459.2 31.9 31.9 0 0 0-44.9 0.4z"
                                    fill="#333" p-id="2314"></path>
                                <path
                                    d="M660.9 105.2a32 32 0 0 0-44.9 45.6 505.2 505.2 0 0 1 0 722.4 32 32 0 1 0 44.9 45.6 569.1 569.1 0 0 0 0-813.6z"
                                    fill="#333" p-id="2315"></path>
                            </svg>
                        </a>

                    </div>

                    <div class="home-content-input-btns">
                        <button class="round">
                            <label id="file-send" for="chat-file" @click="accept = '*'">
                                <svg t="1693141165392" class="icon" viewBox="0 0 1260 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="15906" width="18" height="18">
                                    <path
                                        d="M1058.848012 935.688021H88.993243l113.018307-453.124559h969.854769zM88.993243 88.839223h397.403905l52.566655 157.699962h554.052534v147.186632h-893.63312A88.837646 88.837646 0 0 0 115.802237 461.011134l-27.33466 109.338641zM1181.853983 394.251483V246.013518A88.311979 88.311979 0 0 0 1093.016337 157.701539h-490.972549l-31.014326-95.67131A88.311979 88.311979 0 0 0 486.922815 0.001577H88.993243A88.311979 88.311979 0 0 0 0.155598 88.839223V935.688021a88.837646 88.837646 0 0 0 0 10.513331v14.718663a87.260646 87.260646 0 0 0 26.808993 37.847991h5.782332a87.260646 87.260646 0 0 0 39.950657 14.718663h986.150432A88.837646 88.837646 0 0 0 1145.057325 946.201352l113.018307-453.124559a88.837646 88.837646 0 0 0-76.221649-98.82531z"
                                        fill="#333333" p-id="15907"></path>
                                </svg>
                            </label>
                        </button>
                    </div>
                </div>

                <div class="tool-right">
                    <div class="home-content-input-btns">
                        <a href="javascript:;" class="round" @click="inputDown"
                            style="background: transparent;box-shadow: none;"><i class="el-icon-arrow-down"
                                :style="{ transform: isDown ? 'rotate(180deg)' : 'rotate(0deg)' }"></i></a>
                    </div>
                    <div class="home-content-input-btns">
                        <el-popover trigger="hover" width="200" placement="top">
                            <ul class="change-enter-list" @click="changeEnter">
                                <li data-value="CTRL_ENTER" class="change-enter-item"><i class="icon"
                                        :class="{ 'el-icon-check': sendMethod == 'CTRL_ENTER' }"></i>按住Ctrl+Enter发送</li>
                                <li data-value="ENTER" class="change-enter-item"><i class="icon"
                                        :class="{ 'el-icon-check': sendMethod == 'ENTER' }"></i>Enter发送</li>
                            </ul>

                            <button id="chat-send" @touchstart.prevent="send" @click="send" @contextmenu.prevent.stop
                                slot="reference">发送</button>
                        </el-popover>


                    </div>
                </div>

            </div>
            <textarea type="text" id="chat-input" maxlength="1000" rows="1" v-model="input" @keydown="handleKeyDown"
                placeholder="发送信息" ref="textarea"></textarea>

        </div>

        <div class="home-content-file" :class="{ active: isDrag }">
            <input type="file" id="chat-file" @change="uploadFile" ref="upload" :accept="accept" />
        </div>

        <ChangeAvatar v-if="isChangeAvatar" @cancel="cancel">
        </ChangeAvatar>

        <Upload v-if="file" @cancel="cancelUpload" :file="file" @confirm="confirmUpload"></Upload>
    </div>
</template>

<script>
import ChangeAvatar from '../ChangeAvatar';
import Upload from '../Upload';
import ChatItem from "./ChatItem";
import { filterMessage, formatMessage } from "@/utils/message";
import MonitorKeyboard from '@/utils/MonitorKeyboard.js';
import { WebSocketType, WORLD_ID } from "@/ws/index";
import { mapState } from "vuex";
import { Popover, Empty } from 'element-ui';
import emojiList from "@/less/emoji/iconfont.js";
import MixinURL from '@/mixins/url'

export default {
    name: 'Chat',
    mixins: [MixinURL],
    components: {
        ChangeAvatar,
        Upload,
        ChatItem,
        [Popover.name]: Popover,
        [Empty.name]: Empty
    },
    props: {
        isDrag: {
            type: Boolean,
            default: false
        },
        isChangeAvatar: {
            type: Boolean,
            default: false
        },
        onlineList: {
            type: Array,
            default: () => []
        },
        friendList: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            msgList: [],
            input: '',
            messageEnd: false,
            scrollFlag: false,
            isRequestData: false,
            preHeight: null,
            WORLD_ID,
            file: null,
            pageDelta: 0,
            pageNo: 0,
            toAvatar: null,
            toName: 'Loading...',
            version: 2,
            height: '100%',
            unread_msg: 0,
            timer: null,
            mediaRecorder: null,
            recognition: null,
            text: '',
            isFirework: false,
            controller: null,
            audioSrc: '',
            isAudio: false,
            emojiList,
            isDown: false,
            accept: '*',
            sendMethod: localStorage.getItem('sendMethod') || 'CTRL_ENTER',
            isTool: false
        }
    },
    methods: {
        addFriend() {
            this.$bus.$emit('addFriend', this.to);
        },
        keyboardEmoji() {
            alert('请使用手机自带的Emoji键盘发送表情！')
            this.$refs.textarea.focus()
            this.isTool = false
        },
        changeEnter(e) {
            this.sendMethod = e.target.dataset.value;
            localStorage.setItem('sendMethod', this.sendMethod);
        },
        inputDown() {
            this.$refs.input.style.height = this.isDown ? '200px' : '60px';
            this.isDown = !this.isDown;
        },
        addEmoji(item) {
            let selection = this.$refs.textarea.selectionStart;
            this.input = this.$refs.textarea.value.slice(0, this.$refs.textarea.selectionStart) + `[${item.name}]` + this.$refs.textarea.value.slice(this.$refs.textarea.selectionEnd);
            this.$nextTick(() => {
                this.$refs.textarea.focus()
                this.$refs.textarea.selectionStart = this.$refs.textarea.selectionEnd = selection + item.name.length + 2;
                this.fitHeight(this.$refs.textarea);
            })
        },
        async recordVoice() {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })

            const type = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/wav';
            this.mediaRecorder ?? (this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: type,
            }));
            this.mediaRecorder.start();
            let text = '';

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition ?? (this.recognition = new SpeechRecognition());
            this.recognition.lang = 'zh-CN';
            try {
                this.recognition.start();
            } catch (e) { }

            this.recognition.onresult = e => {
                text = e.results[0][0].transcript;
            }

            this.mediaRecorder.ondataavailable = e => {
                const blob = new Blob([e.data]);

                const file = new File([blob], `${Date.now()}.${type.split('/')[1]}`, {
                    type,
                    lastModified: Date.now(),
                    lastModifiedDate: new Date(),
                    name: `${Date.now()}.mp3`
                })

                const time = Date.now();

                setTimeout(() => {
                    const msg = {
                        message: `<audio src="${URL.createObjectURL(file)}" data-value="${text}"></audio>`,
                        avatar: this.avatar,
                        create_time: time,
                        username: this.username,
                        msg_id: time,
                        recall: false,
                        id: this.userId,
                        to_read: false,
                        read_list: [],
                        delta: this.msgList[this.msgList.length - 1] ? time - new Date(this.msgList[this.msgList.length - 1].create_time) : Infinity,
                        isSending: true
                    }

                    this.msgList.push(msg);

                    this.scrollToBottom(this.$refs.contentList, 'smooth');

                }, 1000)



                const formData = new FormData();
                formData.append('audio', file);
                this.$axios.post(`/api/audio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    setTimeout(() => {
                        if (this.to == this.WORLD_ID)
                            this.server.emit(WebSocketType.GroupChat, this.createMessage(null, `<audio src="${res.data.audio}" data-value="${text}"></audio>`, null, null, null, time));
                        else
                            this.server.emit(WebSocketType.PrivateChat, this.createMessage(null, `<audio src="${res.data.audio}" data-value="${text}"></audio>`, this.to, null, null, time));

                        this.pageDelta++;

                        this.mediaRecorder.ondataavailable = null
                    }, 1000)

                });

            }

        },
        sendVoice() {
            if (!this.mediaRecorder) return;
            if (!this.recognition) return;
            this.recognition.stop();
            this.mediaRecorder.stop();
        },
        cancelVoice() {
            if (!this.mediaRecorder) return;
            this.mediaRecorder.ondataavailable = null
            this.mediaRecorder?.stop();
        },
        getKeyboardState() {
            this.monitorKeyboard = new MonitorKeyboard();
            this.monitorKeyboard.onStart();
            this.monitorKeyboard.onShow(() => { })
            this.monitorKeyboard.onHidden(() => { })
        },
        logout() {
            // localStorage.removeItem("token");
            // localStorage.removeItem("username");
            // localStorage.removeItem("avatar");
            // localStorage.removeItem("user");
            this.$store.dispatch('logout');
            this.server.close();
            this.$router.push('/user')
        },
        async handleScroll(e) {
            if (
                e.target.scrollHeight -
                e.target.scrollTop -
                e.target.clientHeight <
                10
            ) {
                this.unread_msg = 0;
                if (this.friendList.length)
                    this.$emit('changeUnread', this.to, 0);
                if (this.to == this.WORLD_ID) this.server.emit(WebSocketType.WorldRead);
                else
                    this.server.emit(WebSocketType.PrivateRead, this.createMessage(null, null, this.to));
            }
            if (this.scrollFlag) return;
            if (this.messageEnd && e.target.scrollTop === 0) {
                this.scrollFlag = true;
                setTimeout(() => {
                    this.scrollFlag = false;
                }, 1000)
            } else if (e.target.scrollTop === 0) {
                const bottom = e.target.scrollHeight - e.target.scrollTop;
                if (this.to == this.WORLD_ID) {
                    await this.getWorldData();
                } else {
                    await this.getPrivateData();
                }
                e.target.scrollTop = e.target.scrollHeight - bottom;
            }
        },
        bubbleClick() {
            this.scrollToBottom(this.$refs.contentList, 'smooth');
            this.unread_msg = 0;
            if (this.friendList.find(user => user.id == this.to)) {
                this.$emit('changeUnread', this.to, 0)
            }
            if (this.to === this.WORLD_ID) this.server.emit(WebSocketType.WorldRead);
            else
                this.server.emit(WebSocketType.PrivateRead, this.createMessage(null, null, this.to));
        },
        goBack() {
            this.$router.replace('/home')
            this.$bus.$emit("mobileBack")
        },
        cancel() {
            this.$emit('cancelChangeAvatar')
        },
        scrollToBottom(dom, behavior = 'instant') {
            this.$nextTick(() => {
                if (dom) {
                    dom.scrollTo({
                        top: dom.scrollHeight,
                        behavior
                    });
                }
            })
        },
        fitHeight(e) {
            if (!this.isMobile) return
            e = e.target ? e.target : e
            e.parentNode.style.height = "auto";
            const height = 36
            if (e.parentNode.offsetHeight < height)
                e.parentNode.style.height = height + "px";
            e.parentNode.style.height = e.scrollHeight + "px";
            if (this.$refs.contentList.scrollTop + this.$refs.contentList.clientHeight + 100 >= this.$refs.contentList.scrollHeight)
                this.scrollToBottom(this.$refs.contentList);
        },
        createMessage(user, msg, to, id, msg_id, time = Date.now()) {
            return {
                user,
                msg,
                to,
                id,
                msg_id,
                time
            };
        },
        handleKeyDown(e) {
            const send_or_newline = (method) => {
                if (this.sendMethod == method) {
                    this.send()
                } else {
                    let start = e.target.selectionStart;
                    let end = e.target.selectionEnd;
                    let text = e.target.value;
                    this.input = text.substring(0, start) + "\n" + text.substring(end);
                    this.$nextTick(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 1;
                    })
                }
            }
            if (e.ctrlKey && e.key === "Enter") {
                e.preventDefault();
                send_or_newline("CTRL_ENTER")
            } else if (e.key === "Enter") {
                e.preventDefault();
                send_or_newline("ENTER")
            } else if (e.key === "Tab") {
                e.preventDefault();
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;
                let text = e.target.value;
                this.input = text.substring(0, start) + "    " + text.substring(end);
                this.$nextTick(() => {
                    e.target.selectionStart = e.target.selectionEnd = start + 4;
                })
            }
            this.$nextTick(() => {
                this.fitHeight(e);
                e.target.scroll({
                    top: e.target.scrollHeight,
                })
            })
        },
        send() {
            if (!this.to) return

            if (!this.input.trim()) {
                this.$message.warning({
                    message: '发送内容不能为空',
                    offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                });
                return;
            }

            const time = Date.now()
            if (this.to == this.WORLD_ID) {
                this.server.emit(WebSocketType.GroupChat, this.createMessage(null, this.input, null, null, null, time));
            } else {
                this.server.emit(
                    WebSocketType.PrivateChat,
                    this.createMessage(null, this.input, this.to, null, null, time)
                );
            }

            const msg = {
                message: this.input,
                avatar: this.avatar,
                create_time: time,
                username: this.username,
                msg_id: time,
                recall: false,
                id: this.userId,
                to_read: false,
                read_list: [],
                delta: this.msgList[this.msgList.length - 1] ? time - new Date(this.msgList[this.msgList.length - 1].create_time) : Infinity,
                isSending: true
            }

            this.msgList.push(msg);


            this.scrollToBottom(this.$refs.contentList, 'smooth');

            this.input = "";

            this.$nextTick(() => {
                this.fitHeight(this.$refs.textarea);
            })
            this.pageDelta++;

        },
        async getWorldData() {
            if (this.isRequestData) return;
            this.isRequestData = true
            await this.$axios
                .get(`/api/chat/world?pageNo=${this.pageNo}&pageDelta=${this.pageDelta}`, {
                    signal: this.controller.signal
                })
                .then((res) => {
                    if (!res.data.ok) {
                        this.messageEnd = true;
                        return;
                    }
                    const data = res.data.msg;
                    if (data.length < 20) {
                        this.messageEnd = true;
                    }
                    this.msgList.unshift(...data)
                    for (let i = 0; i < Math.min(data.length + 1, this.msgList.length); i++) {
                        if (i === 0)
                            this.msgList[i].delta = Infinity;
                        else
                            this.msgList[i].delta = new Date(this.msgList[i].create_time) - new Date(this.msgList[i - 1].create_time);
                    }
                    this.pageNo++;
                    this.isRequestData = false
                }).catch(e => {
                    console.log(e)
                });
        },
        async getPrivateData() {
            if (this.isRequestData) return;
            this.isRequestData = true
            await this.$axios
                .get(
                    `/api/chat/private?from=${this.token}&to=${this.to}&pageNo=${this.pageNo}&pageDelta=${this.pageDelta}`, {
                    signal: this.controller.signal
                })
                .then((res) => {
                    if (!res.data.ok) {
                        this.messageEnd = true;
                        return;
                    }
                    const data = res.data.msg;
                    if (data.length < 20) {
                        this.messageEnd = true;
                    }
                    this.msgList.unshift(...data)
                    for (let i = 0; i < Math.min(data.length + 1, this.msgList.length); i++) {
                        if (i === 0)
                            this.msgList[i].delta = Infinity;
                        else
                            this.msgList[i].delta = new Date(this.msgList[i].create_time) - new Date(this.msgList[i - 1].create_time);
                    }
                    this.pageNo++;
                    this.isRequestData = false
                }).catch(e => {
                    console.log(e)
                });
        },
        async toBottom() {
            await new Promise((resolve) => {
                let imgList = document.querySelectorAll("img");
                let videoList = document.querySelectorAll("video");
                let count = 0;
                let total = imgList.length + videoList.length;
                if (total === 0) {
                    resolve();
                    return;
                }
                for (let i = 0; i < imgList.length; i++) {
                    imgList[i].onload = () => {
                        count++;
                        if (count === total) {
                            resolve();
                        }
                    };
                }
                for (let i = 0; i < videoList.length; i++) {
                    videoList[i].onloadeddata = () => {
                        count++;
                        if (count === total) {
                            resolve();
                        }
                    };
                }
            });
            this.scrollToBottom(this.$refs.contentList, 'smooth');
        },
        bubbleShow() {
            if (
                this.$refs.contentList?.scrollHeight -
                this.$refs.contentList?.scrollTop -
                this.$refs.contentList?.clientHeight <
                100
            ) {
                this.scrollToBottom(this.$refs.contentList, 'smooth');

                if (this.to == this.WORLD_ID) this.server.emit(WebSocketType.WorldRead);
                else
                    this.server.emit(WebSocketType.PrivateRead, this.createMessage(null, null, this.to));
            } else {
                this.unread_msg++;
                this.$emit("changeUnread", this.to);
            }
        },
        async recieveMessage(item, isWorld = false) {
            const comMsg = this.msgList.find(_item => _item.create_time === item.time && _item.msg_id === item.time && _item.id == this.userId)
            if (comMsg) {
                comMsg.msg_id = item.msg_id;
                comMsg.isSending = false;
                if (/^\[.*\]\((.*)\)$/.test(item.data.trim()))
                    comMsg.message = item.data;
                this.$emit('changeFriendlist', this.to, comMsg);
                return;
            }

            const msg = {
                message: item.data,
                avatar: item.avatar,
                create_time: item.time,
                username: item.user,
                msg_id: item.msg_id,
                recall: false,
                id: item.id,
                to_read: false,
                read_list: [],
                delta: this.msgList[this.msgList.length - 1] ? item.time - new Date(this.msgList[this.msgList.length - 1].create_time) : Infinity
            }

            if (isWorld) {
                this.$emit('changeFriendlist', this.WORLD_ID, msg);
                if (this.to == this.WORLD_ID) {
                    this.msgList.push(msg)
                    this.pageDelta++;
                    this.bubbleShow();
                    this.$emit('changeFriendlist', this.to, comMsg);
                } else {
                    this.$emit('changeUnread', this.WORLD_ID);
                    this.$emit('changeFriendlist', this.to, comMsg);
                }
            } else {
                if (item.id == this.userId) {
                    this.$emit('changeFriendlist', this.to, msg);
                    this.msgList.push(msg);
                    this.pageDelta++;
                    this.bubbleShow();
                } else if (item.id == this.to) {
                    this.$emit('changeFriendlist', this.to, msg);
                    this.msgList.push(msg);
                    this.pageDelta++;
                    this.bubbleShow();
                } else {
                    this.$emit('changeFriendlist', item.id, msg);
                    this.$emit('changeUnread', item.id);
                }
            }


            // const db = await this.openDB("chat", this.version);
            // const transaction = db.transaction(["info"], "readwrite");
            // const objectStore = transaction.objectStore("info");

            // const request = objectStore.get(Number(item.id));

            // let res = await new Promise((resolve) => {
            //     request.onsuccess = () => {
            //         resolve(request.result);
            //     }
            // })

            // if (!!res)
            //     await new Promise((resolve) => {
            //         const request = objectStore.put({
            //             id: Number(item.id),
            //             msgList: [...res.msgList, msg],
            //             pageDelta: res.pageDelta + 1,
            //             pageNo: res.pageNo,
            //             messageEnd: res.messageEnd,
            //             scrollFlag: res.scrollFlag,
            //             unread_msg: res.unread_msg,
            //             isRequestData: res.isRequestData
            //         });

            //         request.onsuccess = () => {
            //             resolve();
            //         }
            //     })
        },
        cancelUpload() {
            this.file = null
            this.$refs.upload.value = null
        },
        confirmUpload() {
            const formData = new FormData();
            const type = this.file.type.includes("image") ? "image" : "file";
            formData.append(type, this.file);
            const time = Date.now();
            const suffix = this.file.name.split('.').pop()
            const filename = this.file.name.replace(`.${suffix}`, '')

            const msg = {
                message: type === "image" ? `<img src="${URL.createObjectURL(this.file)}"/>` : `[${filename}_${time}.${suffix}](${URL.createObjectURL(this.file)})`,
                suffix,
                avatar: this.avatar,
                create_time: time,
                username: this.username,
                msg_id: time,
                recall: false,
                id: this.userId,
                to_read: false,
                read_list: [],
                delta: this.msgList[this.msgList.length - 1] ? time - new Date(this.msgList[this.msgList.length - 1].create_time) : Infinity,
                isSending: true
            }

            this.msgList.push(msg);
            setTimeout(() => {
                this.scrollToBottom(this.$refs.contentList, 'smooth');
            })

            this.$axios
                .post("/api/" + type, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    const msg = type === "image" ? `<img src="${res.data.image}"/>` : `[${res.data.file.replace("/uploads/", "")}](${this.APP_MEDIA_URL + res.data.file})`;
                    if (this.to == this.WORLD_ID) {
                        this.server.emit(
                            WebSocketType.GroupChat,
                            this.createMessage(null, msg, null, null, null, time)
                        );
                    } else {
                        this.server.emit(
                            WebSocketType.PrivateChat,
                            this.createMessage(null, msg, this.to, null, null, time)
                        );
                    }
                    this.$emit('changeFriendlist', this.to, {
                        username: this.username,
                        message: msg,
                        avatar: this.avatar,
                    })
                    this.scrollToBottom(this.$refs.contentList, 'smooth');
                    this.pageDelta++;
                });
            this.file = null
            this.$refs.upload.value = null
            this.$nextTick(() => {
                this.toBottom();
            })
        },
        uploadFile(e) {
            const file = e.target.files[0];
            if (!/image\/\w+/.test(file.type) && this.accept.includes("image")) {
                this.$notify.warning({
                    title: '警告',
                    message: "请确保文件为图像类型!",
                    offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                });
                e.target.value = "";
                this.accept = '*'
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                this.$notify.warning({
                    title: '警告',
                    message: "文件大小不得超过5MB!",
                    offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-top"))
                });
                e.target.value = "";
                this.accept = '*'
                return;
            }

            this.file = file;
        },
        async init() {
            // const db = await this.openDB("chat", this.version);
            // const transaction = db.transaction(["info"], "readwrite");
            // const objectStore = transaction.objectStore("info");

            // await new Promise((resolve) => {
            //     const request = objectStore.get(this.to);
            //     request.onsuccess = (event) => {
            //         if (request.result) {
            //             this.pageDelta = request.result.pageDelta;
            //             this.pageNo = request.result.pageNo;
            //             this.msgList = request.result.msgList;
            //             this.messageEnd = request.result.messageEnd;
            //             this.scrollFlag = request.result.scrollFlag;
            //             this.isRequestData = request.result.isRequestData;
            //         }
            //         else {
            //             this.pageDelta = 0;
            //             this.pageNo = 0;
            //             this.msgList = [];
            //             this.messageEnd = false;
            //             this.scrollFlag = false;
            //             this.isRequestData = false;
            //         }
            //         if (!this.msgList.length) this.getMessage();

            //         resolve();
            //     }
            // })

            this.pageDelta = 0;
            this.pageNo = 0;
            this.msgList = [];
            this.messageEnd = false;
            this.scrollFlag = false;
            this.isRequestData = false;
            this.mediaRecorder = null;
            this.recognition = null;

            this.toAvatar = this.friendList.find(user => user.id == this.to)?.avatar
            this.toName = this.friendList.find(user => user.id == this.to)?.username

            this.getMessage();

            this.scrollToBottom(this.$refs.contentList);
        },
        filterMessage,
        formatMessage,
        async getMessage() {
            if (this.to == this.WORLD_ID) {
                this.server.emit(WebSocketType.WorldRead);
                await this.getWorldData();
            } else {
                this.server.emit(WebSocketType.PrivateRead, this.createMessage(null, null, this.to));
                await this.getPrivateData();
            }

            this.scrollToBottom(this.$refs.contentList);
        },
        openDB(dbName, version = 1) {
            // return new Promise((resolve, reject) => {
            //     const indexedDB =
            //         window.indexedDB ||
            //         window.mozIndexedDB ||
            //         window.webkitIndexedDB ||
            //         window.msIndexedDB;
            //     let db;
            //     const request = indexedDB.open(dbName, version);
            //     request.onsuccess = function (event) {
            //         db = event.target.result;
            //         resolve(db);
            //     };
            //     request.onerror = function (event) {
            //         console.log("数据库打开报错");
            //     };
            //     request.onupgradeneeded = function (event) {
            //         db = event.target.result;
            //         if (!db.objectStoreNames.contains("info")) {
            //             const objectStore = db.createObjectStore("info", {
            //                 keyPath: "id",
            //             });
            //             objectStore.createIndex("id", "id", {
            //                 unique: true,
            //             });
            //         }
            //     };
            // })
        },
        async saveInfo(oldVal) {
            // const db = await this.openDB("chat", this.version);
            // const data = {
            //     pageDelta: this.pageDelta,
            //     pageNo: this.pageNo,
            //     msgList: this.msgList,
            //     messageEnd: this.messageEnd,
            //     scrollFlag: this.scrollFlag,
            //     isRequestData: this.isRequestData,
            //     id: Number(oldVal),
            // }
            // const transaction = db.transaction(["info"], "readwrite");
            // const objectStore = transaction.objectStore("info");
            // try {
            //     objectStore.put(data);
            // } catch (e) { }
        },
        ended() {
            this.isAudio = false
            this.$refs.audio?.pause()
            this.$bus.$emit('audiostop', this.audioSrc)
        },
        play() {
            this.$bus.$emit('audioplay', this.audioSrc)
        },
        pause() {
            this.$bus.$emit('audiopause', this.audioSrc)
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$refs.audio)
                this.$refs.audio.oncanplay = (e) => {
                    e.target.play()
                    this.isAudio = true
                }
        })
    },
    created() {
        this.getKeyboardState();

        this.controller?.abort();
        this.controller = new AbortController()
        localStorage.setItem("to", this.to);
        this.ended()
        this.init();

        visualViewport.onresize = () => {
            if (this.isMobile) {
                this.height = visualViewport.height + 'px'
                scrollTo(0, 0)
                setTimeout(() => {
                    this.scrollToBottom(this.$refs.contentList);
                })
            } else {
                this.height = '100%'
            }
        }

        this.$bus.$on('firework', (data) => {
            this.text = data.text ?? ''
            this.isFirework = true

            setTimeout(() => {
                this.isFirework = false
            }, 3000)
        })

        this.$bus.$on('audio', (data) => {
            if (this.audioSrc === data.src) {
                if (this.isAudio) {
                    this.$refs.audio?.pause()
                    this.isAudio = false
                } else {
                    this.$refs.audio?.play()
                    this.isAudio = true
                }
            } else {
                this.$refs.audio?.pause()
                this.audioSrc = data.src
            }
        })

        this.$bus.$on('recall', (id) => {
            const item = this.msgList.find(item => item.msg_id == id)
            if (item) {
                item.recall = 1
                this.server.emit(WebSocketType.Recall, {
                    id,
                    to: this.to
                })
            }
        })

        this.$bus.$on('delete', (id) => {
            this.msgList = this.msgList.filter(item => item.msg_id != id)
        })

        this.server.on(WebSocketType.GroupChat, (item) => {
            this.recieveMessage(item, true)
        });

        this.server.on(WebSocketType.PrivateChat, (item) => {
            this.recieveMessage(item)
        });

        this.server.on(WebSocketType.WorldRead, (data) => {
            if (this.to == this.WORLD_ID) {
                for (let i = this.msgList.length - 1; i >= 0; i--) {
                    if (!this.msgList[i].read_list) continue;
                    if (this.msgList[i].read_list?.find(item => item.id == data.id)) continue;
                    this.msgList[i].read_list.push({
                        id: data.id,
                        username: data.user,
                        avatar: data.avatar
                    })
                }
            }
        })

        this.server.on(WebSocketType.PrivateRead, (data) => {
            if (this.to == data.id) {
                for (let i = this.msgList.length - 1; i >= 0; i--) {
                    if (this.msgList[i].to_read) continue;
                    if (this.msgList[i].id == data.user) {
                        this.msgList[i].to_read = true
                    }
                }
            }

        })

        this.server.on(WebSocketType.System, (data) => {
            data.delta = this.msgList[this.msgList.length - 1] ? data.time - new Date(this.msgList[this.msgList.length - 1].create_time) : Infinity;
            this.msgList.push(data)
            this.scrollToBottom(this.$refs.contentList);
        });

        this.server.on(WebSocketType.Recall, (data) => {
            const { id, to } = data.data
            if (to == this.to || to == this.userId) {
                const item = this.msgList.find(item => item.msg_id == id)
                if (!item) return
                item.recall = true
                if (item.msg_id == this.msgList[this.msgList.length - 1].msg_id) {
                    if (to == this.WORLD_ID) {
                        this.$emit('changeFriendlist', this.WORLD_ID, item)
                    }
                    else if (to == this.userId) {
                        this.$emit('changeFriendlist', this.to, item)
                    } else {
                        this.$emit('changeFriendlist', this.userId, item)
                    }
                } else if (this.friendList.find(user => user.last.msg_id == id)) {
                    this.$emit('changeFriendlist', this.friendList.find(user => user.last.msg_id == id).id, {
                        ...this.friendList.find(user => user.last.msg_id == id).last,
                        recall: true
                    })
                }
            }
            this.$emit('changeFriendlist', this.friendList.find(user => user.last.msg_id == id).id, {
                ...this.friendList.find(user => user.last.msg_id == id).last,
                recall: true
            })
        })

        this.server.on(WebSocketType.Error, () => {
            this.$store.dispatch('logout');
            this.$router.push('/user')
        });

    },
    async beforeDestroy() {
        this.monitorKeyboard?.onEnd();
        // await this.saveInfo(this.to)
        this.controller?.abort();
    },
    computed: {
        to() {
            const id = parseInt(this.$route.params.id)
            if (isNaN(id)) this.$router.replace('/home/chat/' + localStorage.getItem("to"))
            return id
        },
        ...mapState({
            token: state => state.user.token,
            userId: state => state.user.userId,
            username: state => state.user.username,
            avatar: state => state.user.avatar,
            isMobile: state => state.mobile.isMobile,
            server: state => state.server.server
        }),
        isFriend() {
            return this.friendList.find(user => user.id == this.to)
        }
    },
    watch: {
        onlineList() {
            this.toAvatar = this.friendList.find(user => user.id == this.to)?.avatar ?? this.avatar
            this.toName = this.friendList.find(user => user.id == this.to)?.username ?? this.username
        },
        friendList() {
            this.toAvatar = this.friendList.find(user => user.id == this.to)?.avatar ?? this.avatar
            this.toName = this.friendList.find(user => user.id == this.to)?.username ?? this.username
        },
        isTool(newVal) {
            if (newVal)
                if (this.$refs.contentList.scrollTop + this.$refs.contentList.clientHeight + 100 >= this.$refs.contentList.scrollHeight) {
                    this.$nextTick(() => {
                        this.scrollToBottom(this.$refs.contentList, 'smooth');
                        setTimeout(() => {
                            this.scrollToBottom(this.$refs.contentList, 'smooth');
                        }, 500)
                    })
                }
        },
        msgList(newVal) {
            const ImageReg = /^<img src="(.*?)"\/?>$/;
            newVal.forEach(item => {
                if (ImageReg.test(item.message?.trim())) {
                    if (!item.message.includes("preview"))
                        item.message = item.message.replace(ImageReg, `<img src="$1" preview="${this.to}"/>`)
                }
            })
            this.$nextTick(() => {
                this.$previewRefresh()
            })

        }
    }
}
</script>

<style lang="less" scoped>
.home-content {
    position: relative;
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: #fffa;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    perspective: 0;
    scroll-behavior: smooth;
    transition: none !important;
    overflow: hidden;
    perspective: 500px;
    z-index: 999;

    .mask {
        height: 100%;
        width: 100%;
        position: absolute;
        background-color: #000A;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        p {
            color: white;
            font-size: 20px;
            margin: 0;
            padding: 5px;
            cursor: pointer;

            i {
                margin-right: 10px;
            }
        }
    }
}

.home-content .home-content-title {
    height: 60px;
    width: calc(100% - 20px);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #fcfcfc;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    top: 0;
    align-items: center;
    justify-content: space-between;
    padding: constant(safe-area-inset-top) 10px 0;
    padding: env(safe-area-inset-top) 10px 0;
    box-sizing: content-box;
    font-size: 20px;
    font-weight: bold;
    position: fixed;
    text-align: left;
    z-index: 9;
    overflow: hidden;
    border-radius: inherit;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    text-decoration: none;
    color: #333;
    gap: 10px;


    .home-content-title-box {
        display: flex;
        align-items: center;
        overflow: hidden;
        flex: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;

        &:hover {

            .home-content-title-name {
                text-decoration: underline;
            }
        }

        .home-content-title-img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
        }

        .home-content-title-name {
            font-size: 1.2rem;
            overflow: hidden;

            /deep/ p {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }
        }
    }

    #logout {
        text-decoration: none;
        font-size: 14px;
        background-color: rgba(255, 0, 0, 0.5);
        padding: 8px 10px;
        color: white;
        border-radius: 10px;
        font-weight: 400;
        display: block;
    }
}

.home-content .home-content-content {
    flex: 1;
    width: 100%;
    overflow: auto;
    padding: 70px 10px 10px;
    box-sizing: border-box;
    list-style: none;
    position: relative;
    margin: 0;
    transition: none !important;
}

.home-content .home-content-content .home-content-content-item__end {
    text-align: center;
    padding: 10px;
    font-size: 10px;
    font-weight: bold;
    color: #ccc;
}

.home-content .home-content-content .bubble {
    position: fixed;
    height: 20px;
    width: 20px;
    font-size: 14px;
    line-height: 20px;
    bottom: 80px;
    right: 20px;
    z-index: 99;
    background: #333;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    filter: drop-shadow(0 0 10px white);

    &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-top: 15px solid #333;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        bottom: 50%;
        right: 0;
        z-index: -1;
        transform: translateY(100%);
    }
}



.home-content .home-content-input {
    height: 32px;
    border-top: 1px solid #fcfcfc;
    display: flex;
    align-items: center;
    max-height: 400px;
    padding: 0 10px 10px;
    box-sizing: content-box;
    gap: 30px;
    width: calc(100% - 20px);

    @media screen and (max-width: 600px) {

        transition: none !important;
    }

    &.home-content-input__pc {
        flex-direction: column;
        align-items: flex-start;
        height: 200px;
        box-sizing: border-box;
        gap: 10px;
        padding: 15px;
        width: unset;

        .tool {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;

            .tool-left {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .tool-right {
                display: flex;
                gap: 10px;
                align-items: center;
            }
        }

        #chat-input {
            padding: 0 5px;
            width: 100%;
            position: relative;

            .input {
                position: absolute;
                inset: 0;
                margin: 0;
                padding: 0;
                text-align: left;
            }
        }
    }

    &.home-content-input__mobile {
        flex-direction: column;
        height: fit-content;
        box-shadow: 0px 10px 20px -5px #333;
        border-radius: 10px 10px 0 0;

        .home-content-input-input {
            display: flex;
            gap: 5px;
            width: 100%;
            align-items: flex-end;

            #chat-send {
                color: #333;
            }
        }

        .home-content-input-tools {
            display: flex;
            flex-wrap: wrap;
            padding: 0 20px;
            gap: 30px;
            height: fit-content;
            width: 100%;

            .tool-item {
                width: calc((100% - 60px) / 3);
                aspect-ratio: 1/1;

                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                gap: 10px;

                .icon {
                    height: 80%;
                    width: 80%;
                    border: none;
                    outline: none;
                    border-radius: 20px;
                    background-color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 3px 2px 15px -12px #000, -9px -8px 20px -5px #fcfcfc;

                    &:active {
                        box-shadow: inset 3px 2px 15px -12px #000, inset -9px -8px 20px -5px #fcfcfc;
                    }


                    lable {
                        height: 100%;
                        width: 100%;
                        display: block;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }

                .text {
                    font-size: 14px;
                    color: #333;
                    user-select: none;
                }
            }
        }
    }

    .round {
        height: 2rem !important;
        width: 2rem !important;
        border-radius: 10px !important;
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
    }
}

.home-content .home-content-input .home-content-input-btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;

    button,
    a {
        border-radius: 10px;
        border: none;
        box-sizing: border-box;
        line-height: 1rem;
        padding: .5rem 1rem;
        user-select: none;
        background-color: #fff;
        box-shadow: 3px 2px 8px -8px #000, -9px -8px 20px -5px #fff;

        &:active {
            box-shadow: inset 3px 2px 8px -8px #000, inset -9px -8px 20px -5px #fff;
        }
    }

    &__voice,
    &__emoji {
        position: relative;
    }



    label {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}


.home-content .home-content-input .home-content-input-btns button:nth-child(n + 2) {
    margin-top: 5px;
}

#chat-input {
    flex: 1;
    outline: none;
    border: none;
    padding: 6px 0.5rem;
    user-select: all;
    -webkit-user-select: all;
    -moz-user-select: all;
    -ms-user-select: all;
    resize: none;
    background-color: inherit;
    height: 100%;
    font-size: 16px;
    line-height: 1.5rem;
    overflow: overlay;
    background-color: transparent;
}

.home-content .home-content-file {
    width: 100%;
    height: calc(100% - 10px - var(--BoarderTop));
    position: absolute;
    top: calc(var(--BoarderTop) + 10px);
    left: 0;
    z-index: -1;
}

.home-content .home-content-file.active {
    z-index: 999;
    border: 3px dashed #5ea4ff;
    margin: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 14px - var(--BoarderTop));
    height: calc(100% - 14px - var(--BoarderTop));
    border-radius: 10px;
    overflow: hidden;
}

.home-content .home-content-file.active::before {
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fffd;
}

.home-content .home-content-file.active::after {
    content: "+";
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 100px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    color: #5ea4ff;
    font-weight: 100;
}

.home-content .home-content-file input {
    opacity: 0;
    height: 100%;
    width: 100%;
}




.upload-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media screen and (max-width: 600px) {
    .home-content {
        padding-top: constant(safe-area-inset-top);
        padding-top: env(safe-area-inset-top);
        list-style: none;
        height: 100%;
        width: 100vw;
        position: fixed;
        z-index: 1000000;
        background-color: white;
        flex-direction: column;
        border-left: 1px solid #fcfcfc;
        text-align: center;
        word-break: break-word;
        top: 0;
        left: 100%;
        border: none;
        border-radius: 0;

    }

    .home-content__show {
        left: 0;
    }

    .home-content .home-content-title .home-content-title-box {
        display: flex;
        align-items: center;
    }

    .home-content .home-content-title .home-content-title-back {
        display: block;
        height: 12px;
        width: 12px;
        margin: 0 10px;
        border: 2px solid transparent;
        border-top-color: #aaa;
        border-left-color: #aaa;
        transform: rotate(-45deg);
    }

    .home-content .home-content-input {
        height: 32px;
        background-color: white;
        padding-top: .75rem;
        padding-bottom: .75rem;
        padding-bottom: calc(constant(safe-area-inset-bottom) + 0.75rem);
        padding-bottom: calc(env(safe-area-inset-bottom) + 0.75rem);
        display: flex;
        align-items: flex-end;
        justify-content: center;

        &:focus-within {
            padding-bottom: 0.75rem;
        }
    }

    .home-content .home-content-input .home-content-input-btns {
        flex-direction: row;
    }

    .home-content .home-content-input .home-content-input-btns button {
        margin: 0 0 0 5px !important;
    }
}
</style>