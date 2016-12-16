# 虎牙专题构建配置使用说明

# 安装

## 1. 安装 **yeoman**
```
npm i -g yo 
```
## 2. 安装脚手架 
```
npm i -g generator-yyfed
```
## 3. 下载项目
```
git clone https://github.com/YY-FED/generator-yyfed.git

// 或者直接到 https://github.com/YY-FED/generator-yyfed 下载文件
```
## 4. 进入刚才的下载的**generator-yyfed**文件夹
执行命令
```
npm link
```

## PS： 以上步骤只需执行一次，当我们的模板文件更新的时候，再次从github上拉取文件，重新**npm link**就行了

## 5. 进入任意文件夹
执行命令
```
yo yyfed projectname
```
然后就在该文件夹下面看到你的项目了

# 使用
### 生成的项目包括了一些基本的文件，你可以在该项目里进行开发了，我写了（四处扒了）一套比较基本的**gulp**配置

```
开发阶段命令为 gulp  dev
```
完成的功能大概如下：
- sass 编译
- 本地服务器
- liveroad
- sourcemaps
```
发布阶段命令为 gulp dist,
需要找到gulpfile.js 文件里的**publishPath**变量，把路径改为你的发布路径
```
功能大概如下：
- html,css,js，imgs压缩
- md5后缀
- 发布完之后直接打开发布的文件夹


### 大概的就是这样，后期大家可以抽出一些公用的文件，作为模板再加入，还有就是构建配置还有很大的改进空间
