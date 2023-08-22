export function throttleFun(fn, wait = 500) {
    let last, now
    return function () {
        now = Date.now()
        if (last && now - last < wait) {
            last = now
        } else {
            last = now
            fn.call(this, ...arguments)
        }
    }
}
 
export function debounceFun(fn, wait = 500) {
    let timer
    return function () {
        let context = this
        let args = arguments
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, wait)
    }
}