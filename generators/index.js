'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const generators = require('yeoman-generator');
const copydir = require('copy-dir');

const scaffold = require('./scaffold');

var dd = generators.Base.extend({
    initializing: function(){
        this.scaffoldOpts = [];
        this.opts = {};

        // 目录名检测
        this.argument('folder', { type: String, required: true });
        if(fs.existsSync(this.destinationPath(this.folder))){
            this.log(chalk.bgRed.bold.white(`项目名 ${ this.folder } 已存在，请更换其他名字。`));
            process.exit(0);
        }

        // 遍历项目加入到可选项中
        Object.keys(scaffold).forEach(function(name, idx){
            this.scaffoldOpts.push({
                name,
                value: name
            });
        }.bind(this));
    },
    prompting: function () {
        return new Promise(function(resolve, reject){
            this.prompt([{
                type: 'list',
                name: 'appname',
                message: '请选择项目',
                choices: this.scaffoldOpts,
                store: true
            }]).then(function(app){
                this.opts.appname = app.appname;
                resolve();
            }.bind(this));
        }.bind(this));
    },
    default: function(){
        this.composeWith(`fed:${ this.opts.appname }`, {
            arguments: this.folder
        }, {
            local: require.resolve(`./scaffold/${ this.opts.appname }`)
        });
    },
    install: function(){
        // console.log('安装基础依赖');
    }
});

module.exports = dd;