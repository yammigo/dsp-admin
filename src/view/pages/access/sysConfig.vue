<template>
<div class="content_main">
    <Form :model="formData" label-position="right" :label-width="70" inline>
        <FormItem label="key">
            <Input v-model="formData.configKey"></Input>
        </FormItem>
        <FormItem label="说明" :label-width="100">
            <Input v-model="formData.explain"></Input>
        </FormItem>

        <Button type="primary" class="margin-right-10" @click="getDataList('search')">查询</Button>
        <Button type="primary" @click="resetSearch">重置</Button>
    </Form>
    <Row>
        <Col>
        <Button type="primary" @click="addNewData">新增</Button>
        <Button type="primary" @click="r">刷新缓存</Button>
        </Col>
    </Row>
    <Table class="margin-top-20" :columns="tableConfig" :data="dataList" border></Table>
    <div class="page_wrap">
        <Page :total="dataTotal" :current="pageNum" :page-size="pageSize" show-total @on-change="changePage"></Page>
    </div>
    <Spin size="large" fix v-show="spinShow"></Spin>
    <Modal v-model="showModal" :title="modelTitle" :mask-closable="false" width="500">
        <Row>
            <Col span="5"><span class="label_txt">配置key</span></Col>
            <Col span="10">
            <Input v-model="dataInfo.configKey"></Input>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="5"><span class="label_txt">配置value</span></Col>
            <Col span="18">
            <Input v-model="dataInfo.configValue"></Input>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="5"><span class="label_txt">说明</span></Col>
            <Col span="10">
            <Input v-model="dataInfo.configExplain"></Input>
            </Col>
        </Row>

        <div slot="footer">
            <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="showModal = false"><span>关闭</span></button>
            <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="saveDataOk"><span>保存</span></button>
        </div>
    </Modal>

</div>
</template>

<script>
const executeStatusConfig = {
  '0': '未执行',
  '1': '执行中',
  '2': '执行成功',
  '-1': '执行失败'
}

export default {
  name: 'sysConfig',
  data () {
    return {
      formData: {}, // 查询表单
      dataInfo: {},

      dataList: [], // 数据列表
      dataTotal: 0, // 总页数

      logsdataList: [],
      logsDataTotal: 0,
      logsPageNum: 1,

      pageNum: 1,
      pageSize: 20,
      modelTitle: '编辑',

      spinShow: false,
      showModal: false,
      showLogsModal: false,
      isAddNewData: false,
      curTaskId: '',
      tableConfig: [
        /* {
                  title: 'ID',
                  key: 'id',
                  align: 'center',
                  width: 100
                }, */
        {
          title: '配置key',
          align: 'center',
          key: 'configKey',
          width: 200

        },
        /* {
                  title: '文件路径',
                  key: 'jobFile',
                  align: 'center',
                  width: 300
                }, */
        {
          title: '配置value',
          key: 'configValue',
          align: 'center',
          width: 180
        },
        {
          title: '说明',
          key: 'configExplain',
          align: 'center',
          width: 170
        },
        {
          title: '创建时间',
          align: 'center',
          width: 120,
          key: 'createTime'
        },
        {
          title: '修改时间',
          key: 'updateTime',
          align: 'center',
          width: 100

        },

        {
          title: '操作',
          align: 'center',
          key: 'action',
          fixed: 'right',
          width: 370,
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
              }, '修改')

            ])
          }
        }
      ],
      // 日志表头
      logsTableConfig: [
      ]
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    r () {
      this.axios.post('/dsp/conf/refresh/redis.do', {}).then((res) => {
        if (res.code == 0) {
          this.$Message.success(res.msg)
        }
      })
    },
    // 获取数据
    getDataList (flag) {
      if (flag == 'search') {
        this.pageNum = 1
      }
      this.spinShow = true
      this.axios.post('/dsp/conf/list.do', {
        page: this.pageNum,
        limit: this.pageSize,
        data: this.formData
      }).then(rt => {
        this.spinShow = false
        if (rt.code == 0) {
          this.dataList = rt.data.list
          this.dataTotal = rt.data.total
        }
      })
    },
    // 新增
    addNewData () {
      this.isAddNewData = true
      this.dataInfo = {
        whileStatus: '0'
      }
      this.showModal = true
      this.modelTitle = '新增'
    },
    // 编辑
    editInfo (idx) {
      this.showModal = true
      this.isAddNewData = false
      this.modelTitle = '编辑'
      let data = JSON.stringify(this.dataList[idx])
      this.dataInfo = JSON.parse(data)
      this.dataInfo.whileStatus += ''
    },
    // 保存
    saveDataOk () {
      let url = '/dsp/conf/update.do'
      if (this.isAddNewData) {
        url = '/dsp/conf/add.do'
      }
      this.axios.post(url, this.dataInfo).then(rt => {
        if (rt.code == 0) {
          this.getDataList()
          this.$Message.success(rt.msg)
          this.showModal = false
        }
      })
    },
    // 切换页
    changePage (pageNum) {
      this.pageNum = pageNum
      this.getDataList()
    },
    // 切换页
    changeLogsPage (pageNum) {
      this.logsPageNum = pageNum
      this.getLogsDataList()
    },
    // 重置查询
    resetSearch () {
      this.formData = {}
      this.getDataList()
    },
    // 删除
    deleteData (id) {
      this.$Modal.confirm({
        content: '确定要删除吗？',
        onOk: () => {
          this.axios.post('/monitor/task/delete.do', {
            id: id
          }).then(rt => {
            if (rt.code == 0) {
              this.$Message.success(rt.msg)
              this.getDataList()
            }
          })
        }
      })
    },
    // 日志列表
    getLogsDataList () {
      this.axios.post('/monitor/task/log/list.do', {
        page: this.logsPageNum,
        limit: this.pageSize,
        data: {
          jobId: this.curTaskId
        }
      }).then(rt => {
        if (rt.code == 0) {
          this.logsdataList = rt.data.list
          this.logsDataTotal = rt.data.total
        }
      })
    }
  }
}
</script>
