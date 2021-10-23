Promise 是一个构造函数，
- 链式调用（解决回调地狱）
- 状态锁定



```
var p = new Promise();
p本身具有： all、race、allSettled、any等方法
原型上具有： catch、then、finally等方法
```

## 基本用法：
```
getNum(num) {
    return new Promise((resolve, reject) => {
        if(num > 5) {
            resolve('数字大于5')
        }else {
            reject('数字小于5')
        }
    })
}
```
## then
- 接收两个参数，第一个对应resolve的回调，第二个对应reject的回调

```
getNum(8)
.then(
// resolve的回调
(successData) => {
    console.log('resolved');
    console.log(successData);
},
// reject的回调
(failData) => {
    console.log('rejected');
    console.log(failData);
})
```
## catch 
- 1.相当于then的第二个参数
- 2.可以捕获异常(与我们的try/catch语句有相同的功能)
````
getNum(3)
.then((successData) => {
    console.log('resolved');
    console.log(successData);
    console.log(somedata); //此处的somedata未定义
})
.catch((failData) => {
    console.log('rejected');
    console.log(failData);

    // 会捕获到somedata的错误，提示未定义，代码会继续执行，不会报错
})
    

```