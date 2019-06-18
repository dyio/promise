import {noop ,isObject ,isDef , isFunc} from './utils';

enum pStatus  {
    pending = 'pending',
    fulled = 'fullfilled',
    rejected = 'rejected'
}

export default function Promise2(cb:any) {

    if( !isFunc(cb) ){
        throw 'Promise2 传递的参数不为functon！！！';
    }

    this.status = pStatus.pending;

    this.resovlecbs = [];
    this.rejectcbs = [];
    this.value;
    this.error;

    const resolve = (value:object)=>{
        this.value = value;
        setTimeout(()=>{
            this.resovlecbs.forEach((item:Function)=>{
                item(value);
            })
            this.status = pStatus.fulled;
        },0)
    }

    const reject = (error:Error)=>{
        this.error = error;

        setTimeout(()=>{ // why
            this.status = pStatus.rejected;
            if(this.rejectcbs.length ===0){
                throw this.error;
            }  else {
                this.rejectcbs.forEach((item:Function)=>{
                    item(error);
                })
            }
        },0)
       // if(this.rejectcbs.length === 0 ) throw error;
    } 

    try {
        cb(resolve,reject);
    } catch (error) {
        reject(error);
    }
}

Promise2.prototype.then = function (resolvecb:Function=noop,rejectcb:Function=noop) {
    // this.resovlecb.push(resolve);
    // this.rejectcb.push(reject);
    let scope = this;
    return new Promise2(function(resolve = noop,reject = noop){
        if(scope.status === pStatus.pending) {
            scope.resovlecbs.push((value)=>{
                let res = resolvecb(value);
                resolve(res);
            })
            scope.rejectcbs.push((error)=>{
                let res = rejectcb(error);
                reject(res);
            })
        } else if(scope.status===pStatus.fulled) {
            let res = resolvecb(scope.value);
            resolve(res);
        } else { // rejectd
            let res = rejectcb(scope.error);
            reject(res);

        }
    });
}

Promise2.prototype.catch = function(catchcb:Function) {
    return this.then(null, catchcb);
}

// hack  但是不对
Promise2.prototype.finally = function (callback) {
   return this.then((value)=>{
        callback();
        return value;
   },callback);
}

Promise2.resolve = function(handler){
    if(  isObject(handler)  && 'constructor' in handler && handler.constructor=== this) { // handler 是 Promise2
        return handler;
    } else if (isObject(handler) && 'then' in handler){ // thenable
        return new this(handler.then);
    } 
    //else if( isDef(handler)  && (  !isObject(handler) || !('then' in handler)) ) { // 不为then()
    //     return new this(function(resolve){
    //         resolve(handler);
    //     })
    // }
    else { // unDef
        return new this(function(resolve){
            resolve(handler);
        })
    }   
}

Promise2.reject = function() {
    const args = Array.prototype.slice.call(arguments);
    return new this((resolve, reject) => reject(args.shift()));
}

Promise2.all = function() {}


// Promise2.prototype.finally = function (callback) {
//     let Constructor = this.constructor;
//     return this.then(
//       value  => Constructor.resolve(callback()).then(() => value),
//       reason => Constructor.resolve(callback()).then(() => { throw reason })
//     );
// };