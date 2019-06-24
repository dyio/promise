import {isFunc} from './utils';

export enum pStatus  {
    pending = 'pending',
    fulled = 'fullfilled',
    rejected = 'rejected'
}

export function deepGet(res,Promise2,nextResolve,nextReject){
    if(res && res instanceof Promise2) {
        if(res.status===pStatus.pending){
            res.then(value=>{
                deepGet(value,Promise2,nextResolve,nextReject)
            },err=>{
                nextReject(err)
            })
        }
    } else {
        nextResolve(res);
    }
}

export function handlerRes(handler,message,nextResolve,nextReject,Promise2){
    let res 
    if(isFunc(handler)){
        res = handler(message);
    }
    deepGet(res,Promise2,nextResolve,nextReject)
}