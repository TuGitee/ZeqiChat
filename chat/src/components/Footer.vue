<template>
    <footer>
        <a href="http://beian.miit.gov.cn/" target="_blank">闽ICP备2023012139号</a>
    </footer>
</template>

<style lang="less" scoped>
footer {
    text-align: center;
    font-size: 12px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    margin-bottom: 10px;
    line-height: 1;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    
    a {
        color: #bbb;
        text-decoration: none;
        font-size: 12px;
        &:hover {
            color: rgb(216, 65, 65);
        }
    }
}
</style>