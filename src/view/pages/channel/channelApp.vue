<style lang='less'>
</style>
<template>
<div>
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <FormItem prop="groupName">
                    <Input type="text" v-model="formSearch.appName" clearable>
                    <div slot="prepend">应用名称</div>
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
                <FormItem>
                    <Button type="primary" icon="ios-search" @click="search(1)">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="md-refresh" color="#5cadff" @click="handleReset('formSearch')">重置</Button>
                </FormItem>
            </Form>
        </div>
        <div class="tableBox">
            <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">创建应用</Button></div>
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
            <FormItem label="应用名称" prop="appName">
                <Input v-model="formData.appName" placeholder=""></Input>
            </FormItem>
            <FormItem label="应用类型" prop="appType">
                <RadioGroup v-model="formData.appType">
                    <Radio label="1">APP</Radio>
                    <Radio label="2">网站</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="上游主体" prop="companyId">
                <Select v-model="formData.companyId" placeholder="公司主体" clearable>
                    <Option :value="item.id+''" v-for="(item,index) in companyList" :key="index">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem v-if="formData.appType==2" label="网站URL" prop="url">
                <Input v-model="formData.url" placeholder=""></Input>
            </FormItem>
            <FormItem v-if="formData.appType==2" label="备案信息" prop="recordInfo">
                <Input v-model="formData.recordInfo" placeholder=""></Input>
            </FormItem>
            <FormItem v-if="formData.appType==1" label="token" prop="token">
                <Input v-model="formData.token" placeholder=""></Input>
            </FormItem>
            <FormItem v-if="formData.appType==1" label="包名" prop="packageName">
                <Input v-model="formData.packageName" placeholder=""></Input>
            </FormItem>
            <FormItem v-if="formData.appType==1" label="系统类型" prop="osType">
                <RadioGroup v-model="formData.osType">
                    <Radio label="1">Android</Radio>
                    <Radio label="2">IOS</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="状态" prop="status">
                <RadioGroup v-model="formData.status">
                    <Radio label="1">启用</Radio>
                    <Radio label="0">禁用</Radio>
                </RadioGroup>
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
  appApi
} from './api'
import {
  getUserList
} from '../users/api'
export default {
  name: 'channelApp',
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

        appName: [{
          required: true,
          message: '请填写应用名称',
          trigger: 'blur'

        }],
        appType: [{
          required: true,
          message: '请选择应用类型',
          trigger: 'change'

        }]

      },
      tableH: false,
      tableData: {
        loading: false,
        columns: [
          {
            title: '应用名称',
            key: 'appName',
            width: 200

          },
          {
            title: '应用类型',
            key: 'appType',
            width: 100,
            render: (h, params) => {
              let dict = {
                '1': 'APP',
                '2': '网站'
              }
              return h('div', dict[params.row.appType + ''])
            }

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
                },
                style: {
                  border: 'none !important'
                }

              }, this.dictData.statusA[params.row.status + ''])
            }

          },
          {
            title: '上游名称',
            key: 'channelName',
            width: 100

          },
          {
            title: '上游主体名称',
            key: 'companyName',
            width: 180

          },
          {
            title: '包名',
            key: 'packageName',
            width: 180

          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 200
          },
          {
            title: ' ',
            key: 'action',
            width: 120,
            fixed: 'right',
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
                      this.formData = this.toStringVal({
                        ...params.row
                      })
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
                          appApi.updateAppStatus({
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
      appApi.getApp(data).then(resp => {
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
              appApi.addApp(this.formData).then(res => {
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
              appApi.updateApp(this.formData).then(res => {
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
