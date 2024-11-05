/**
 * See the webpack docs for more information about plugins:
 * https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture
 */
class UnderstandAst {
  apply(compiler) {
    const classname = this.constructor.name;
    compiler.hooks.normalModuleFactory.tap(classname, (factory) => {
      factory.hooks.parser
        .for('javascript/auto')
        .tap(classname, (parser, options) => {
          parser.hooks.import.tap(classname, (statement, source) => {
            
            console.log(`Module is ${parser.state.module.rawRequest}:`);

            if (statement.type === 'ImportDeclaration') {

              console.log(`  - Find the dependency: ${source}`);

            }

          });
        });
    });
  }
}

module.exports = UnderstandAst;
