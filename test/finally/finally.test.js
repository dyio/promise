import Promise2  from '../../dist';
import chai from 'chai';

let expect = chai.expect;

describe('测试promise 的 finally方法',function(){

    it('测试promise resolve的时候 会到finally方法',function(done){
        let p = new Promise2(function(resolve){
            setTimeout(function(){
                resolve();
            },1000);
        })

        p.finally(()=>{
            done();
        })
    })

    // it('测试promise reject的时候 会到finally方法',function(done){
    //     let p = new Promise2(function(resolve,reject){
    //         reject()
    //     });

    //     try {
    //         p.then().catch().finally(()=>{
    //             done();
    //         })
    //     } catch (error) {
            
    //     }
    // })
})