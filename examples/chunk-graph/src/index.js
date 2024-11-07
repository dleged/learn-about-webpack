/**
 * See the webpack docs for more information about plugins:
 * https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture
 */

class ChunkGraph {
  apply(compiler) {
    compiler.hooks.done.tap('ChunkGraph', (
      stats /* stats is passed as an argument when done hook is tapped.  */
    ) => {
       // 在 chunkAsset 钩子中获取 chunk 信息
       compilation.hooks.afterChunks.tap(pluginName, (chunks) => {
        console.log('\n=== Chunk Analysis ===\n');

        chunks.forEach(chunk => {
          // 基本信息
          console.log(`\nChunk Name: ${chunk.name || 'unnamed'}`);
          console.log(`Chunk ID: ${chunk.id}`);
          console.log(`Entry: ${chunk.hasEntryModule()}`);
          
          // 获取 chunk 的模块
          const modules = Array.from(chunk.modulesIterable);
          console.log(`Number of modules: ${modules.length}`);

          // 输出模块信息
          modules.forEach(module => {
            console.log('\nModule:', {
              id: module.id,
              type: module.type,
              size: module.size(),
              path: module.resource || 'unknown'
            });
          });

          // 获取 chunk 的文件
          const files = Array.from(chunk.files);
          console.log('\nOutput files:', files);

          // 获取 chunk 的大小
          const size = chunk.size();
          console.log('Chunk size:', size, 'bytes');

          // 获取依赖关系
          const parents = Array.from(chunk.groupsIterable);
          console.log('Number of chunk groups:', parents.length);

          console.log('\n-------------------');
        });
      });

      // 可选：监听 optimizeChunks 钩子来查看优化后的 chunks
      compilation.hooks.optimizeChunks.tap(pluginName, (chunks) => {
        console.log('\n=== Optimized Chunks ===\n');
        chunks.forEach(chunk => {
          console.log(`Optimized Chunk: ${chunk.name || 'unnamed'}`);
        });
      });
    });
  }
}

module.exports = ChunkGraph;
