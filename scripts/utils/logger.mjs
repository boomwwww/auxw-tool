export const logger = {
  info(...args) {
    console.log('-'.padEnd(50, '-') + `\n\t${args.join('\n')}\n` + '-'.padEnd(50, '-'))
  },
  run(name) {
    this.info(`Script '${name}' starting`)
  },
  done(name) {
    this.info(`Script '${name}' completed`)
  },
  log(...args) {
    console.log(...args)
  },
  error(...args) {
    throw new Error(...args)
  }
}
