import Promise2  from '../../dist';
import chai from 'chai';
let assert = chai.assert;

 describe('测试promise的基础功能catch',function(){
    it('测试promise错误抛出捕获',function(done){
      let message = 'lala'
      let p = new Promise2(function(resolve){
         throw message;
      })

      p.catch(error=>{
            assert.strictEqual(message,error,'完全相同。。');
            done()
      })
    });

    it('测试promise从reject',function(done){
      let message = 'lala'
      let p = new Promise2(function(resolve,reject){
         reject(message)
      })
      
      p.catch(error=>{
            assert.strictEqual(message,error,'完全相同。。');
            done()
      })
    });
 })