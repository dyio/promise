import {isFunc} from './utils';

export enum pStatus  {
    pending = 'pending',
    fulled = 'fullfilled',
    rejected = 'rejected'
}

export function deepGet(res,Promise2,nextResolve,nextReject){  // Promise A+ 3.2
    if(res && res instanceof Promise2) {
        if(res.status===pStatus.pending){ // Promise A+ 3.2
            res.then(value=>{
                deepGet(value,Promise2,nextResolve,nextReject)
            },err=>{
                nextReject(err)
            })
        }
    } else {
        nextResolve(res); // Promise A+ 2.7.1
    }
}

export function handlerRes(handler,message,nextResolve,nextReject,Promise2){
    let res 
    if(isFunc(handler)){
        try {  
            res = handler(message);
        } catch (error) {// A+ 2.7.2
            nextReject(error);
        }
    }
    deepGet(res,Promise2,nextResolve,nextReject)
}