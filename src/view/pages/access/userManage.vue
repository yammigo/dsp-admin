<template>
  <div class="content_main">
    <Row>
      <Button type="success" @click="addNewData">新增</Button>
    </Row>
    <Table class="margin-top-20" :columns="tableConfig" :data="dataList" border></Table>
    <div class="page_wrap">
      <Page :total="dataTotal" :current="pageNum" :page-size="pageSize" show-total   @on-change="changePage"></Page>
    </div>
    <Spin size="large" fix v-show="spinShow"></Spin>
    <Modal
      v-model="showModal"
      title="新增"
      :mask-closable="false"
      width="650">
      <Form class="modal_form_box" ref="dataForm" :model="dataInfo" :rules="formRules" label-position="right" :label-width="80">
        <Row>
          <Col span="11">
            <FormItem label="登录名" prop="username">
              <Input v-model="dataInfo.username"></Input>
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem label="密码" prop="pswd">
              <Input v-model="dataInfo.pswd"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="昵称">
              <Input v-model="dataInfo.nickname"></Input>
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem label="手机号">
              <Input v-model="dataInfo.mobile"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="邮箱">
              <Input v-model="dataInfo.mail"></Input>
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem label="是否可见全部广告主" :label-width="180">
              <RadioGroup v-model="dataInfo.allSource">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="是否可见全部下游用户" :label-width="180">
              <RadioGroup v-model="dataInfo.allUser">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="分配角色">
              <CheckboxGroup v-model="roleIdsList">
                <Checkbox v-for="item in roleList" :key="item.id" :label="item.id"><span class="label_txt">{{item.name}}</span></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="showModal = false"><span>关闭</span></button>
        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="saveDataOk"><span>保存</span></button>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal
      v-model="modifyModal"
      title="修改"
      :mask-closable="false"
      width="650">
      <Form class="modal_form_box" :model="modifyDataInfo" label-position="right" :label-width="80">
        <Row>
          <Col span="11">
            <FormItem label="昵称">
              <Input v-model="modifyDataInfo.nickname"></Input>
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem label="密码">
              <Input v-model="modifyDataInfo.pswd"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="手机号">
              <Input v-model="modifyDataInfo.mobile"></Input>
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem label="邮箱">
              <Input v-model="modifyDataInfo.mail"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="是否可见全部广告主" :label-width="180">
              <RadioGroup v-model="modifyDataInfo.allSource">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem label="是否可见全部下游用户" :label-width="180">
              <RadioGroup v-model="modifyDataInfo.allUser">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="GAP收入数据是否可见" :label-width="180">
              <RadioGroup v-model="modifyDataInfo.dataAuth">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="modifyModal = false"><span>关闭</span></button>
        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="modifyDataOk"><span>保存</span></button>
      </div>
    </Modal>
    <!--分配角色-->
    <Modal
      v-model="setUserRoleModal"
      title="分配角色"
      :mask-closable="false"
      width="800">
      <section>
        <Row class="margin-top-10">
          <Col span="3"><span class="label_txt">所属角色：</span></Col>
          <Col span="20">
            <CheckboxGroup v-model="setSelRoleList">
              <Checkbox v-for="item in roleList" :key="item.id + ''" :label="item.id" class="label_txt"><span>{{item.name}}</span></Checkbox>
            </CheckboxGroup>
          </Col>
        </Row>
      </section>
      <div slot="footer">
        <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="setUserRoleModal = false"><span>关闭</span></button>
        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="setUserRoleOk"><span>保存</span></button>
      </div>
    </Modal>
    <!-- 管理下游用户 -->
    <Modal
      v-model="downstreamModal"
      title="管理下游"
      :mask-closable="false"
      width="800">
      <Row>
        <Col span="5"><span class="label_txt">是否可见全部下游用户：</span></Col>
        <Col span="4">
          <RadioGroup v-model="isShowAllUser">
            <Radio label="1"><span class="label_txt">是</span></Radio>
            <Radio label="0"><span class="label_txt">否</span></Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Transfer class="margin-top-20"
      :data="downstreamUserList"
      :target-keys="targetKeys"
      :titles="['全部用户', '已选用户']"
      filterable
      :filter-method="filterMethod"
      :list-style="{width: '350px', height: '450px'}"
      @on-change="handleChange"></Transfer>
      <div slot="footer">
        <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="downstreamModal = false"><span>关闭</span></button>
        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="saveDownstreamUserData"><span>保存</span></button>
      </div>
    </Modal>
    <!-- 管理上游广告主 -->
    <Modal
      v-model="upstreamModal"
      title="管理上游广告主"
      :mask-closable="false"
      width="800">
      <Row>
        <Col span="5"><span class="label_txt">是否可见全部广告主：</span></Col>
        <Col span="4">
          <RadioGroup v-model="isShowAllSource">
            <Radio label="1"><span class="label_txt">是</span></Radio>
            <Radio label="0"><span class="label_txt">否</span></Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Transfer class="margin-top-20"
      :data="uptreamSourceList"
      :target-keys="sourceTargetKeys"
      :titles="['全部用户', '已选用户']"
      filterable
      :filter-method="filterMethod"
      :list-style="{width: '350px', height: '450px'}"
      @on-change="handleChange2"></Transfer>
      <div slot="footer">
        <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="upstreamModal = false"><span>关闭</span></button>
        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="saveUpstreamSourceData"><span>保存</span></button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'navigation',
  data () {
    return {
      dataInfo: {},
      dataList: [], // 数据列表
      dataTotal: 0, // 总页数
      pageNum: 1,
      pageSize: 20,
      pageSizeCfg: [10, 20, 30, 50],
      modelTitle: '',
      spinShow: false,
      showModal: false,
      modifyModal: false,
      modifyDataInfo: {},
      isAddNewData: false,
      setUserRoleModal: false,
      roleList: [],
      roleIdsList: [],
      setSelRoleList: [],
      curUserId: '',
      curOptRowIdx: '',
      // 管理下游
      downstreamModal: false,
      downstreamUserList: [],
      targetKeys: [],
      isShowAllUser: '0',
      // 管理上游
      upstreamModal: false,
      uptreamSourceList: [],
      sourceTargetKeys: [],
      isShowAllSource: '0',
      tableConfig: [
        {
          title: '昵称',
          key: 'nickname',
          width: 100
        },
        {
          title: '登录名',
          key: 'username',
          width: 150
        },
        {
          title: '手机号',
          key: 'mobile',
          width: 200
        },
        {
          title: '邮箱',
          key: 'mail',
          width: 200
        },
        {
          title: '最后登录时间',
          align: 'center',
          key: 'lastLoginTime',
          width: 120
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 500,
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
                    this.modifyDataInfo.pswd = ''
                    this.editInfo(params.index, params.row.id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.curUserId = params.row.id

                    this.setUserRole()
                  }
                }
              }, '分配角色'),
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.isShowAllSource = params.row.allSource + ''
                    this.curUserId = params.row.id
                    this.curOptRowIdx = params.index
                    this.upstreamModal = true
                    this.getUptreamSourceList()
                    this.getHasSourceList()
                  }
                }
              }, '管理上游'),
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.isShowAllUser = params.row.allUser + ''
                    this.curUserId = params.row.id
                    this.curOptRowIdx = params.index
                    this.downstreamModal = true
                    this.getDownstreamUserList()
                    this.getHasUserList()
                  }
                }
              }, '管理下游'),
              h('Button', {
                props: {
                  type: 'error'
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
              h('i-switch', {
                props: {
                  value: params.row.status == 1
                },
                on: {
                  'on-change': (flag) => {
                    this.changeStatus(flag, params.row.id, params.index)
                  }
                }
              })
            ])
          }
        }
      ],
      formRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        pswd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getDataList()
    this.getUserAllRole()
  },
  methods: {
    // 获取数据
    getDataList () {
      // this.spinShow = true;
      // this.axios.post('/sys/user/list.do', {
      //   page: this.pageNum,
      //   limit: this.pageSize,
      //   data: {}
      // }).then(rt => {
      //   this.spinShow = false;
      //   if(rt.code == 0){
      //     this.dataList = rt.data.list;
      //     this.dataTotal = rt.data.total;
      //   }
      // });
    },
    // 添加
    addNewData () {
      this.$refs.dataForm.resetFields()
      this.dataInfo = { allSource: '0', allUser: '0' }
      this.isAddNewData = true
      this.roleIdsList = []
      this.showModal = true
    },
    // 修改
    editInfo (idx) {
      this.modifyModal = true
      this.isAddNewData = false
      let data = this.dataList[idx]
      this.modifyDataInfo.id = data.id
      this.modifyDataInfo.nickname = data.nickname
      this.modifyDataInfo.mail = data.mail
      this.modifyDataInfo.mobile = data.mobile
      this.modifyDataInfo.allSource = data.allSource + ''
      this.modifyDataInfo.allUser = data.allUser + ''
      this.modifyDataInfo.dataAuth = data.dataAuth + ''
    },
    // 保存
    saveDataOk () {
      let url = ''
      let data = {}
      if (this.isAddNewData) {
        url = '/sys/user/add.do'
        data = this.dataInfo
        data.roleIds = this.roleIdsList.join()
      } else {
        url = '/sys/user/update.do'
        data = this.modifyDataInfo
      }
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.axios.post(url, data).then(rt => {
            if (rt.code == 0) {
              this.getDataList()
              this.$Message.success(rt.msg)
              this.showModal = false
            }
          })
        }
      })
    },
    // 修改保存
    modifyDataOk () {
      this.axios.post('/sys/user/update.do', this.modifyDataInfo).then(rt => {
        if (rt.code == 0) {
          this.getDataList()
          this.$Message.success(rt.msg)
          this.modifyModal = false
        }
      })
    },
    // 切换页
    changePage (pageNum) {
      this.pageNum = pageNum
      this.getDataList()
    },
    // 删除
    deleteData (id) {
      this.$Modal.confirm({
        content: '确定要删除吗？',
        onOk: () => {
          this.axios.post('/sys/user/delete.do', {
            ids: id
          }).then(rt => {
            this.$Message.success(rt.msg)
            this.getDataList()
          })
        }
      })
    },
    // 分配角色
    setUserRole () {
      this.setUserRoleModal = true
      this.getCurUserRole()
    },
    // 获取当前用户角色
    getCurUserRole () {
      this.setSelRoleList = []
      this.axios.post('/sys/user/getUserRoleList.do', {
        userId: this.curUserId
      }).then(rt => {
        if (rt.code == 0) {
          let list = []
          rt.data.forEach(item => {
            list.push(item.id)
          })
          this.setSelRoleList = list
        }
      })
    },
    setUserRoleOk () {
      this.axios.post('/role/assignUserRoles.do', {
        userId: this.curUserId,
        roleIds: this.setSelRoleList.join()
      }).then(rt => {
        if (rt.code == 0) {
          this.setUserRoleModal = false
          this.$Message.success(rt.msg)
        }
      })
    },
    // 获取所有角色
    getUserAllRole () {
      this.axios.post('/role/list.do', {
        page: 1,
        limit: 10000
      }).then(rt => {
        if (rt.code == 0) {
          this.roleList = rt.data.list
        }
      })
    },
    // 更改用户状态
    changeStatus (flag, id, idx) {
      this.axios.post('/sys/user/updateUserStatusByIds.do', {
        userIds: id,
        status: flag ? 1 : 0
      }).then(rt => {
        if (rt.code == 0) {
          this.dataList[idx].status = flag ? 1 : 0
          this.$Message.success(rt.msg)
        }
      })
    },
    // 筛选
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1
    },
    // 更新目标列表
    handleChange (newList) {
      this.targetKeys = newList
    },
    // 下游全部用户
    getDownstreamUserList () {
      this.downstreamUserList = []
      this.axios.post('/user/private/list.do', {
        page: 1,
        limit: 10000
      }).then(rt => {
        if (rt.code == 0) {
          let dataList = rt.data.list
          let returnList = []
          dataList.forEach(item => {
            returnList.push({
              key: item.userId,
              label: item.account + '-' + item.contact
            })
          })
          this.downstreamUserList = returnList
        }
      })
    },
    // 已设置用户列表
    getHasUserList () {
      this.targetKeys = []
      this.axios.post('/sys/user/mapping/user/list.do', {
        sysUserId: this.curUserId
      }).then(rt => {
        if (rt.code == 0) {
          this.targetKeys = rt.data.userIdList
        }
      })
    },
    // 保存修改
    saveDownstreamUserData () {
      this.axios.post('/sys/user/mapping/user/update.do', {
        sysUserId: this.curUserId,
        allUser: this.isShowAllUser,
        userIds: this.targetKeys.join()
      }).then(rt => {
        if (rt.code == 0) {
          this.downstreamModal = false
          this.$Message.success(rt.msg)
          this.dataList[this.curOptRowIdx].allUser = this.isShowAllUser
        }
      })
    },

    // 管理上游部分
    // 更新目标列表
    handleChange2 (newList) {
      this.sourceTargetKeys = newList
    },
    // 全部广告主
    getUptreamSourceList () {
      this.uptreamSourceList = []
      this.axios.post('/source/private/list.do', {
        page: 1,
        limit: 10000
      }).then(rt => {
        if (rt.code == 0) {
          let dataList = rt.data.list
          let returnList = []
          dataList.forEach(item => {
            returnList.push({
              key: item.id,
              label: item.name + '-' + item.companyName
            })
          })
          this.uptreamSourceList = returnList
        }
      })
    },
    // 已设置广告主列表
    getHasSourceList () {
      this.sourceTargetKeys = []
      this.axios.post('/sys/user/mapping/source/list.do', {
        sysUserId: this.curUserId
      }).then(rt => {
        if (rt.code == 0) {
          this.sourceTargetKeys = rt.data.sourceIdList
        }
      })
    },
    // 保存修改
    saveUpstreamSourceData () {
      this.axios.post('/sys/user/mapping/source/update.do', {
        sysUserId: this.curUserId,
        allSource: this.isShowAllSource,
        sourceIds: this.sourceTargetKeys.join()
      }).then(rt => {
        if (rt.code == 0) {
          this.upstreamModal = false
          this.$Message.success(rt.msg)
          this.dataList[this.curOptRowIdx].allSource = this.isShowAllSource
        }
      })
    }
  }
}
</script>
