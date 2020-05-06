export default {
  data: function () {
    return {
      dictData: {
        statusA: {
          '0': '禁用',
          '1': '启用'
        },
        statusB: {
          '-1': '待审核',
          '-2': '未通过',
          '0': '禁用',
          '1': '通过'
        },
        dictStatus: {
          '-1': '待审核',
          '0': '禁用',
          '1': '启用',
          '-2': '不通过'
        },
        statusColor: {
          '-1': '#ff9900',
          '0': '#ed4014',
          '1': '#2d8cf0'
        },
        statusBtn: {
          '-1': 'warning',
          '0': 'error',
          '1': 'primary'
        }

      }

    }
  },
  methods: {

  }

}
