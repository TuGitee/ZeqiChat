const WORLD_ID = 2023

const WebSocketType = {
    Error: 0,
    GroupList: 1,
    GroupChat: 2,
    PrivateChat: 3,
    System: 4,
    PrivateRead: 5,
    WorldItem: 6,
    WorldRead: 7,
    FriendRequest: 8,
    FriendAccept: 9,
    FriendReject: 10
}

module.exports = {
    WORLD_ID,
    WebSocketType
}