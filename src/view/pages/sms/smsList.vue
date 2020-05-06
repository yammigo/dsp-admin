<style lang="less">
</style>
<template>
    <div class="content_main">
        <Form :model="formData" label-position="right" :label-width="80" inline>
            <FormItem label="手机号：">
                <Input v-model="formData.mobileNumber"></Input>
            </FormItem>
            <FormItem label="渠道：">
                <Select clearable v-model="formData.siteId" style=" width: 130px;">
                    <Option v-for="item in channelList" :value="item.siteId" :key="item.id">{{item.siteName}}</Option>
                </Select>
            </FormItem>
            <!--<FormItem label="类型：">
                <Select clearable v-model="formData.smsType" style=" width: 100px;">
                    <Option value="1">通知短信</Option>
                    <Option value="2">营销短信</Option>
                </Select>
            </FormItem>-->
            <FormItem label="状态：">
                <Select clearable v-model="formData.status" style=" width: 100px;">
                    <Option value="0">待发送</Option>
                    <Option value="1">发送成功</Option>
                    <Option value="2">发送失败</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="searchSms">查询</Button>
            </FormItem>
        </Form>
        <Row>
            <Col>
                <Button type="primary" @click="sendSms" class="margin-right-10">发送短信</Button>
                <Button type="primary" @click="batchSendSms" class="margin-right-10">批量发送短信</Button>
                <!-- <Button type="primary" @click="callBackUser">召回用户</Button> -->
                <Button type="primary" @click="showDefinedSend" class="margin-left-10">自定义发送</Button>
            </Col>
        </Row>
        <Table class="margin-top-20" :columns="tableConfig" :data="dataList" border></Table>
        <div class="page_wrap">
            <Page :total="dataTotal" :current="pageNum" :page-size="pageSize" show-total @on-change="changePage"></Page>
        </div>
        <Spin size="large" fix v-show="spinShow"></Spin>
        <!-- 自定义发送短信 -->
        <Modal
            v-model="isShowBox"
            :title="modelTitle"
            :mask-closable="false"
            width="600">
            <Row class="margin-top-10">
                <Col span="18">
                    <Input v-model="definedInfo.mobileList" type="textarea" :rows="10" placeholder="手机号|内容 以回车分隔"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="18"><span class="label_txt">进度：{{currentSend + '/' + totalLength}}</span></Col>
            </Row>
            <div slot="footer">
                <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="sendSmsCancel"><span>取消</span></button>
                <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="definedSend"><span>发送</span></button>
            </div>
        </Modal>
        <!--发送短信-->
        <Modal
            v-model="sendSmsModal"
            :title="modelTitle"
            :closable="false"
            width="600">
            <Row v-if="!isCallback">
                <Col span="3"><span class="label_txt">渠道：</span></Col>
                <Col span="6">
                    <Select clearable v-model="sendSmsInfo.siteId" style=" width: 130px;">
                        <Option v-for="item in channelList" :value="item.siteId" :key="item.id">{{item.siteName}}</Option>
                    </Select>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="3"><span class="label_txt">手机号：</span></Col>
                <Col span="20">
                    <Input v-model="sendSmsInfo.mobileList" type="textarea" :rows="3" placeholder="以回车分隔"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="3"><span class="label_txt">短信内容：</span></Col>
                <Col span="20">
                    <Input v-model="sendSmsInfo.body" type="textarea" :rows="4"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10" v-if="isCallback">
                <Col span="3"><span class="label_txt">时间间隔：</span></Col>
                <Col span="5">
                    <Input v-model="sendSmsInfo.miao" placeholder="秒"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="3"><span class="label_txt">快捷回复：</span></Col>
                <Col span="20">
                    <Select v-model="quickReplyCode" @on-change="changeQuickReply">
                        <Option v-for="(item, key) in quickReplyList" :value="key" :key="key">{{item}}</Option>
                    </Select>
                </Col>
            </Row>
            <div slot="footer">
                <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="sendSmsCancel"><span>取消</span></button>
                <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="sendSmsOk"><span>发送</span></button>
            </div>
        </Modal>
    </div>
</template>
<script>
// 短信类型
const smsTypeCn = { '1': '通知短信', '2': '营销短信' }
// 状态
const statusCn = { '0': '待发送', '1': '发送成功', '2': '发送失败' }

