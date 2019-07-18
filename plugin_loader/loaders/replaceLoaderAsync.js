//声明式函数，要用this
const loaderUtils = require('loader-utils')//官方推荐
module.exports = function (source) {
    const cb = this.async()
    const options=this.query
    setTimeout(() => {
        const result = source.replace('word', options.name + '哈哈')
        cb(null, result)
    }, 2000)
}