<style lang="less">

</style>
<template>
    <div class="content_main">
        <Form :model="formData" label-position="right" :label-width="80" inline>
            <FormItem label="操作员：">
                <Input v-model="formData.operator"></Input>
            </FormItem>
            <Button type="primary" class="margin-right-10" @click="getDataList('search')">查询</Button>
            <Button type="primary" @click="resetSearch">重置</Button>
        </Form>
        <Table class="margin-top-20" :columns="tableConfig" :data="dataList" border></Table>
        <div class="page_wrap">
            <Page :total="dataTotal" :current="pageNum" :page-size="pageSize" show-total @on-change="changePage"></Page>
        </div>
        <Spin size="large" fix v-show="spinShow"></Spin>
    </div>
</template>
<script>
export default {
  name: 'navigation',
  data () {
    return {
      formData: {}, // 查询表单
      dataInfo: {},

      dataList: [], // 数据列表
      dataTotal: 0, // 总页数

      pageNum: 1,
      pageSize: 20,
      modelTitle: '编辑',

      spinShow: false,
      showModal: false,
      isAddNewData: false,

      tableConfig: [
        {
          title: '操作员',
          key: 'operator',
          align: 'center',
          width: 150
        },
        {
          title: '服务IP',
          key: 'ip',
          align: 'center',
          width: 160
        },
        {
          title: '接口地址',
          key: 'requestUri',
          align: 'center',
          width: 200
        },
        {
          title: '查询参数',
          key: 'parameter',
          align: 'center',
          width: 400
        },
        {
          title: '创建时间',
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h('span', this.formatDate(params.row.createTime))
          }
        }
      ]
    }
  },
  created () {
    // this.getDataList();
  },
  methods: {
    // 获取数据
    getDataList (flag) {
      if (flag == 'search') {
        this.pageNum = 1
      }
      let self = this
      this.spinShow = true
      this.axios.post('/operation/log/list.do', {
        page: this.pageNum,
        limit: this.pageSize,
        data: this.formData
      }).then(rt => {
        self.spinShow = false
        if (rt.code == 0) {
          self.dataList = rt.data.list
          self.dataTotal = rt.data.total
        }
      })
    },
    // 切换页
    changePage (pageNum) {
      this.pageNum = pageNum
      this.getDataList()
    },
    // 重置查询
    resetSearch () {
      this.formData = {}
      this.getDataList()
    }
  }
}
</script>
