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
      moduleGraph._moduleMap.forEach((module) => {
        const moduleId = module.id;
        const moduleConnections = moduleGraph.getOutgoingConnections(module);
        console.log(`Module ID: ${moduleId}`);
        console.log('Outgoing Connections:');
        moduleConnections.forEach((connection) => {
          console.log(`  - Connected to Module ID: ${connection.module.id}`);
        });
      });

      // 继续执行下一个插件
      callback();
    });
  }
}

module.exports = UnderstandModuleGraph;
