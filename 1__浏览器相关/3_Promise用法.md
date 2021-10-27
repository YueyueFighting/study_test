Promise 是一个构造函数
- 链式调用（解决回调地狱)
- 状态锁定、
- 三种状态：pending/reslove/reject 

```
var p = new Promise();
p本身具有： all、race、allSettled、any等方法
原型上具有： catch、then、finally等方法
```

# (一)基本用法：
- 用Promise的时候一般是包在一个函数中，在需要的时候去运行这个函数(看eg2)
- 当放在函数里面的时候只有调用的时候才会被执行

```
function promiseDemo {
  return new Promise((resolve, reject) => {
  // code
  resolve('success')
  // code 
  reject('failed') 
  })
}

promiseDemo.then((result) => {
  console.log(result)
}, (result) => {
  console.log(result)
})

<!-- e2 -->
// 构造函数的样式，不用调用，直接声明也会执行
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('执行)
    resolve('成功')
  }, 3000)
})

```
promise的最终状态会凝固，成功了以后即便再执行reject('failed')状态也不会改变。
## 1.then
- 接收两个参数，第一个对应resolve的回调，第二个对应reject的回调

```
promiseDemo
.then((result) => {
  console.log(result)
}, (result) => {
  console.log(result)
})
```
# 2.catch 
- 1.相当于then的第二个参数
- 2.可以捕获异常(与我们的try/catch语句有相同的功能)

```
promiseDemo
.then((result) => {
  console.log(result)
})
.catch((result) => {
  console.log(result)
})
```

# （二）链式调用
promise的 then 方法之后会继续返回一个promise对象

```
let test = new Promise((resolve, reject) => {
    let random = Math.random()
    if (random > 0.5) {
        resolve('大于0.5')
    } else {
        reject('小于等于0.5')
    }
})

let p = test.then((result) => {
    console.log(result)
    return result
}).catch((result) => {
    console.log(result)
    return result
}).then((result) => {
    console.log(result)
    return result
}).then((result) => {
    console.log('last', result)
})

console.log(p)
```

在then方法中继续写Promise对象并返回，然后继续调用then来进行回调操作

```

promiseClick()
.then(function(data){
    console.log(data);
    // 在runAsync2中传给resolve的数据，能在接下来的then方法中拿到
    return runAsync2(); 
})
.then(function(data){
    console.log(data);
    return runAsync3();
})
.then(function(data){
    console.log(data);
});

```


