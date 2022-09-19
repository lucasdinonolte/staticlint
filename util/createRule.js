import fs from 'node:fs'
import path from 'node:path'

const RULE_PLACEHOLDER = '___RULE___'

const ruleName = process.argv[2]

if (!ruleName) {
  console.error('Please provide a rule name')
  process.exit(1)
}

const [namespace, name] = ruleName.split('.')
const rulePath = path.join(
  process.cwd(),
  'src',
  'rules',
  namespace,
  name,
  'rule.js',
)

const specPath = path.join(
  process.cwd(),
  'src',
  'rules',
  namespace,
  name,
  `${name}.spec.js`,
)

const ruleFolder = path.dirname(rulePath)

const ruleTemplate = fs.readFileSync(
  path.join(process.cwd(), 'util', 'template', 'rule.js'),
  'utf8',
)

const specTemplate = fs.readFileSync(
  path.join(process.cwd(), 'util', 'template', 'spec.js'),
  'utf8',
)

if (fs.existsSync(rulePath)) {
  console.error('Rule already exists')
  process.exit(1)
}

fs.mkdirSync(ruleFolder, { recursive: true })

fs.writeFileSync(rulePath, ruleTemplate.replace(RULE_PLACEHOLDER, ruleName))
console.log(`Created ${rulePath}\n`)

fs.writeFileSync(specPath, specTemplate.replace(RULE_PLACEHOLDER, ruleName))
console.log(`Created ${specPath}\n`)

console.log('Done')
