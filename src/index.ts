import {noop} from './utils';

enum pStatus  {
    pending = 'pending',
    fulled = 'fullfilled',
    rejected = 'rejected'
}

export default function Promise2(cb:Function) {
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
        this.rejectcbs.forEach((item:Function)=>{
            item(error);
        })
        this.status = pStatus.rejected;
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
        } else { // reject
            let res = rejectcb(scope.error);
            reject(res);
        }
    });
}

Promise2.prototype.catch = function(catchcb:Function) {
    return this.then(null, catchcb);
}