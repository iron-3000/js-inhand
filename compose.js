function fn1 (x) {
    return x + 1
}

function fn2 (x) {
    return x + 2
}

function fn3 (x) {
    return x + 3
}

function fn4 (x) {
    return x + 4
}

const compose = (...fns) => {
    if (fns.length === 0) return (num) => num
    if (fns.length === 1) return fns[0]
    return fns.reduce((pre, next) => {
        return (num) => {
            return pre(next(num))
        }
    })
}