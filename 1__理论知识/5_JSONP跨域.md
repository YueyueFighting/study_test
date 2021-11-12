# 1.前端页面由哪三层构成？作用？
- 1.**结构**层：由HTML 或 xhtml之类的标记语言负责创建，表示展示什么
- 2.**表示**层：由CSS负责如何去展示
- 3.**行为**层：由JS负责网页行为相应

# 2.JSONP实现跨域原理
跨域的安全限制都是对浏览器端来说的，服务器端是不存在跨域安全限制的。
- 跨域：由于浏览器的同源策略导致
- 同源： 端口号，域名，协议 都相同

## 1.用 script src="" 来完成一个跨域请求
前端：

```
必须使用scipt标签，否则返回的数据不会被当作js执行
<script>
        //回调函数
        function showData (result) {
            console.log(result.msg)
        }

        $(document).ready(function () {
            $("#btn").click(function () {
                //向头部输入一个脚本，该脚本发起一个跨域请求
                $("head").append(
                    "<script src='http://localhost:9090/student?callback=showData'><\/script>"
                );
            });
        });
</script>
```
声明了showData函数，但是没有执行，如果服务端接收到get请求，返回的数据是showData({msg:'hello'}),
服务端可以把数据通过函数执行传参的方式实现数据传递


服务端：
```
    //前端传过来的回调函数名称
    String callback = request.getParameter("callback");

    //用回调函数名称包裹返回数据，这样，返回数据就作为回调函数的参数传回去了
    result = callback + "(" + result + ")";
```

结果：
```
http://localhost:9090/student?callBack=showData&tel=123456
```
## 2.jquery的jsonp方式跨域请求
前端：
```
<html>
<head>
    <title>跨域测试</title>
    <script src="js/jquery-1.7.2.js"></script>
    <script>
        function showData (data) {
            console.info("调用showData");
        }

        $(document).ready(function () {
            $("#btn").click(function () {
                $.ajax({
                    url: "http://localhost:9090/student",
                    type: "GET",

                    dataType: "jsonp",  //指定服务器返回的数据类型
                    jsonp: "theFunction",   //指定参数名称
                    jsonpCallback: "showData",  //指定回调函数名称
                    
                    success: function (data) {
                        console.info("调用success");
                    }
                });
            });
        });
    </script>
</head>
<body></body>
</html>
```
后端：
```
    // 1.指定参数名: 
    // 前端传过来的回调函数名称
    String callback = request.getParameter("theFunction");
    // 用回调函数名称包裹返回数据，这样，返回数据就作为回调函数的参数传回去了
    result = callback + "(" + result + ")";

    // 2.不指定
    result = callback + "(" + result + ")";

    response.getWriter().write(result);
```
结果：
```

// 指定参数名 theFunction
URL: http://localhost:9090/student?theFunction=showData&tel=123456

// 不指定
URL: http://localhost:9090/student?callBack=showData&tel=123456

```

### 总结：
- jQuery ajax方式以jsonp类型发起跨域请求，其原理跟script脚本请求一样，因此使用jsonp时也只能使用GET方式发起跨域请求。
- 跨域请求需要服务端配合，设置callback，才能完成跨域请求.(callback参数定义的方法是需要前后端定义好的)
- jsonp的整个过程就类似于前端声明好一个函数，后端返回执行函数