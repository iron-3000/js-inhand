function debounce (fn, delay = 200) {
    let timer
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
            clearTimeout(timer)
            timer = null
        },delay)
    }
}