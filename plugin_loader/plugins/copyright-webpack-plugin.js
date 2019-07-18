class CopyrightWebpackPlugin {
    constructor(options) {
        //接受参数
        console.log(options);
    }

    //compiler：webpack实例
    apply(compiler) {
        //同步
        compiler.hooks.compilation.tap(
            'CopyrightWebpackPlugin',
            compilation => {
                console.log('compilation')
            }
        )
        //异步
        //hooks.emit 定义在某个时刻
        compiler.hooks.emit.tapAsync(
            'CopyrightWebpackPlugin',
            (compilation, cb) => {
                compilation.assets['copyright.txt'] = {
                    source: function () {
                        return 'hello  copy'
                    },
                    size: function () {
                        return 2048
                    }
                }
                cb()
            }
        )
    }
}

module.exports = CopyrightWebpackPlugin