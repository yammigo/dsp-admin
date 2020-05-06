<style lang="less">
</style>
<template>
    <div class="content_main">
        <Row>
            <Button class="margin-right-10" type="primary" @click="addNewData">添加组</Button>
            <Button type="primary" @click="refreshCache">刷新缓存</Button>
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
            width="650"
            @on-ok="saveData"
            ok-text="保存">
            <Row>
                <Col span="4"><span class="label_txt">组名称：</span></Col>
                <Col span="8">
                    <Input v-model="formData.alarmName"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4"><span class="label_txt">组标识：</span></Col>
                <Col span="8">
                    <Input v-model="formData.alarmCode"></Input>
                </Col>
            </Row>
            <Row class="margin-top-20">
                <Col span="4"><span class="label_txt">邮件接收人：</span></Col>
                <Col span="19">
                    <CheckboxGroup v-model="formData.mailToList">
                        <Checkbox v-for="item in userList" :key="item.id" :label="item.id"><span class="label_txt">{{item.nickname}}</span></Checkbox>
                    </CheckboxGroup>
                </Col>
            </Row>
            <Row class="margin-top-20">
                <Col span="4"><span class="label_txt">短信接收人：</span></Col>
                <Col span="19">
                    <CheckboxGroup v-model="formData.msgPhoneList">
                        <Checkbox v-for="item in userList" :key="item.id" :label="item.id"><span class="label_txt">{{item.nickname}}</span></Checkbox>
                    </CheckboxGroup>
                </Col>
            </Row>
            <Row class="margin-top-20">
                <Col span="4"><span class="label_txt">微信接收人：</span></Col>
                <Col span="19">
                    <CheckboxGroup v-model="formData.wechatOpenIdList">
                        <Checkbox v-for="item in userList" :key="item.id" :label="item.id"><span class="label_txt">{{item.nickname}}</span></Checkbox>
                    </CheckboxGroup>
                </Col>
            </Row>
            <Row class="margin-top-20">
                <Col span="4"><span class="label_txt">站内信接收人：</span></Col>
                <Col span="19">
                    <CheckboxGroup v-model="formData.innerMsgUser">
                        <Checkbox v-for="item in userList" :key="item.id" :label="item.id"><span class="label_txt">{{item.nickname}}</span></Checkbox>
                    </CheckboxGroup>
                </Col>
            </Row>
        </Modal>
    </div>
</template>
<script>
export default{
  name: 'warningManage',
  data () {
    return {
      dataList: [],
      modalTitle: '修改组',
      showModal: false,

      dataTotal: 0,
      pageNum: 1,
      pageSize: 20,

      formData: {},
      editInfoSign: false,

      spinShow: false, // 遮罩层
      // 表头配置
      tableConfig: [
        {
          title: '名称',
          align: 'center',
          key: 'alarmName',
          width: 200
        },
        {
          title: '唯一标识',
          align: 'center',
          key: 'alarmCode',
          width: 120
        },
        {
          title: '邮件接收人',
          align: 'center',
          key: 'mailTo',
          width: 120,
          render: (h, params) => {
            let ids = params.row.mailTo
            let len = ids ? ids.split(',').length : 0
            return h('span', len ? len + '人' : '-')
          }
        },
        {
          title: '短信接收人',
          align: 'center',
          key: 'msgPhone',
          width: 120,
          render: (h, params) => {
            let ids = params.row.msgPhone
            let len = ids ? ids.split(',').length : 0
            return h('span', len ? len + '人' : '-')
          }
        },
        {
          title: '微信接收人',
          align: 'center',
          key: 'wechatOpenId',
          width: 120,
          render: (h, params) => {
            let ids = params.row.wechatOpenId
            let len = ids ? ids.split(',').length : 0
            return h('span', len ? len + '人' : '-')
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
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
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.deleteData(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      userList: [],
      userIdsList: []
    }
  },
  created () {
    this.getDataList()
    this.getUserList()
  },
  methods: {
    // 列表
    getDataList () {
      this.spinShow = true
      this.axios.post('/sms/private/alarm/list.do', {
        limit: this.pageSize,
        page: this.pageNum
      }).then(rt => {
        this.spinShow = false
        if (rt.code == 0) {
          this.dataList = rt.data.list
          this.dataTotal = rt.data.total
        }
      })
    },
    // 添加数据
    addNewData () {
      this.showModal = true
      this.editInfoSign = false
      this.modalTitle = '添加组'
      this.formData = {
        mailToList: [],
        msgPhoneList: [],
        wechatOpenIdList: [],
        innerMsgUserList: []
      }
    },
    // 编辑
    editInfo (idx) {
      this.showModal = true
      this.editInfoSign = true
      this.modalTitle = '修改组'
      let data = JSON.parse(JSON.stringify(this.dataList[idx]))
      data.mailToList = this.getUserIdsList(data.mailTo)
      data.msgPhoneList = this.getUserIdsList(data.msgPhone)
      data.wechatOpenIdList = this.getUserIdsList(data.wechatOpenId)
      data.innerMsgUserList = this.getUserIdsList(data.innerMsgUser)
      this.formData = data
    },
    // 保存数据
    saveData () {
      let data = JSON.parse(JSON.stringify(this.formData))
      data.mailTo = data.mailToList.join()
      data.msgPhone = data.msgPhoneList.join()
      data.wechatOpenId = data.wechatOpenIdList.join()
      data.innerMsgUser = data.innerMsgUserList.join()
      delete data.mailToList
      delete data.msgPhoneList
      delete data.wechatOpenIdList
      delete data.innerMsgUserList
      let url = '/sms/private/alarm/add.do'
      if (this.editInfoSign) {
        url = '/sms/private/alarm/update.do'
      }
      this.axios.post(url, data).then(rt => {
        if (rt.code == 0) {
          this.$Message.success(rt.msg)
          this.getDataList()
        }
      })
    },
    // 删除
    deleteData (id) {
      this.$Modal.confirm({
        content: '确定要删除吗？',
        onOk: function () {
          this.axios.post('/sms/private/alarm/delete.do', {
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
    // 刷新缓存
    refreshCache () {
      this.spinShow = true
      this.axios.post('/sms/private/alarm/refreshRedis.do').then(rt => {
        if (rt.code == 0) {
          this.spinShow = false
          this.$Message.success(rt.msg)
        }
      })
    },
    // 翻页
    changePage (pageNum) {
      this.pageNum = pageNum
      this.getDataList()
    },
    // 用户列表
    getUserList () {
      this.axios.post('/sys/user/list.do', {
        page: 1,
        limit: 10000,
        data: {}
      }).then(rt => {
        if (rt.code == 0) {
          this.userList = rt.data.list
        }
      })
    },
    // 获取userId列表
    getUserIdsList (idsStr) {
      if (!idsStr) return []
      return idsStr.split(',').map(item => item * 1)
    }
  }
}
</script>
