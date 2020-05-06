<style lang="less">
</style>
<template>
    <div class="content_main">
        <Row>
            <Col>
            </Col>
        </Row>
        <Table class="margin-top-20" :columns="tableConfig" :data="dataList" border></Table>
        <div class="page_wrap">
            <Page :total="dataTotal" :current="pageNum" :page-size="pageSize" show-total @on-change="changePage"></Page>
        </div>
        <Spin size="large" fix v-show="spinShow"></Spin>
        <Modal
            v-model="showModal"
            :title="modalTitle"
            :mask-closable="false"
            width="600"
            @on-ok="saveData"
            ok-text="保存">
            <Row>
                <Col span="4"><span class="label_txt">渠道名称：</span></Col>
                <Col span="8">
                    <Input v-model="formData.siteName"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4"><span class="label_txt">使用比例：</span></Col>
                <Col span="8">
                    <Input v-model="formData.siteRate"></Input>
                </Col>
            </Row>
        </Modal>
    </div>
</template>
<script>
export default{
  name: 'channelManage',
  data () {
    return {
      dataList: [],
      modalTitle: '编辑-短信渠道',
      dataTotal: 0,
      pageNum: 1,
      pageSize: 20,
      formData: {},

      showModal: false, // 遮罩层
      // 表头配置
      tableConfig: [
        {
          title: 'siteId',
          align: 'center',
          key: 'siteId'
        },
        {
          title: '渠道类型',
          align: 'center',
          key: 'siteType'
        },
        {
          title: '渠道名称',
          align: 'center',
          key: 'siteName'
        },
        {
          title: '使用比例',
          align: 'center',
          key: 'siteRate'
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  icon: 'edit'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.editInfo(params.index)
                  }
                }
              }, '修改比例')
            ])
          }
        }
      ]
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    saveData () {
      let self = this
      this.axios.post('/sms/private/site/update.do', this.formData).then(rt => {
        if (rt.code == 0) {
          self.$Message.success(rt.msg)
          self.getDataList()
        }
      })
    },
    // 列表
    getDataList () {
      let self = this
      this.spinShow = true
      this.axios.post('/sms/private/site/list.do', {
        limit: this.pageSize,
        page: this.pageNum
      }).then(rt => {
        self.spinShow = false
        if (rt.code == 0) {
          self.dataList = rt.data.list
          self.dataTotal = rt.data.total
        }
      })
    },
    // 修改比例
    editInfo (idx) {
      this.showModal = true
      let data = JSON.stringify(this.dataList[idx])
      this.formData = JSON.parse(data)
    },
    // 翻页
    changePage (pageNum) {
      this.pageNum = pageNum
      // this.getNewsList();
    }
  }
}
</script>
