const a = new Promise((resolve, reject) => {
    resolve("aaaaa")
})
console.log(a.then().then())



const REJECTED = 'REJECTED';
const FULFILLED = 'FULFILLED';
const PENDING = 'PENDING';

function isPromise(val) {
    if (typeof val === 'object' && val !== null || typeof val === 'function') {
        return typeof val.then === 'function';
    }
    return false;
}

const resolvePromise = (promise2, x) => {
    const {resolve, reject} = promise2;
    if (promise2 === x) return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        let called;
        try {
            const then = x.then;
            if (typeof then !== 'function'){
                resolve(x);
            }else {
                then.call(x, (res) => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, res);
                },(err) => {
                    if (called) return ;
                    called = true;
                    reject(err);
                })
            }
        } catch(err){
            if (called) return;
            called = true;
            reject(err);
        }
    }else {
        resolve(x);
    }
}
class Promise {
            constructor(executor){
                this.status = PENDING;
                this.value = undefined;
                this.reason = undefined;
                this.onResolvedCallbacks = [];
                this.onRejectedCallbacks = [];

                const resolve = (value) => {
                    if (value instanceof Promise) {
                        return value.then(resolve, reject);
                    }
                    if (this.status === PENDING){
                        this.status = FULFILLED;
                        this.value = value;
                        this.onResolvedCallbacks.forEach(fn => fn())
                    }
                };
                const reject = reason => {
                    if (this.status === PENDING) {
                        this.status = REJECTED;
                        this.reason = reason;
                        this.onRejectedCallbacks.forEach(fn => fn());
                    }
                };
                try {
                    executor(resolve, reject);
                }catch(err){
                    reject(err);
                }
            }
            then(onFulfilled, onRejected) {
                onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
                onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};
                const promise2 = new Promise((resolve, reject) => {
                    if (this.status === FULFILLED){
                        setTimeout(() => {
                            promise2.resolve = resolve;
                            promise2.reject = reject;
                            try {
                                const x = onFulfilled(this.value);
                                resolvePromise(promise2, x);
                            }catch(err) {
                                reject(err);
                            }
                        },0)
                    }
                    if (this.status === REJECTED) {
                        setTimeout(() => {
                            promise2.resolve = resolve;
                            promise2.reject = reject;
                            try {
                                const x = onRejected(this.reason);
                                resolvePromise(promise2, x);
                            } catch(err) {
                                reject(err);
                            }
                        },0)
                    }

                    if (this.status === PENDING) {
                        this.onResolvedCallbacks.push(()=>{
                            setTimeout(()=>{
                                promise2.resolve = resolve;
                                promise2.reject = reject;
                                try {
                                    const x = onFulfilled(this.value);
                                    resolvePromise(promise2, x);
                                } catch (err){
                                    reject(err);
                                }
                            })
                        });
                        this.onRejectedCallbacks.push(()=>{
                            setTimeout(()=>{
                                promise2.resolve = resolve;
                                promise2.reject = reject;
                                try {
                                    const x = onRejected(this.reason);
                                    resolvePromise(promise2, x);
                                }catch(err){
                                    reject(err);
                                }
                            })
                        })
                    }
                })
                return promise2;
            }
            catch(errCallback) {
                return this.then(null,errCallback);
            }
        }