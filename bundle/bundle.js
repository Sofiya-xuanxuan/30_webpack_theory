const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const entry = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8')
    //分析ast抽象语法树，根据需要返回对应数据
    //根据结果返回对应的模块，定义一个数组，接受一个node.source.value的值
    const ast = parser.parse(content, {
        sourceType: 'module'
    })
    const dependencies = {}
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename)
            const newfilename = './' + path.join(dirname, node.source.value)
            dependencies[node.source.value] = newfilename
        }
    })
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    })
    return {
        filename,
        dependencies,
        code
    }
}
//深层次分析文件内容
const deepModule = filename => {
    const entryInfo = entry(filename)
    const deepModuleArray = [entryInfo]

    for (let i = 0; i < deepModuleArray.length; i++) {
        const item = deepModuleArray[i]
        const { dependencies } = item

        if (dependencies) {
            for (let j in dependencies) {
                deepModuleArray.push(entry(dependencies[j]))
            }
        }
    }
    const graph = {}
    deepModuleArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    })
    return graph
}

//生成代码
const generateCode = filename => {
    const dependenciesAll = JSON.stringify(deepModule(filename))
    console.log(dependenciesAll);
    
    return `
        (function(dependenciesAll){
            function require(module){
                function localRequire(relativePath){
                    return require(dependenciesAll[module].dependencies[relativePath])
                }
                var exports={}
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,dependenciesAll[module].code)
                return exports
            }
            require('${filename}')
        })(${dependenciesAll})
    `
}

const info = generateCode('./src/index.js')
console.log(info);
