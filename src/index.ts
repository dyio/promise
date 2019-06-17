
enum pStatus  {
    pending = 'pending',
    fulled = 'fullfilled',
    rejected = 'rejected'
}

function Promise2(cb:Function) {
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
        },0)
    }

    const reject = (value:object)=>{
        this.error = value;
        setTimeout(()=>{
            this.rejectcbs.forEach((item:Function)=>{
                item(value);
            })
        },0)
    } 

    cb(resolve,reject);
}

Promise2.prototype.then = function (resolvecb:Function,rejectcb:Function) {
    // this.resovlecb.push(resolve);
    // this.rejectcb.push(reject);
    let scope = this;
    return new Promise2(function(resolve,reject){
        if(scope.status === pStatus.pending) {
            scope.resovlecbs.push((value)=>{
                let res = resolvecb(value);
                resolve(res);
            })
            scope.rejectcbs.push((value)=>{
                let res = rejectcb(value);
                reject(res);
            })
        } else if(scope.status===pStatus.fulled) {
            let res = resolvecb(scope.value);
            resolve(res);
        } else { // reject
            let res = rejectcb(scope.value);
            reject(res);
        }
    });
}