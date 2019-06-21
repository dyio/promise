import Promise2 from "../../dist";
import chai from 'chai';

let expect = chai.expect;

describe('测试promise.reject方法',function(){
    it('测试promise reject直接返回rejected状态对promise',function(){
        let message = 'lala';
        const p =  Promise2.reject(message);
        p.then(()=>{},(err)=>{
              expect(err).to.equal(message);
        });
    })
})