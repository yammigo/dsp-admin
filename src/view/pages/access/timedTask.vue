<template>
  <div class="content_main">
    <Form :model="formData" label-position="right" :label-width="70" inline>
      <!-- <FormItem label="编码：">
        <Input v-model="formData.id"></Input>
      </FormItem> -->
      <FormItem label="任务名称：" :label-width="100" >
        <Input v-model="formData.jobName"></Input>
      </FormItem>
      <Button type="primary" class="margin-right-10" @click="getDataList('search')">查询</Button>
      <Button type="primary" @click="resetSearch">重置</Button>
    </Form>
    <Row>
      <Col>
        <Button type="primary" @click="addNewData">新增</Button>
      </Col>
    </Row>
    <Table class="margin-top-20" :columns="tableConfig" :data="dataList" border></Table>
    <div class="page_wrap">
      <Page :total="dataTotal" :current="pageNum" :page-size="pageSize" show-total @on-change="changePage"></Page>
    </div>
    <Spin size="large" fix v-show="spinShow"></Spin>
    <Modal
      v-model="showModal"
      :title="modelTitle"
      :mask-closable="false"
      width="500">
      <Row>
        <Col span="5"><span class="label_txt">任务名称：</span></Col>
        <Col span="10">
            <Input v-model="dataInfo.jobName"></Input>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Col span="5"><span class="label_txt">文件路径：</span></Col>
        <Col span="18">
          <Input v-model="dataInfo.jobFile"></Input>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Col span="5"><span class="label_txt">方法：</span></Col>
        <Col span="10">
          <Input v-model="dataInfo.jobMethod"></Input>
        </Col>
      </Row>
       <Row class="margin-top-10">
        <Col span="5"><span class="label_txt">参数：</span></Col>
        <Col span="10">
          <Input v-model="dataInfo.args"></Input>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Col span="5"><span class="label_txt">时间表达式：</span></Col>
        <Col span="10">
          <Input v-model="dataInfo.jobTime"></Input>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Col span="5"><span class="label_txt">是否并发：</span></Col>
        <Col span="10">
          <RadioGroup v-model="dataInfo.whileStatus">
            <Radio label="1"><span class="label_txt">是</span></Radio>
            <Radio label="0"><span class="label_txt">否</span></Radio>
          </RadioGroup>
        </Col>
      </Row>
      <div slot="footer">
        <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="showModal = false"><span>关闭</span></button>
        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="saveDataOk"><span>保存</span></button>
      </div>
    </Modal>
     <Modal
      v-model="showLogsModal"
      title="日志列表"
      :mask-closable="false"
      width="900">
      <Table :columns="logsTableConfig" :data="logsdataList" border></Table>
      <div class="page_wrap">
        <Page :total="logsDataTotal" :current="logsPageNum" :page-size="pageSize" show-total @on-change="changeLogsPage"></Page>
      </div>
      <div slot="footer">
        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="showLogsModal = false"><span>确定</span></button>
      </div>
    </Modal>
  </div>
</template>
<script>
const executeStatusConfig = { '0': '未执行', '1': '执行中', '2': '执行成功', '-1': '执行失败' }

export default {
  name: 'timedTask',
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
          title: '任务名称',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.showLogsModal = true
                  this.curTaskId = params.row.id
                  this.getLogsDataList()
                }
              }
            }, params.row.jobName)
          }
        },
        /* {
          title: '文件路径',
          key: 'jobFile',
          align: 'center',
          width: 300
        }, */
        {
          title: '方法',
          key: 'jobMethod',
          align: 'center',
          width: 180
        },
        {
          title: '参数',
          key: 'args',
          align: 'center',
          width: 180
        },
        {
          title: '时间表达式',
          key: 'jobTime',
          align: 'center',
          width: 170
        },
        {
          title: '是否并发执行',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('span', params.row.whileStatus * 1 ? '是' : '否')
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.status * 1 ? '启用' : '禁用')
          }
        },
        {
          title: '最后执行状态',
          key: 'executeStatus',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('span', executeStatusConfig[params.row.executeStatus])
          }
        },
        {
          title: '创建时间',
          key: 'createDate',
          align: 'center',
          width: 170
        },
        {
          title: '最后执行时间',
          key: 'executeDate',
          align: 'center',
          width: 170
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
                  type: 'success',
                  icon: 'checkmark'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      content: '确定要执行此任务吗？',
                      onOk: () => {
                        this.axios.post('/monitor/task/execute.do', {
                          id: params.row.id
                        }).then(rt => {
                          if (rt.code == 0) {
                            this.$Message.success(rt.msg)
                          }
                        })
                      }
                    })
                  }
                }
              }, '立即执行'),
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
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  icon: 'trash-a'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.deleteData(params.row.id)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: params.row.status * 1 ? 'error' : 'success'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      content: '确定' + (params.row.status * 1 ? '禁用' : '启用') + '此任务吗？',
                      onOk: () => {
                        this.axios.post('/monitor/task/update/status.do', {
                          id: params.row.id,
                          status: params.row.status * 1 ? 0 : 1
                        }).then(rt => {
                          if (rt.code == 0) {
                            this.$Message.success(rt.msg)
                            this.getDataList()
                          }
                        })
                      }
                    })
                  }
                }
              }, params.row.status * 1 ? '禁用' : '启用')
            ])
          }
        }
      ],
      // 日志表头
      logsTableConfig: [
        {
          title: '最后执行时间',
          key: 'executeDate',
          align: 'center',
          width: 170
        },
        {
          title: '最后执行状态',
          align: 'center',
          width: 170,
          render: (h, params) => {
            return h('span', executeStatusConfig[params.row.executeStatus])
          }
        },
        {
          title: '错误信息',
          key: 'errorMsg',
          align: 'center'
        }
      ]
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据
    getDataList (flag) {
      if (flag == 'search') {
        this.pageNum = 1
      }
      this.spinShow = true
      this.axios.post('/monitor/task/list.do', {
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
      let url = '/monitor/task/update.do'
      if (this.isAddNewData) {
        url = '/monitor/task/add.do'
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
