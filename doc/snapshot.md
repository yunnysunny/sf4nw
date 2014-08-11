## 截图工具 ##
截图工具是SF4NW自带的致力于解决网页截图的工具，它提供一个webservice，只要你按照规定指定一个要访问的url，该webservice就返回此url的网页截图。  
###1.环境配置###
截图工具依赖于PhantomJS和node.js，所以要先安装这两个软件。首先到PhantomJS官网的下载页（[http://phantomjs.org/download.html](http://phantomjs.org/download.html)）下载可执行程序。下载完成之后解压到任意目录，然后将phantomjs下的bin目录添加到环境变量path中。
对于centos系统，需要安装字体相关程序，才能正常截图，可运行如下命令来安装：  

`yum install -y freetype fontconfig font-chinese font-ISO8859-2`  

其中freetype和fontconfig是PhantomJS官网要求系统中必须安装的；对于命令行安装的操作系统，很有可能没有安装中文字体，所以还需要安装font-chinese和font-ISO8859-2两个软件包。  
对于中文版的ubuntu或者windows不需要安装第三方的软件包，就可以用。
然后安装node.js，从nodejs官网页（[http://nodejs.org/download/](http://nodejs.org/download/)）下载可执行程序。安装完成后，确保node目录下的bin目录添加到环境变量path中（windows版的安装程序，安装过程中会提示是否添加到环境变量）。  
###2.启动###
将本项目通过git clone或者通过直接下载zip文件然后解压缩的方式，在您的本地硬盘中进入截图工具目录，在其下会看到index.js文件，运行`node app.js`即可。
> 注意对于命令行环境的centos要运行`DISPLAY=:0 node app.js`，否则截出来的图片内容是空白的。

###3.调用###
启动完毕后再浏览器中输入：  

`http://ip:81/snapshot?url=你要截图的网页地址&refresh=是否更新截图`  

默认情况下，截过一次图后，服务器上会有缓存的截图文件。此参数赋值为1，则强制重新截图。也可以省略refresh参数，那么默认就是优先使用缓存的策略。其中ip为部署node机器的ip.

  

  
