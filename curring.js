const add = (a, b, c) => a + b + c

function curring (fn, ...args) {
    const num = fn.length
    let allArgs = [...args]
    const res = (...arg) => {
        allArgs = [...allArgs, ...arg]
        if (num === allArgs.length) {
            return fn(...allArgs)
        } else {
            return res
        }
    }
    return res
}