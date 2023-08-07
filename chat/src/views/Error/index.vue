<template>
    <h1>{{ msg }}</h1>
</template>

<script>
export default {
    name: 'Error',
    computed: {
        msg: () => `Can't find the page ${this.router.currentRoute.path} you are looking for!`
    }
}
</script>