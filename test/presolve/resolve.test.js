import Promise2  from '../../dist';
import chai from 'chai';

let expect = chai.expect;

/**
 * 根据阮一峰的es6一书提出的测试方案
 */

describe('测试promise.resolve功能',function(){
    it('测试reslove 原封不动返回promise',function(){
        let p = new Promise2(function(){});
        let pt = Promise2.resolve(p);
    
        expect(p).to.equal(pt);
    })

    it('测试reslove thenable的处理方式。',function(){
        let message = 'lala';
        let thenable = {
            then: function(resolve, reject) {
              resolve(message);
            }
        };
        let pt = Promise2.resolve(thenable);
    
        pt.then(value=>{
            expect(value).to.equal(message);
        })
    })

    it('测试reslove 传递非promise和thenable的处理方式。',function(){
        let message = 'lala';
        let pt = Promise2.resolve(message);
    
        pt.then(value=>{
            expect(value).to.equal(message);
        })
    })

    it('测试reslove 没有传递数据，传递的是undefined',function(){
        let pt = Promise2.resolve();
    
        pt.then(value=>{
            expect(value).to.be.an('undefined');
        })
    })



})
