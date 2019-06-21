import Promise2 from "../../dist";
import chai from 'chai';

let expect = chai.expect;

describe('测试promise.all方法',function(){
    it('测试promise .all 返回对是数组',function(done){
        const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
            return new Promise2(function(resolve,reject){
                setTimeout(()=>{
                    resolve(id);
                },id);
            })
        });
    
        Promise2.all(promises).then(function (posts) {
            expect(posts).to.be.an('String');
        })
    })
})