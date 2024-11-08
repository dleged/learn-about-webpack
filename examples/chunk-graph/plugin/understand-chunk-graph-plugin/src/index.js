const path = require('path');
const printWithLeftPadding = (message, paddingLength) => console.log(message.padStart(message.length + paddingLength));

class UnderstandChunkGraphPlugin {
  apply(compiler) {
    const className = this.constructor.name;
    compiler.hooks.compilation.tap(className, compilation => {
      compilation.hooks.afterChunks.tap(className, chunks => {

        const { entrypoints } = compilation;// EntryPoint's

        // comilation - chunkGraph -> _chunks -> chunkMap 
        //              chunkGraph ->  chunks -> chunksGraphchunk
        const { chunkGraph: { _chunks: chunkMap } } = compilation;

        const printChunkGroupsInformation = (chunkGroup, paddingLength) => {
        
          printWithLeftPadding(`Current ChunkGroup's name: ${chunkGroup.name}; parent group: ${chunkGroup.getParents()[0]?.name}`, paddingLength);
          
          printWithLeftPadding(` Is current ChunkGroup an EntryPoint? - ${chunkGroup.constructor.name === 'Entrypoint'}`, paddingLength);

          // 2. chunkGroup.chunks - 一个 `ChunkGroup` 包含一到多个 chunk.
          const allModulesInChunkGroup = chunkGroup.chunks // chunkGraphchunk - 描述 chunk 和 模块的关系
            .flatMap(c => {
              // 从 chunkGraph._chunks 获取储存的信息
              const associatedGraphChunk = chunkMap.get(c); // _chunks.get(chunk)

              // 3. 块全部所依赖的模块
              return [...associatedGraphChunk.modules]; 
            })
            .map(module => path.basename(module.resource)); // 得到模块名称
            
          printWithLeftPadding(` The modules that belong to this chunk group: ${allModulesInChunkGroup.join(', ')}`, paddingLength);

          console.log('\n');

          // 深度便利 chunkGroup 的 children
          [...chunkGroup._children].forEach(childChunkGroup => printChunkGroupsInformation(childChunkGroup, paddingLength + 3));
        };

        // 1. 深度优先遍历ChunkGraph
        for (const [entryPointName, entryPoint] of entrypoints) {
          printChunkGroupsInformation(entryPoint, 0);
        }
      });
    });
  }
}

module.exports = UnderstandChunkGraphPlugin;


