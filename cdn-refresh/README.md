


# tencent-cdn-refresh-cli 腾讯云CDN刷新工具

==注意：日刷新有次数限制，谨慎使用。==
==注意：禁止刷新域名根目录==

安装
```
npm config set registry https://registry.npmjs.org/
npm i -g tencent-cdn-refresh-cli --save

```


创建文件 dorefresh.sh 并赋执行权限

```shell
#!/bin/bash

type=$1
param=$2

if  [ ! -n "$type" ] ;then
    echo "[error] type 参数为空"
    exit 1;
fi
if  [ ! -n "$param" ] ;then
    echo "[error] param 参数为空"
    exit 1;
fi
echo '--Start--'
tencent-cdn-refresh-cli \
-i 请替换appkey \
-k 请替换appsecret \
-t $type \
-p $param

echo '--End--'
```



使用方式

```
说明：
    dorefresh.sh <type> <param>

1. URL
dorefresh.sh url http://path/xxx.xx

2. 目录
dorefresh.sh dir http://path/xxx
```