export default{
  name: 'smsList',
  data () {
    return {
      dataList: [], // 数据列表
      dataTotal: 0,
      pageNum: 1,
      pageSize: 20,
      modelTitle: '发送短信',

      isBatchSend: false, // 是否批量发送
      sendSmsModal: false,
      totalLength: 0, // 输入内容
      currentSend: 0, // 已经发送条数
      isCallback: false,
      isShowBox: false, // 自定义发送短信弹窗
      sendSmsInfo: {},
      definedInfo: {}, // 自定义短信内容

      // 表单数据
      formData: {},

      // 渠道列表
      channelList: [],

      // 快捷回复
      quickReplyCode: '',
      quickReplyList: {
        '0': '您好，APP下载地址： http://t.cn/RnJAV1B 非常感谢您对我们支持！'
      },

      spinShow: false, // 遮罩层
      // 表头配置
      tableConfig: [
        {
          title: 'ID',
          align: 'center',
          key: 'id',
          width: 100
        },
        {
          title: '渠道',
          align: 'center',
          key: 'siteName',
          width: 150
        },
        {
          title: '手机号',
          align: 'center',
          key: 'mobileNumber',
          width: 200
        },
        {
          title: '短信内容',
          align: 'center',
          key: 'body',
          width: 400
        },
        {
          title: '短信类型',
          align: 'center',
          key: 'smsType',
          width: 150,
          render: (h, params) => {
            return h('Span', smsTypeCn[params.row.smsType])
          }
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 150,
          render: (h, params) => {
            let st = params.row.status
            if (st == 2) {
              return h('Tooltip', {
                props: {
                  content: params.row.failReasion,
                  placement: 'top'
                }
              }, statusCn[params.row.status])
            } else {
              return h('span', statusCn[params.row.status])
            }
          }
        },
        {
          title: '发送时间',
          align: 'center',
          key: 'updateTime',
          width: 170,
          render: (h, params) => {
            return h('span', params.row.updateTime)
          }
        }
      ]
    }
  },
  created () {
    // this.getDataList();
    this.getChannelList()
  },
  methods: {
    // 点击自定义发送
    showDefinedSend () {
      this.isShowBox = true
      this.definedInfo = {}
    },
    // 自定义发送短信
    definedSend () {
      this.currentSend = 0
      if (!this.definedInfo.mobileList) {
        this.$Message.error('请输入手机号和内容')
        return
      }
      let sendSmsList = this.definedInfo.mobileList.split('\n')
      this.totalLength = sendSmsList.length
      for (var i = 0; i < sendSmsList.length; i++) {
        let idxItem = sendSmsList[i].split('|')
        this.axios.post('/sms/private/sms/add.do', {
          siteId: 1004,
          smsType: 1,
          body: idxItem[1],
          mobileList: idxItem[0]
        }).then(rt => {
          if (rt.code == 0) {
            this.currentSend += 1
            if (this.currentSend == this.totalLength) {
              this.$Message.success(rt.msg)
            }
          }
        })
      }
    },
    // 发送短信
    sendSms () {
      this.quickReplyCode = ''
      this.sendSmsInfo = {}
      this.modelTitle = '发送短信'
      this.isBatchSend = false
      this.isCallback = false
      this.sendSmsModal = true
    },
    // 批量发送
    batchSendSms () {
      this.quickReplyCode = ''
      this.sendSmsInfo = {}
      this.modelTitle = '批量发送短信'
      this.isBatchSend = true
      this.isCallback = false
      this.sendSmsModal = true
    },
    // 召回用户
    // callBackUser(){
    //     this.quickReplyCode = '';
    //     this.sendSmsInfo = {};
    //     this.modelTitle = '召回用户';
    //     this.isBatchSend = false;
    //     this.isCallback = true;
    //     this.sendSmsModal = true;
    // },
    sendSmsCancel () {
      this.sendSmsModal = false
    },
    sendSmsOk () {
      if (!this.sendSmsInfo.siteId) {
        this.$Message.error('请选择渠道')
        return
      }
      let smsType = ''
      for (let i = 0, len = this.channelList.length; i < len; i++) {
        if (this.formData.siteId == this.channelList[i].siteId) {
          smsType = this.channelList[i].siteType == 1 ? 1 : 2
          break
        }
      }
      this.sendSmsInfo.smsType = smsType

      if (!this.sendSmsInfo.mobileList) {
        this.$Message.error('请输入手机号')
        return
      }
      if (!this.sendSmsInfo.body) {
        this.$Message.error('请填写短信内容')
        return
      }
      this.sendSmsModal = false

      let self = this
      let dataInfo = this.sendSmsInfo
      let url = '/sms/private/sms/add.do' // 发送、自定义发送短信
      if (this.isBatchSend) {
        url = '/sms/private/sms/batchSendSms.do' // 批量发送短信
        dataInfo = {
          mobiles: this.sendSmsInfo.mobileList,
          msg: this.sendSmsInfo.body,
          siteId: this.sendSmsInfo.siteId
        }
      }
      // else if(this.isCallback){
      //     url = '/sms/private/sms/recallUsers.do';
      //     dataInfo = {
      //         mobiles: this.sendSmsInfo.mobileList,
      //         msg: this.sendSmsInfo.body,
      //         miao: this.sendSmsInfo.miao * 1
      //     };
      // }
      this.axios.post(url, dataInfo).then(rt => {
        if (rt.code == 0) {
          self.$Message.success(rt.msg)
          /* setTimeout(function(){
                            self.getDataList();
                        }, 2000); */
        }
      })
    },
    // 短信列表
    getDataList () {
      let self = this
      let smsType = ''
      if (this.formData.siteId) {
        for (let i = 0, len = this.channelList.length; i < len; i++) {
          if (this.formData.siteId == this.channelList[i].siteId) {
            smsType = this.channelList[i].siteType == 1 ? 1 : 2
            break
          }
        }
      }
      this.formData.smsType = smsType
      this.spinShow = true
      this.axios.post('/sms/private/sms/getSmsList.do', {
        data: this.formData,
        limit: this.pageSize,
        page: this.pageNum
      }).then(rt => {
        this.spinShow = false
        if (rt.code == 0) {
          self.dataList = rt.data.list
          self.dataTotal = rt.data.total
        }
      })
    },
    // 短信查询
    searchSms () {
      this.pageNum = 1
      this.getDataList()
    },
    // 渠道查询1
    getChannelList () {
      let self = this
      this.axios.post('/sms/private/site/list.do', {
        limit: 10000,
        page: 1
      }).then(rt => {
        if (rt.code == 0) {
          self.channelList = rt.data.list
        }
      })
    },
    // 翻页
    changePage (pageNum) {
      this.pageNum = pageNum
      this.getDataList()
    },
    // 快捷回复选择
    changeQuickReply () {
      this.sendSmsInfo.body = this.quickReplyList[this.quickReplyCode]
    }
  }
}
</script>
