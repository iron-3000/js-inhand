const mySetTimeout = (fn, delay) => {
    const timer = setInterval(() => {
        fn();
        clearInterval(timer)
    }, delay);
}