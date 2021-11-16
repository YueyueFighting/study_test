# Promise 是一个构造函数
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
#
#
#
#
# Promise状态

- pending: 进行中
- fulfilled: 操作成功完成
- rejected: 操作失败
- settled: 要么完成要么失败，一旦状态达成，就不再改变


## JS 的 Promises 来说

- **基元函数包括:**
  - Promise.resolve()
  - Promise.reject()

- **组合函数：**
  - Promise.all(), 
  - Promise.race(),
  - Promise.allSettled()


## 1. Promise.all()

```
<!-- 完成状态结果是一个数组 -->
<!-- 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果 -->
const promises = [
  Promise.resolve('a'),
  Promise.resolve('b'),
  Promise.resolve('c'),
];

Promise.all(promises)
  .then((arr) => assert.deepEqual(
    arr, ['a', 'b', 'c']
  ));


```


## 2. Promise.race()

**不管是成功（完成）还是失败，最终都会返回先有执行结果的那个**
## 适用场景：
- fetch api没提供timeout, 可以用race模拟一个请求超时

```
 function getData1() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('第一条数据加载成功')
                    reject('data1')
                }, 500)
            })
        }

        const demo1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('demo1成功')
                resolve('demo1')
            }, 400)
        })

        // 注意，Promise 默认会执行，所以如果是直接定义的Promise函数不用调用，
        // 如果用函数包裹的话，需要调用函数
        Promise.race([getData1(), demo1,])
            .then(result => {
                console.log('================result=================== ', result);
            })
            .catch((fail) => {
                console.log('================fail=================== ', fail);
            })
       

```


## 3. Promise.allSettled()
Promise.allSettled()方法返回一个promise，该promise在所有给定的promise已被解析或被拒绝后解析，并且每个对象都描述每个promise的结果。

**当Promise全部处理完成后我们可以拿到每个Promise的状态, 而不管其是否处理成功.**

```
<!-- 该promise在所有给定的promise已被解析或被拒绝后解析，并且每个对象都描述每个promise的结果。 -->
Promise.allSettled([])
```

# 2.短路特性
Promise.all() 和 romise.race() 都具有 短路特性
- Promise.all()： 如果参数中 promise 有一个失败（rejected），此实例回调失败（reject）
- Promise.race()：如果参数中某个promise解决或拒绝，返回的 promise就会解决或拒绝。


# 3.并发性和 Promise.all()

- 顺序执行

p2要等到p1执行完才会执行
```

p1()
.then(data1 => {
  console.log('p1的执行结果', data1);
  return p2();
})
.then(data2 => {
  console.log('p3的执行结果', data2);
  return p3();
})

```

- 并发执行

**确定并发异步代码的技巧:**
- 关注异步操作何时启动，而不是如何处理它们的Promises。

```
Promise.all([p1(), p2()]).then(data => {

})
```
- 1
```
function concurrentAll() {
  return Promise.all([asyncFunc1(), asyncFunc2()]);
}

function concurrentThen() {
  const p1 = asyncFunc1();
  const p2 = asyncFunc2();
  return p1.then(r1 => p2.then(r2 => [r1, r2]));
}
```

- 2
```
function sequentialThen() {
  return asyncFunc1()
    .then(r1 => asyncFunc2()
    .then(r2 => [r1, r2])); // r2是asyncFunc2的结果
}

function sequentialAll() {
  const p1 = asyncFunc1();
  const p2 = p1.then(() => asyncFunc2());
  return Promise.all([p1, p2]);
}
```