/**
 * @file Simply AMD loader for Node
 * @author treelite(c.xinle@gmail.com)
 */

var path = require('path');
var currentModule;
var loadConfig = {};
var jsHandler = require.extensions['.js'];

// 通过JS加载器获取当前加载的模块
require.extensions['.js'] = function (module, filename) {
    currentModule = module;
    jsHandler.call(null, module, filename);
};

/**
 * 对象扩展
 *
 * @inner
 * @param {Object} target 目标对象
 * @param {...Object} source 待扩展对象
 * @return {Object}
 */
function extend(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    sources.forEach(function (source) {
        if (!source) {
            return;
        }

        Object.keys(source).forEach(function (key) {
            target[key] = source[key];
        });
    });

    return target;
}

/**
 * 搜索packages配置
 *
 * @inner
 * @param {string} id 模块id
 * @return {?string} 模块路径
 */
function searchPackages(id) {
    var res;
    var packages = loadConfig.packages || [];

    packages.some(function (pkg) {
        if (pkg.name === id) {
            res = path.resolve(loadConfig.baseUrl || '', pkg.location, pkg.main || '');
            return true;
        }
        else if (id.indexOf(pkg.name + '/') ===  0) {
            res = id.replace(pkg.name, path.resolve(loadConfig.baseUrl || '', pkg.location));
            return true;
        }
        return false;
    });

    return res;
}

/**
 * 创建局部require
 *
 * @inner
 * @param {Object} module Module
 * @return {Function}
 */
function localRequire(module) {

    return function (id) {
        if (id.charAt(0) === '.') {
            return module.require(id);
        }

        var pkg = searchPackages(id);
        if (pkg) {
            return module.require(pkg);
        }

        if (loadConfig.baseUrl) {
            id = path.resolve(loadConfig.baseUrl, id);
        }

        return module.require(id);
    };

}

/**
 * 全局define函数
 *
 * @public
 * @param {Function} fn 定义函数
 */
global.define = function (fn) {
    var module =  currentModule;
    module.exports = fn(localRequire(module));
};


/**
 * 加载配置
 *
 * @public
 * @param {Object} options 配置信息
 * @param {string} options.baseUrl 根路径
 * @param {Array.<Object>} options.packages package配置
 */
exports.config = function (options) {
    loadConfig = extend(loadConfig, options);
};
