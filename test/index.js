import check from '../src/index.js'

const { errors, warnings } = await check('./fixtures/public', {})

console.log('Errors', errors.length, '\t\tWarnings', warnings.length)
