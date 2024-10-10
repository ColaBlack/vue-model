import { generateService } from '@umijs/openapi'

generateService({
  requestLibPath: "import request from '@/config/request'",
  schemaPath: 'http://localhost:1221/api/v2/api-docs',
  serversPath: './src'
})
