<style lang='less'>
</style>
<template>
<div class="usersManage">
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <FormItem prop="loginName">
                    <Input type="text" v-model="formSearch.loginName" clearable>
                    <div slot="prepend">账号</div>
                    </Input>
                </FormItem>
                <FormItem prop="mobile">
                    <Input type="text" v-model="formSearch.mobile" clearable>
                    <div slot="prepend">手机号</div>

                    </Input>
                </FormItem>
                <FormItem prop="companyId">
                    <Select v-model="formSearch.companyId" placeholder="公司主体" clearable style="width:200px">
                        <Option :value="item.id" v-for="(item,index) in companyList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="status">
                    <Select v-model="formSearch.status" placeholder="审核状态" clearable style="width:100px">
                        <Option :value="key" v-for="(value,key,index) in dictData.statusA" :key="index">{{value}}</Option>
                    </Select>
                </FormItem>

                <FormItem prop="statusCompany">
                    <Select v-model="formSearch.statusCompany" placeholder="企业认证状态" clearable style="width:120px">
                        <Option :value="key" v-for="(value,key,index) in dictData.statusB" :key="index">{{value}}</Option>

                    </Select>
                </FormItem>
                <FormItem prop="statusAdPut">
                    <Select v-model="formSearch.statusAdPut" placeholder="投放认证状态" clearable style="width:120px">
                        <Option :value="key" v-for="(value,key,index) in dictData.statusB" :key="index">{{value}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-search" @click="search(1)">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="md-refresh" color="#5cadff" @click="handleReset('formSearch')">重置</Button>
                </FormItem>
            </Form>
        </div>
        <div class="tableBox">
            <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">创建用户</Button></div>
            <div class="data_table">
                <Table size='small' :loading="tableData.loading" border :columns="tableData.columns" :data="tableData.data"></Table>
            </div>
            <div class="table_page" style="margin-top:10px;">
                <Page :total="pageData.total" :page-size="pageData.limit" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-total show-sizer />
            </div>

        </div>

    </Card>
    <Modal v-model="modalData.show" :title="modalData.type=='add'?'添加用户':'修改用户'" :mask-closable="false" :closable="false">
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
            <Row>
                <Col span="11">
                <FormItem label="账号" prop="loginName" v-if="this.modalData.type=='add'">
                    <Input v-model="formData.loginName" />
                </FormItem>
                </Col>
                <!-- <Col span="2" style="text-align: center">-</Col> -->
                <Col span="11">
                <FormItem label="密码" prop="password" v-if="this.modalData.type=='add'">
                    <Input v-model="formData.password" />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                <FormItem label="手机号" prop="mobile">
                    <Input v-model="formData.mobile" />
                </FormItem>
                </Col>
                <!-- <Col span="2" style="text-align: center">-</Col> -->
                <Col span="11">
                <FormItem label="公司主体" prop="companyId">
                    <Select v-if="modalData.show" v-model="formData.companyId" placeholder="公司主体" clearable>
                        <Option :value="item.id+''" v-for="(item,index) in companyList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                <FormItem label="姓名" prop="userName">
                    <Input v-model="formData.userName" />
                </FormItem>
                </Col>
                <!-- <Col span="2" style="text-align: center">-</Col> -->
                <Col span="11">
                <FormItem label="邮箱" prop="email">
                    <Input v-model="formData.email" />
                </FormItem>
                </Col>
            </Row>

        </Form>
        <div slot="footer">
            <Button type="primary" :loading="modalData.loading" @click="saveModal('formData')">保存</Button>
            <Button type="success" @click="modalData.show=false,$refs.formData.resetFields(),formData={}">取消</Button>
        </div>
    </Modal>
    <Modal v-model="userModal" title="企业认证审核" :mask-closable="false">
        <Form :model="userCompany" :label-width="80">
            <FormItem label="用户名">
                <b>{{userCompany.legalName}}</b>
            </FormItem>
            <FormItem label="公司名称">
                <b>{{userCompany.companyName}}</b>
            </FormItem>
            <FormItem label="身份证号">
                <b>{{userCompany.legalIdCardNumber}}</b>
            </FormItem>
            <FormItem label="身份正面">
                <a :href="userCompany.legalIdCardUrl1" target="_black"><img :src="userCompany.legalIdCardUrl1" width="200" style="border-radius:5px;" /></a>
            </FormItem>
            <FormItem label="身份背面">
                <a :href="userCompany.legalIdCardUrl2" target="_black"><img :src="userCompany.legalIdCardUrl2" width="200" style="border-radius:5px;" /></a>
            </FormItem>
            <FormItem label="营业执照">
                <a :href="userCompany.licenseUrl" target="_black"><img :src="userCompany.licenseUrl" width="200" style="border-radius:5px;" /></a>
            </FormItem>

        </Form>
        <div slot="footer">
            <Button type="error" v-if="userCompany.status==-1" @click="quaCompanyStatus(userCompany.userId,'-2')">审核不通过</Button>
            <Button type="primary" v-if="userCompany.status==-1" @click="quaCompanyStatus(userCompany.userId,'1')">审核通过</Button>
        </div>
    </Modal>
    <Modal v-model="userModal2" title="投放认证审核" :mask-closable="false">
        <Form :model="userPutInfo" :label-width="80">
            <FormItem label="ICP备案图片">
                <a :href="userPutInfo.icpUrl" target="_black"><img :src="userPutInfo.icpUrl" width="200" style="border-radius:5px;" /></a>
            </FormItem>
            <FormItem label="软件著作图片">
                <a :href="userPutInfo.swcrUrl" target="_black"><img :src="userPutInfo.swcrUrl" width="200" style="border-radius:5px;" /></a>
            </FormItem>
            <FormItem label="其他资质图片">
                <a :href="userPutInfo.otherUrl" target="_black"><img :src="userPutInfo.swcrUrl" width="200" style="border-radius:5px;" /></a>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="error" v-if="userPutInfo.status==-1" @click="quaPutStatus(userPutInfo.userId,'-2')">审核不通过</Button>
            <Button type="primary" v-if="userPutInfo.status==-1" @click="quaPutStatus(userPutInfo.userId,'1')">审核通过</Button>
        </div>
    </Modal>
</div>
</template>

<script>
import dictData from './dict.js'
import status from '@/mixin/status'
import config from '@/mixin/config'
import {
  getCompany
} from '@/api/common'
import {
  getUserList,
  addUser,
  updatePut,
  updateQuaCompany,
  updataUser,
  updataStatus,
  quaCompany,
  getuserPut
} from './api'

export default {
  name: 'usersManage_page',
  mixins: [status, config],
  data () {
    return {
      userModal2: false,
      userModal: false,
      userPutInfo: {},
      userCompany: {},
      companyList: [],
      formSearch: {

      },
      formData: {

      },
      ruleValidate: {
        loginName: [{
          required: true,
          message: '请填写用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请填写手机号',
          trigger: 'blur'
        }],
        companyId: [{
          required: true,
          message: '请选择公司主体',
          trigger: 'change'

        }],
        userName: [{
          required: true,
          message: '请填写联系人姓名',
          trigger: 'blur'

        }],
        email: [{
          required: true,
          message: '请填写邮箱',
          trigger: 'blur'

        }]

      },
      tableH: false,
      tableData: {
        loading: false,
        columns: [

          {
            title: '账号',
            key: 'loginName',
            width: 100

          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: dictData.statusType[params.row.status + '']
                }

              }, dictData.status[params.row.status + ''])
            }

          },
          {
            title: '企业认证状态',
            key: 'qaCompanyStatus',
            width: 140,
            render: (h, params) => {
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: dictData.statusType[params.row.qaCompanyStatus + '']
                }

              }, dictData.authStatus[params.row.qaCompanyStatus + ''])
            }

          },
          {
            title: '投放认证状态',
            key: 'statusAdPut',
            width: 140,
            render: (h, params) => {
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: dictData.statusType[params.row.qaAdPutStatus + '']
                }

              }, dictData.authStatus[params.row.qaAdPutStatus + ''])
            }

          },
          {
            title: '账户余额',
            key: 'amount',
            width: 120

          },
          {
            title: '手机',
            key: 'mobile',
            width: 120

          },
          {
            title: '所属公司主体',
            key: 'companyName',
            width: 120

          },
          {
            title: '联系人',
            key: 'userName',
            width: 120

          },
          {
            title: '邮箱',
            key: 'email',
            width: 120
          },
          {
            title: '注册时间',
            key: 'createTime',
            width: 120
          },
          {
            title: '最后登录时间',
            key: 'lastLoginTime',
            width: 120
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            align: 'left',
            width: 300,
            render: (h, params) => {
              let arr = [h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: dictData.statusColor[1]
                },
                on: {
                  click: () => {
                    this.modalData.type = 'edit'
                    this.modalData.show = true
                    this.formData = {
                      ...params.row
                    }
                    this.formData.companyId += ''
                  }
                }

              }, '修改'), h('Button', {
                props: {
                  type: 'text',
                  size: 'small'

                },
                style: {
                  color: dictData.statusColor[1]
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '你确定要' + dictData.statusText[params.row.status + ''].title + '吗？',
                      loading: true,
                      onOk: () => {
                        updataStatus({
                          userId: params.row.id,
                          status: dictData.statusText[params.row.status + ''].value
                        }).then(res => {
                          if (res.data.ok) {
                            this.$Modal.remove()
                            this.search()
                          }
                        })
                      },
                      onCancel: () => {

                      }
                    })
                  }
                }

              }, dictData.statusText[params.row.status + ''].title)]
              // 投放审核
              arr.push(h('Button', {
                props: {
                  type: 'text',
                  size: 'small'

                },
                style: {
                  color: dictData.statusColor[1]
                },
                on: {
                  click: () => {
                    this.getPutInfo(params.row.id)
                  }
                }
              }, '投放认证'))
              arr.push(h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: dictData.statusColor[1]
                },
                on: {
                  click: () => {
                    this.getCompanyInfo(params.row.id)
                  }
                }
              }, '企业认证'))
              return arr
            }
          }
        ],
        data: []

      }

    }
  },
  mounted () {
    getCompany({}).then(res => {
      if (res.data.ok) {
        this.companyList = res.data.data
      }
    })
    this.search()
  },
  methods: {
    // 企业认证
    quaCompanyStatus (userId, status) {
      let remark = ''
      this.$Modal.confirm({
        title: (status == -2 ? '不通过' : '通过') + '该企业的资质审核吗？',
        loading: true,
        render: (h) => {
          return h('Input', {
            props: {
              value: remark,
              autofocus: true,
              placeholder: '请填写审核备注信息'
            },
            on: {
              input: (val) => {
                remark = val
              }
            }
          })
        },
        onOk: () => {
          updateQuaCompany({
            userId: userId,
            status: status,
            remark: remark
          }).then(res => {
            if (res.data.ok) {
              this.$Message.success('操作成功')
              this.$Modal.remove()
              this.userModal = false
              this.search()
            }
          })
        },
        onCancel: () => {

        }
      })
    },
    // 投放认证
    quaPutStatus (userId, status) {
      let remark = ''
      this.$Modal.confirm({
        title: (status == -2 ? '不通过' : '通过') + '该企业的投放审核吗？',
        loading: true,
        render: (h) => {
          return h('Input', {
            props: {
              value: remark,
              autofocus: true,
              placeholder: '请填写审核备注信息'
            },
            on: {
              input: (val) => {
                remark = val
              }
            }
          })
        },
        onOk: () => {
          updatePut({
            userId: userId,
            status: status,
            remark: remark
          }).then(res => {
            if (res.data.ok) {
              this.userModal2 = false
              this.$Message.success('操作成功')
              this.$Modal.remove()
              this.search()
            }
          })
        },
        onCancel: () => {

        }
      })
    },
    getCompanyInfo (userId) {
      quaCompany({
        userId: userId
      }).then(res => {
        if (res.data.ok) {
          this.userCompany = res.data.data
          this.userModal = true
        }
      })
    },
    getPutInfo (userId) {
      getuserPut({
        userId: userId
      }).then(res => {
        if (res.data.ok) {
          this.userPutInfo = res.data.data
          this.userModal2 = true
        }
      })
    },
    getList (page) {
      this.tableData.loading = true
      let data = {
        page: page || this.pageData.page,
        limit: this.pageData.limit,
        data: this.formSearch
      }
      getUserList(data).then(resp => {
        this.tableData.loading = false

        if (resp.data.ok) {
          // console.log(resp.data.data,"数据");
          this.tableData.data = resp.data.data.list
          this.pageData.total = resp.data.data.total
          // console.log(resp.data.data.total);
        }
      })
    },
    search (page) {
      this.getList(page)
    },
    saveModal (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          switch (this.modalData.type) {
            case 'add': // 创建
              this.modalData.loading = true
              addUser(this.formData).then(res => {
                this.modalData.loading = false
                if (res.data.ok) {
                  this.search(1)
                  this.$refs[name].resetFields()
                  this.modalData.show = false
                }
              })
              break
            case 'edit': // 修改
              this.modalData.loading = true
              updataUser(this.formData).then(res => {
                this.modalData.loading = false
                if (res.data.ok) {
                  this.search()
                  this.$refs[name].resetFields()
                  this.modalData.show = false
                }
              })
              break
          }
        } else {
          this.modelData.loading = false
        }
      })
    }
  },
  computed: {

  }
}
</script>
