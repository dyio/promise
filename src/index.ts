import {noop ,isObject ,isDef , isFunc ,isArray} from './utils';
import {handlerRes} from './promise-utils';

enum pStatus  {
    pending = 'pending',
    fulled = 'fullfilled',
    rejected = 'rejected'
}

export default function Promise2(executor:any) {

    if( !isFunc(executor) ){
        throw 'Promise2 传递的参数不为functon！！！';
    }

    this.status = pStatus.pending;

    this.resovlecbs = [];
    this.rejectcbs = [];
    this.value;
    this.error;

    const resolve = (value:object)=>{
        
        setTimeout(()=>{
            if(this.status===pStatus.pending){
                this.value = value;
                this.resovlecbs.forEach((item:Function)=>{
                    item(value);
                })
                this.status = pStatus.fulled;
            }
        },0)
    }

    const reject = (error:Error)=>{
        

        setTimeout(()=>{ // why
            if(this.status===pStatus.pending){
                this.error = error;
                this.status = pStatus.rejected;
                if(this.rejectcbs.length ===0){
                    throw this.error;
                }  else {
                    this.rejectcbs.forEach((item:Function)=>{
                        item(error);
                    })
                }
            }
        },0)
       // if(this.rejectcbs.length === 0 ) throw error;
    } 

    try {
        executor(resolve,reject);
    } catch (error) {
        reject(error);
    }
}



Promise2.prototype.then = function (onResolved:Function=noop,onRejected:Function=noop) {
    // this.resovlecb.push(resolve);
    // this.onRejected.push(reject);

    let scope = this;
    return new Promise2(function(resolve = noop,reject = noop){
        if(scope.status === pStatus.pending) {
            scope.resovlecbs.push((value)=>{
                handlerRes(onResolved,value,resolve);
            })
            scope.rejectcbs.push((error)=>{
                handlerRes(onRejected,error,reject);
            })
        } else if(scope.status===pStatus.fulled) {
            handlerRes(onResolved,scope.value,resolve);
        } else { // rejectd
            handlerRes(onRejected,scope.error,reject);
        }
    });
}

Promise2.prototype.catch = function(catchcb:Function) {
    return this.then(undefined, catchcb);
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
        throw 'race函数 传递的参数不为Array！！！';
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
                !hasResolve && resolve(ifunc)
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
                if(handlerNum>=arr.length){ // 彻底完成
                    resolve(resArr)
                }
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