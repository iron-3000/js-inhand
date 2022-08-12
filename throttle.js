function throttle (fn, delay = 200) {
    let flag = true
    return function (...args) {
        if (!flag) {
            return
        }
        flag = false
        let timer = setTimeout(() => {
            fn.apply(this, args)
            flag = true
            clearTimeout(timer)
        },delay)
    }
}