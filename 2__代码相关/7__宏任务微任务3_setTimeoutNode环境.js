
// Node中setTimeout与Promise执行顺序测试
console.log('1');//
setTimeout(function () {
    console.log('2');//
    new Promise(function (resolve) {
        console.log('3');//
        resolve();
    }).then(function () {
        console.log('4');//
    })
});
new Promise(function (resolve) {
    console.log('5');//
    resolve();
}).then(function () {
    console.log('6');//
});
setTimeout(function () {
    console.log('7');//
    new Promise(function (resolve) {
        console.log('8');//
        resolve();
    }).then(function () {
        console.log('9');//
    });
})
// /1 5 6 2 3 7 8 4 9