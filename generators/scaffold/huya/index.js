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

        // 创建项目目录
        mkdirp.sync(this.destinationPath(this.folder));
        this.log(chalk.green.bold('创建项目目录成功!'));

        // 切换工作目录
        process.chdir(path.join(process.cwd(), this.folder));
    },
    prompting: function(){
        // 可加入虎牙自己的可选项，比如说是否支持sass/less等
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
                npm: false,
                yarn: true,
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