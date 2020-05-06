<style lang='less'>
</style>
<template>
<div>
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <FormItem prop="groupName">
                    <Input type="text" v-model="formSearch.groupName" clearable>
                    <div slot="prepend">广告组名称</div>
                    </Input>
                </FormItem>
                <FormItem prop="userId">
                    <Select v-model="formSearch.userId" placeholder="用户" filterable clearable>
                        <Option :value="item.id+''" v-for="(item,index) in userList" :key="index">{{item.loginName}}</Option>
                    </Select>
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
            <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">创建广告组</Button></div>
            <div class="data_table">
                <Table size='small' :loading="tableData.loading" border :columns="tableData.columns" :data="tableData.data"></Table>
            </div>
            <div class="table_page" style="margin-top:10px;">
                <Page :total="pageData.total" :page-size="pageData.limit" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-total show-sizer />
            </div>

        </div>

    </Card>
    <Modal v-model="modalData.show" :title="modalData.type=='add'?'添加广告组':'修改广告组'" :mask-closable="false" :closable="false">
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
            <FormItem label="用户" prop="userId">
                <Select v-if="modalData.show" v-model="formData.userId" placeholder="请选择" filterable clearable>
                    <Option :value="item.id+''" v-for="(item,index) in userList" :key="index">{{item.loginName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="广告组名称" prop="groupName">
                <Input v-model="formData.groupName" placeholder=""></Input>
            </FormItem>
            <FormItem label="公司主体" prop="companyId">
                <Select v-model="formSearch.companyId" placeholder="公司主体" clearable>
                    <Option :value="item.id+''" v-for="(item,index) in companyList" :key="index">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="推广目的" prop="groupTarget">
                <Select v-model="formData.groupTarget" placeholder="请选择" clearable>
                    <Option value="1">推广告1</Option>
                    <Option value="2">拉用户</Option>
                </Select>
            </FormItem>
            <FormItem label="备注">
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
import status from '@/mixin/status'
import config from '@/mixin/config'
import {
  getCompany
} from '@/api/common'
import {
  adGroupApi
} from './api'
import {
  getUserList
} from '../users/api'
export default {
  name: 'adGroup',
  mixins: [status, config],
  data () {
    return {
      userList: [],
      companyList: [],
      formSearch: {

      },
      formData: {

      },
      ruleValidate: {

        companyId: [{
          required: true,
          message: '请选择公司主体',
          trigger: 'change'

        }],
        userId: [{
          required: true,
          message: '请选择一个用户',
          trigger: 'change'

        }],
        groupName: [{
          required: true,
          message: '请填写分组名称',
          trigger: 'blur'

        }],
        groupTarget: [{
          required: true,
          message: '请选择推广目的',
          trigger: 'change'

        }]

      },
      tableH: false,
      tableData: {
        loading: false,
        columns: [{
          title: '广告组',
          key: 'groupName',
          width: 100

        },
        {
          title: '所属用户',
          key: 'loginName',
          width: 180

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
                color: this.dictData.statusBtn[params.row.status + '']
              }

            }, this.dictData.statusA[params.row.status + ''])
          }

        },

        {
          title: '推广目的',
          key: 'groupTarget',

          width: 120

        },
        {
          title: '所属公司主体',
          key: 'companyName',
          width: 120

        },

        {
          title: '备注',
          key: 'remark'

        },

        {
          title: '创建时间',
          key: 'createTime',
          width: 200
        },
        {
          title: ' ',
          key: 'action',
          fixed: 'right',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: this.dictData.statusColor[1]
                },
                on: {
                  click: () => {
                    this.modalData.type = 'edit'
                    this.modalData.show = true

                    params.row.userId += ''
                    params.row.companyId += ''
                    params.row.groupTarget += ''
                    this.formData = {
                      ...params.row
                    }
                  }
                }

              }, '修改'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'

                },
                style: {
                  color: this.dictData.statusColor[1]
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '你确定要' + this.dictData.statusA[params.row.status ? 0 : 1 + ''] + '吗？',
                      loading: true,
                      onOk: () => {
                        let status = params.row.status == 0 ? 1 : 0
                        adGroupApi.updateGroupStatus({
                          id: params.row.id,
                          status: status
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

              }, this.dictData.statusA[params.row.status ? 0 : 1] || '未知')

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
    this.getUserList()

    this.search()
  },
  methods: {
    getUserList () {
      getUserList({
        page: 1,
        limit: 10000,
        data: {}
      }).then(resp => {
        if (resp.data.ok) {
          this.userList = resp.data.data.list
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
      adGroupApi.getAdGroup(data).then(resp => {
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
              adGroupApi.addGroup(this.formData).then(res => {
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
              adGroupApi.updateGroup(this.formData).then(res => {
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
