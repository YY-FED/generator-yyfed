// ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用哪些规则。改变一个规则设置，你必须设置规则 ID 等于这些值之一：
// "off" 或 0 - 关闭规则
// "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
// "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)

// 关于always和never的说明，可以参考http://eslint.cn/docs/rules/init-declarations
module.exports = {
    "root": true,
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"]
    }
};