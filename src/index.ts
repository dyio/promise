import {noop ,isObject ,isDef , isFunc ,isArray} from './utils';
import {handlerRes} from './promise-utils';

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
                handlerRes(resolvecb,value,resolve);
            })
            scope.rejectcbs.push((error)=>{
                handlerRes(rejectcb,error,reject);
            })
        } else if(scope.status===pStatus.fulled) {
            handlerRes(resolvecb,scope.value,resolve);
        } else { // rejectd
            handlerRes(rejectcb,scope.error,reject);
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
    } else if (isObject(handler) && isFunc(handler.then) ){ // thenable
        return new this(handler.then.bind(handler));
    }  else { // unDef
        return new this(function(resolve){
            resolve(handler);
        })
    }   
}

Promise2.reject = function() {
    const args = Array.prototype.slice.call(arguments);
    return new this((resolve, reject) => reject(args.shift()));
}

/**
 * 还在测试阶段
 */
Promise2.race = function(arr) {
    if( !isArray(arr) ){
        throw 'all函数 传递的参数不为Array！！！';
    }

    let args = Array.prototype.slice.call(arr);
    let hasResolve = false;

    return new this((resolve,reject)=>{
        for(let i = 0;i<args.length;i++){
            let ifunc = args[i];
            if(ifunc && isFunc(ifunc.then)  ) {
                ifunc.then(value=>{
                    !hasResolve &&  resolve(value)
                },error=>{
                    !hasResolve && reject(error);
                });
            } else {
                hasResolve = true;
                resolve(ifunc)
            }
        }
    })

}

Promise2.all = function(arr) {

    if( !isArray(arr) ){
        throw 'all函数 传递的参数不为Array！！！';
    }

    let args = Array.prototype.slice.call(arr);
    let resArr = Array.call(null,Array(arr.length)).map(()=>null); // 记录所有的状态
    let handlerNum = 0;

    return new this((resolve,reject)=>{
        for(let i = 0;i<args.length;i++){
            let ifunc = args[i];
            if(ifunc && isFunc(ifunc.then)  ) {
                ifunc.then(value=>{
                    resArr[i] = value;
                    handlerNum ++;
                    if(handlerNum>=arr.length){ // 彻底完成
                        resolve(resArr)
                    }
                },error=>{
                    reject(error);
                });
            } else {
                resArr[i] = ifunc;
                handlerNum ++;
            }
        }
    });
}


// Promise2.prototype.finally = function (callback) {
//     let Constructor = this.constructor;
//     return this.then(
//       value  => Constructor.resolve(callback()).then(() => value),
//       reason => Constructor.resolve(callback()).then(() => { throw reason })
//     );
// };