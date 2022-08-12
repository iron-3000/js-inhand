const removeDuplicate = (arr) => {
    return [...new Set(arr)]
}

const removeDuplicate2 = (arr) => {
    const res = []
    arr.reduce((pre, next) => {
        if (!pre.has(next)) {
            pre.set(next, 1)
            res.push(next)
        }
        return pre
    }, new Map())
    return res
}