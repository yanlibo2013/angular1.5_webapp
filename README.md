
=========================
angularjs + requirejs
gulp构建项目

#项目结构

- app
	- css
	- img
	- js
		- controllers(控制器)
		- directives(指令集)
		- filters(过滤器)
		- providers
		- services(公共服务)
		- main.js (requireJS 入口)
		- routes.js (路由)
	- lib (第三方js包) (Note that libraries can be managed using Bower)
	- views (视图)
- node_modules	(依赖模块，本地安装时会下载依赖，没必要加到版本控制)
- scripts (postinstall脚本)
	- config
- build(打包完之后的目录，没必要加到版本控制)

#前提

需要在本机安装nodejs, 具体安装方式见官网 http://nodejs.org/

#安装

> npm install -g gulp

> npm install

#运行项目

> gulp server

会自动打开浏览器

#打包项目

> gulp build

#预览打包之后效果

> gulp pre-release