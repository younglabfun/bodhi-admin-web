<center class="half">
<img src="https://github.com/younglabfun/younglabfun/blob/main/image/bodhi-admin.png?raw=true" />
</center>

<center style="font-size:12px;">Copyright 2024 younglabfun.Distributed under MIT license.Bodhi Admin based on go-zero,vue-admin-template</center>




## Bodhi Admin

bodhi admin 是一个基础的后台管理系统。bodhi admin 本是为菩提辞典( https://bodhidict.com/ )开发的管理后台，在开发过程中改为独立项目开源。该项目包括后端服务、web前端两部分，包含管理后台的基本功能，用户登录、注册，菜单管理以及基于RBAC模型的角色授权控制。

- bodhi admin service: https://github.com/younglabfun/bodhi-admin-service

- bodhi admin web: https://github.com/younglabfun/bodhi-admin-web



## bodhi admin web

这是bodhi admin项目的web前端，基于 vue-admin-template 进行开发。下面为 bodhi admin web 开发、使用说明，关于 bodhi admin service部分，请移步  https://github.com/younglabfun/bodhi-admin-service



### 功能及修改说明

bodhi admin web 使用 [vue-admin-template](https://github.com/younglabfun/bodhi-admin-web/blob/main/README-zh.md) 作为基础模版进行二次开发，已经改为动态路由，需要配合 [bodhi admin service](https://github.com/younglabfun/bodhi-admin-service) 使用。

 功能

```shell
- 登录、注册、注销
- 用户管理
- 角色管理
- 菜单管理

```



### 运行

```bash
$ cd workspace/
$ npm install # 安装依赖
$ npm run dev

```



### 发布

```bash
# 编译
$ npm run build:prod

# 编译脚本
$ workspace/deploy/deploy.sh
# 脚本中包括编译打包上传服务器（需要修改配置）
```



### docker 环境运行

推荐使用docker运行该项目

```bash
#nginx 代理配置
server {
  listen       80;
  server_name  localhost;

  # service
  location ^~ /api {
  	proxy_pass http://127.0.0.1:9021;
  }

  # Web
  location / {
    proxy_pass http://127.0.0.1:9528; 
    proxy_redirect off;
  }
}
```





### 关于作者

技术实践者，热爱技术，具有20年+的开发经验，上过班，创过业，作过独立开发者，全栈，常用技术栈PHP、Python、Golang、JavaScript、CSS、VUE等；生活观察员，骑车、读书、做饭、旅行、写作、探索城市角落，爱大海，不会游泳。

#### 欢迎访问作者网站

- 小实验（作者Blog ）：https://younglab.fun/
- 菩提辞典（佛教典籍搜索）：https://bodhidict.com/

#### 资助 Donate

如果您觉得这个项目帮助到您，可以帮作者买杯咖啡表示鼓励。

<center class="half">
<img src="https://github.com/younglabfun/younglabfun/blob/main/image/wxpay.jpg?raw=true" style="width:260px"/><img src="https://github.com/younglabfun/younglabfun/blob/main/image/alipay.jpg?raw=true" style="width:260px"/>
</center>

- 使用开发中有问题可以发Email到: pagopagi(at)gmail



### License

MIT License

Copyright 2024 younglabfun
