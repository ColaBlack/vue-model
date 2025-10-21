import { generateService } from '@umijs/openapi'

generateService({
  requestLibPath: "import request from '@/config/request'",
  schemaPath: 'http://localhost:8115/api/v3/api-docs',
  serversPath: './src'
})
