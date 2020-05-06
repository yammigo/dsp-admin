export default {
  data: function () {
    return {
      spinShow: false,
      modalData: {
        loading: false,
        show: false,
        type: 'add'

      },
      pageData: {
        page: 1,
        limit: 10,
        total: 0
      },
      adTypeDict: {
        '1': '横幅',
        '2': '开屏',
        '3': '插屏',
        '4': '信息流',
        '5': '激励视频',
        '6': '激励视频开屏',
        '11': 'PC固定块(B)',
        '12': '右下悬浮(L)',
        '13': '对联(C)',
        '14': 'web固定块(B)',
        '15': '底部悬浮(L)'
      }

    }
  },
  methods: {
    handleReset (name) {
      this.$refs[name].resetFields()
      this.search(1)
    },
    // 切换分页条数
    changePageSize (value) {
      this.pageData.limit = value
      this.search()
    },
    // 切换页码
    changePage (value) {
      this.pageData.page = value
      this.search()
    },
    toStringVal (obj) {
      Object.keys({
        ...obj
      }).forEach((key, value) => {
        if (key == '_index' || key == '_rowKey') {

        } else {
          obj[key] += ''
        }
      })
      return obj
    }
  }

}
