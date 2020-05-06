export default {
  // 展示状态
  status: {
    '1': '启用',
    '0': '禁用'
  },
  authStatus: {
    '-1': '待审核',
    '0': '禁用',
    '1': '启用',
    '-2': '不通过'
  },
  // 按钮文本显示
  statusText: {
    '1': {
      title: '禁用',
      value: '0'
    },
    '0': {
      title: '启用',
      value: '1'
    }
  },
  statusColor: {
    '-1': '#ff9900',
    '0': '#ed4014',
    '1': '#2d8cf0',
    '-2': '#ed4014'
  },
  statusType: {
    '-1': 'warning',
    '0': 'error',
    '1': 'primary',
    '-2': 'error'
  }

}
