/**
 * See the webpack docs for more information about plugins:
 * https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture
 */
const path = require('path');
const printWithLeftPadding = (message, paddingLength) => console.log(message.padStart(message.length + paddingLength));

class UnderstandChunkGraphPlugin {
  apply(compiler) {

    const className = this.constructor.name;
    compiler.hooks.compilation.tap(className, compilation => {
      compilation.hooks.afterChunks.tap(className, chunks => {


        const { entrypoints } = compilation;

        // More about the `chunkMap`(<Chunk, ChunkGraphChunk>): https://github.com/webpack/webpack/blob/main/lib/ChunkGraph.js#L226-L227
        // comilation - chunkGraph -> _chunks -> chunkMap 
        //              chunkGraph ->  chunks -> chunksGraphchunk
        const { chunkGraph: { _chunks: chunkMap } } = compilation;

        const printChunkGroupsInformation = (chunkGroup, paddingLength) => {
          printWithLeftPadding(`Current ChunkGroup's name: ${chunkGroup.name}; parent group: ${chunkGroup.getParents()[0]?.name}`, paddingLength);
          printWithLeftPadding(` Is current ChunkGroup an EntryPoint? - ${chunkGroup.constructor.name === 'Entrypoint'}`, paddingLength);

          // `chunkGroup.chunks` - a `ChunkGroup` can contain one or mode chunks.
          const allModulesInChunkGroup = chunkGroup.chunks
            .flatMap(c => {
              // Using the information stored in the `ChunkGraph`
              // in order to get the modules contained by a single chunk.
              const associatedGraphChunk = chunkMap.get(c);

              // This includes the *entry modules* as well.
              // Using the spread operator because `.modules` is a Set in this case.
              return [...associatedGraphChunk.modules];
            })
            // The resource of a module is an absolute path and
            // we're only interested in the file name associated with
            // our module.
            .map(module => path.basename(module.resource));
          printWithLeftPadding(` The modules that belong to this chunk group: ${allModulesInChunkGroup.join(', ')}`, paddingLength);

          console.log('\n');

          // A `ChunkGroup` can have children `ChunkGroup`s.
          [...chunkGroup._children].forEach(childChunkGroup => printChunkGroupsInformation(childChunkGroup, paddingLength + 3));
        };

        // Traversing the `ChunkGraph` in a DFS manner.
        for (const [entryPointName, entryPoint] of entrypoints) {
          printChunkGroupsInformation(entryPoint, 0);
        }
      });
    });
  }
}

module.exports = UnderstandChunkGraphPlugin;
