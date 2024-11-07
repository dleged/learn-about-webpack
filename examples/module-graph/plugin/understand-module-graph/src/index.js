/**
 * See the webpack docs for more information about plugins:
 * https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture
 */

class UnderstandModuleGraph {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('UnderstandModuleGraph', (compilation, callback) => {
      // 获取模块图信息
      const moduleGraph = compilation.moduleGraph;

      // 检查 moduleGraph 是否存在
      if (!moduleGraph) {
        console.error('ModuleGraph is undefined.');
        return callback();
      }

      // 输出模块图信息
      console.log('Module Graph Information:');

      for(let [key,module] of moduleGraph._moduleMap){

        const moduleId = key.rawRequest;

        const moduleConnections = module.outgoingConnections;
        console.log(`Module ID: ${moduleId}`);
        console.log('Outgoing Connections:');
        moduleConnections?.forEach((connection) => {
          console.log(`  - Connected to Module ID: ${connection.module.id}`);
        });

        console.log(`
          `); 
      }

      // 继续执行下一个插件
      callback();
    });


    compiler.hooks.thisCompilation.tap("RevertTracePlugin", function(compilation) {
      // 构建模块前触发
      compilation.hooks.buildModule.tap("RevertTracePlugin", (module) => {
        const stack = [];
        let current = module;
        // 向上遍历，找出所有引用者
        while (current.issuer) {
          stack.push(current.issuer.rawRequest);
          current = current.issuer;
        }
        if (stack.length > 0) {
          console.group(`资源 ${module.rawRequest} 引用链： `);
          console.log(stack.join("\n"));
          console.groupEnd();
          console.log();
        }
      });
    });
  }
}

module.exports = UnderstandModuleGraph;
