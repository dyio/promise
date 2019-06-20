 // let Promise2 =  require('../../dist/index');
 import Promise2  from '../../dist';
 import chai from 'chai';

 let assert = chai.assert;

describe('测试promise的基础功能then',function(){
    it('测试promise成功回调',function(done){
        let p = new Promise2(function(resolve){
            setTimeout(function(){
                resolve();
            },1000);
        })

        p.then(()=>{
            done();
        })
    });
    it('测试promise失败回调',function(done){
        let p = new Promise2(function(resolve,reject){
            setTimeout(function(){
                reject();
            },1000);
        })

        p.then(null,()=>{
            done();
        })
    });

    it('promise的then通过return传值',function(){
        let value ='lala'
        let p = new Promise2(function(resolve,reject){
            setTimeout(function(){
                resolve(value);
            },1000);
        })

        p.then(value1=>{
            return value1; 
        }).then(value2=>{
            assert.strictEqual(value,value2,'promise的传值完全相等。');
        })
    });
});