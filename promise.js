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