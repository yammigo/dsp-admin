<style lang='less'>
</style>
<template>
<div>
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <FormItem prop="userId">
                    <Select  v-model="formSearch.userId" placeholder="请选择" filterable clearable style="width:200px">
                        <Option :value="item.id+''" v-for="(item,index) in userList" :key="index">{{item.loginName}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="companyId">
                    <Select v-model="formSearch.companyId" placeholder="公司主体" clearable style="width:200px">
                        <Option :value="item.id" v-for="(item,index) in companyList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="status">
                    <Select v-model="formSearch.status" placeholder="状态" clearable style="width:100px">
                        <Option :value="key" v-for="(value,key,index) in rechargeS" :key="index">{{value}}</Option>
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
            <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">新增充值</Button></div>
            <div class="data_table">
                <Table :highlight-row="true" size='small' :loading="tableData.loading" :height="tableH" border :columns="tableData.columns" :data="tableData.data"></Table>
            </div>
            <div class="table_page" style="margin-top:10px;">
                <Page :total="pageData.total" :page-size="pageData.limit" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-total show-sizer />
            </div>

        </div>

    </Card>
    <Modal v-model="modalData.show" :title="modalData.type=='add'?'添加用户':'修改用户'" :mask-closable="false" :closable="false">
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
            <FormItem label="用户" prop="userId">
                <Select v-if="modalData.show" v-model="formData.userId" placeholder="请选择" filterable clearable>
                    <Option :value="item.id+''" v-for="(item,index) in userList" :key="index">{{item.loginName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="类型" prop="rechargeType">
                <Select v-if="modalData.show" v-model="formData.rechargeType" placeholder="请选择" clearable>
                    <Option value="1">充值</Option>
                    <Option value="-1">扣除</Option>
                </Select>
            </FormItem>
            <FormItem label="充值金额">
                <Input v-model="formData.amount" placeholder=""></Input>
            </FormItem>
            <FormItem label="说明">
                <Input v-model="formData.submitRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" :loading="modalData.loading" @click="saveModal('formData')">保存</Button>
            <Button type="success" @click="modalData.show=false,$refs.formData.resetFields(),formData={}">取消</Button>
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
  getRecharge,
  addRecharge,
  updateStatus
} from './api'

export default {
  name: 'recharge_page',
  mixins: [status, config],
  data () {
    return {
      rechargeS: {
        '0': '不通过',
        '1': '通过'
      },
      userList: [],
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
      tableH: '',
      tableData: {
        loading: false,
        columns: [{
          title: '用户',
          key: 'userName',

          width: 120
        },
        {
          title: '企业名称',
          key: 'qaCompanyName',
          width: 200,
          align: 'center'

        },
        {
          title: '状态',
          key: 'status',
          align: 'left',
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'dot',
                color: dictData.statusType[params.row.status + '']
              }

            }, dictData.authStatus[params.row.status + ''])
          },
          width: 140

        },
        {
          title: '金额',
          key: 'amount',
          align: 'right',
          width: 120
        },
        {
          title: '账户余额',
          key: 'balanceAmount',
          align: 'right',
          width: 120
        },
        {
          title: '所属商务',
          key: 'managerBusinessName',
          width: 120

        },
        {
          title: '所属运营',
          key: 'managerOperationName',
          width: 120

        },
        {
          title: '创建人',
          key: 'submitUser',
          width: 120
        },
        {
          title: '创建时间',
          key: 'submitTime',

          width: 120
        },

        {
          title: '审核人',
          key: 'auditUser',
          width: 120

        },
        {
          title: '审核时间',
          key: 'auditTime',
          width: 120

        },
        {
          title: '手机号',
          key: 'mobile',
          width: 120

        },
        {
          title: '所属主体',
          key: 'companyName',

          width: 120

        },
        {
          title: '联系人姓名',
          key: 'userName',
          width: 120

        },
        {
          title: '邮箱 ',
          key: 'email',
          width: 120

        },
        {
          title: '说明',
          key: 'submitRemark',
          width: 200

        },
        {
          title: ' ',
          key: 'action',
          fixed: 'right',
          align: 'left',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'

                },
                style: {
                  color: dictData.statusColor[1]
                },
                on: {
                  click: () => {
                    let value = ''
                    this.$Modal.confirm({
                      render: (h) => {
                        return h('Input', {
                          props: {
                            value: value,
                            autofocus: true,
                            placeholder: '请填写说明'
                          },

                          on: {
                            input: (val) => {
                              value = val
                            }
                          }
                        })
                      },
                      title: '你确定要通过这条申请吗？',
                      loading: true,
                      onOk: () => {
                        updateStatus({
                          id: params.row.id,
                          status: 1,
                          remark: value
                        }).then(res => {
                          if (res.data.ok) {
                            this.$Message.success('操作成功')
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

              }, '通过'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'

                },
                style: {
                  color: dictData.statusColor[1]
                },
                on: {
                  click: () => {
                    let value = ''
                    this.$Modal.confirm({
                      render: (h) => {
                        return h('Input', {
                          props: {
                            value: value,
                            autofocus: true,
                            placeholder: '请填写说明'
                          },

                          on: {
                            input: (val) => {
                              value = val
                            }
                          }
                        })
                      },
                      title: '你确定要不通过这条申请吗？',
                      loading: true,
                      onOk: () => {
                        updateStatus({
                          id: params.row.id,
                          status: -2,
                          remark: value
                        }).then(res => {
                          if (res.data.ok) {
                            this.$Message.success('操作成功')
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

              }, '不通过')
            ])
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
    getUserList({
      page: 1,
      limit: 10000,
      data: {}
    }).then(res => {
      if (res.data.ok) {
        this.userList = res.data.data.list
      }
    })
    this.search()
  },
  methods: {
    getList (page) {
      this.tableData.loading = true
      let data = {
        page: page || this.pageData.page,
        limit: this.pageData.limit,
        data: this.formSearch
      }
      getRecharge(data).then(resp => {
        this.tableData.loading = false
        if (resp.data.ok) {
          this.tableData.data = resp.data.data.list
          this.pageData.total = resp.data.data.total
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
              addRecharge(this.formData).then(res => {
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
              updateStatus(this.formData).then(res => {
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
