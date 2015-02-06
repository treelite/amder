/**
 * @file Simply AMD loader for Node
 * @author treelite(c.xinle@gmail.com)
 */

var currentModule;
var jsHandler = require.extensions['.js'];

// 通过JS加载器获取当前加载的模块
require.extensions['.js'] = function (module, filename) {
    currentModule = module;
    jsHandler.call(null, module, filename);
};

/**
 * 全局define函数
 *
 * @public
 * @param {Function} fn 定义函数
 */
global.define = function (fn) {
    var module =  currentModule;
    module.exports = fn(module.require);
};
