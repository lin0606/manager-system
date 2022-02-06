// 环境配置封装
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  // 开发
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/2659dd70ea781fc7041273f5a089763a/api'
  },
  // 测试
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://www.fastmock.site/mock/2659dd70ea781fc7041273f5a089763a/api'
  },
  // 线上
  prod: {
    baseApi: '//future.com/api',
    mock: 'https://www.fastmock.site/mock/2659dd70ea781fc7041273f5a089763a/api'
  }
}

export default {
  env,
  // mock: true,
  ...EnvConfig[env],
  // localstorage的封装的命名空间 在utils的storage中
  namespace: 'manage'
}