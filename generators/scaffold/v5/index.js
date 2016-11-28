'use strict';

const path = require('path');
const mkdirp = require('mkdirp');
const copydir = require('copy-dir');
const chalk = require('chalk');
const yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
    initializing: function(){
        // 获取需要创建的目录名
        this.folder = this.arguments[0];
        this.opts = {};

        // 创建项目目录
        mkdirp.sync(this.destinationPath(this.folder));

        // 切换工作目录
        process.chdir(path.join(process.cwd(), this.folder));
    },
    prompting: function(){
        // 可加入自己的可选项，比如说是否支持sass/less等
        return new Promise(function(resolve, reject){
            this.prompt([{
                type: 'list',
                name: 'framework',
                message: '请选择开发框架',
                choices: [{name: '不使用框架', value: 'none'}, {name: 'VUE', value: 'vue'}],
                store: true
            }, {
                type: 'checkbox',
                name: 'lib',
                message: '请选择开发类库',
                choices: [{name: 'jquery', value: 'jquery'}, {name: 'zeptojs', value: 'zeptojs'}],
                store: true
            }, {
                type: 'list',
                name: 'jscompile',
                message: '请选择js预编译类型',
                choices: [{name: '不使用js预编译', value: 'none'}, {name: 'babeljs', value: 'babeljs'}],
                store: true
            }, {
                type: 'list',
                name: 'csscompile',
                message: '请选择css预编译类型',
                choices: [{name: '不使用css预编译', value: 'none'}, {name: 'SASS', value: 'sass'}],
                store: true
            }]).then(function(args){
                this.opts = Object.assign(this.opts, args);
                console.log(111, this.opts);
                resolve();
            }.bind(this));
        }.bind(this));
    },
    configuring: function(){
        // 复制 .editorconfig 等配置
        // 如果目录结构不是根目录的话，需要修改路径
        copydir.sync(this.templatePath('../../../.config/'), this.destinationPath(this.folder));
        this.log(chalk.green.bold('创建配置文件成功!'));
    },
    default: function(){
        // 其他中间处理方法
    },
    writing: {
        templates: function(){
            // 复制项目模板
            copydir.sync(this.templatePath(), this.destinationPath(this.folder), function(stat, filepath, filename){
                // package.json 文件不复制
                if(filename === 'package.json'){
                    return false;
                }
                return true;
            });
        },
        config: function(){
            this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath(this.folder, 'package.json'),
                {
                    name: this.folder
                }
            );
        },
        done: function(){
            this.log(chalk.green.bold('成功创建项目模板!'));
        }
    },
    install: {
        start: function(){
            this.log(chalk.yellow.bold('开始安装项目依赖...'));
        },
        npm: function(){
            // npm依赖安装
            // this.npmInstall([ 'csscomb', 'editorconfig', 'eslint', 'gulp' ], { 'saveDev': true }, function(){
            //     this.log(chalk.green.bold('项目依赖已安装完成!'));
            // }.bind(this));
        },
        bower: function(){
            // bower依赖安装
            // this.bowerInstall([ 'csscomb', 'editorconfig', 'eslint', 'gulp' ], { 'saveDev': true }, function(){
            //     this.log(chalk.green.bold('项目依赖已安装完成!'));
            // }.bind(this));
        },
        package: function(){
            this.installDependencies({
                bower: false,
                npm: true,
                callback: function(){
                    this.log(chalk.green.bold('项目依赖已安装完成!'));
                }.bind(this)
            });
        }
    },
    end: function(){
        console.log('huya end');
    }
});