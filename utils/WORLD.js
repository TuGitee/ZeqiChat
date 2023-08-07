const WORLD_ID = 2023

const WebSocketType = {
    Error: 0,
    GroupList: 1,
    GroupChat: 2,
    PrivateChat: 3,
    System: 4,
    PrivateRead: 5,
    WorldItem: 6,
    WorldRead: 7
}

module.export = {
    WORLD_ID,
    WebSocketType
}