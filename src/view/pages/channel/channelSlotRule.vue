<style lang='less'>
</style>
<template>
<div>
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <FormItem prop="groupName">
                    <Input type="text" v-model="formSearch.appName" clearable>
                    <div slot="prepend">策略名称</div>
                    </Input>
                </FormItem>
                <FormItem prop="status">
                    <Select v-model="formSearch.status" placeholder="启用状态" clearable style="width:100px">
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
            <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">添加策略</Button></div>
            <div class="data_table">
                <Table size='small' :loading="tableData.loading" border :columns="tableData.columns" :data="tableData.data"></Table>
            </div>
            <div class="table_page" style="margin-top:10px;">
                <Page :total="pageData.total" :page-size="pageData.limit" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-total show-sizer />
            </div>

        </div>

    </Card>
    <Modal v-model="modalData.show" :width="610" :title="modalData.type=='add'?'添加广告组':'修改广告组'" :mask-closable="false" :closable="false">
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
            <FormItem label="策略名称" prop="ruleName">
                <Input v-model="formData.ruleName" placeholder=""></Input>
            </FormItem>
            <FormItem label="关键词">
                <Input v-model="formData.wordsList" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="逗号隔开"></Input>
            </FormItem>
             <FormItem label="关键词屏蔽" prop="wordsStatus">
                <RadioGroup v-model="formData.wordsStatus">
                    <Radio label="1">开启</Radio>
                    <Radio label="0">关闭</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="url">
                <Input v-model="formData.urlList" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="逗号隔开"></Input>
            </FormItem>
              <FormItem label="url屏蔽" prop="urlStatus">
                <RadioGroup v-model="formData.urlStatus">
                    <Radio label="1">开启</Radio>
                    <Radio label="0">关闭</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="包名" prop="packageList">
                <Input v-model="formData.packageList" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="逗号隔开"></Input>
            </FormItem>
             <FormItem label="包名屏蔽" prop="packageStatus">
                <RadioGroup v-model="formData.packageStatus">
                    <Radio label="1">开启</Radio>
                    <Radio label="0">关闭</Radio>
                </RadioGroup>
            </FormItem>
            <!-- <FormItem label="屏蔽url" prop="companyId">
                <Select v-model="formData.companyId" placeholder="逗号隔开" clearable>
                    <Option :value="item.id+''" v-for="(item,index) in companyList" :key="index">{{item.name}}</Option>
                </Select>
            </FormItem> -->

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
  ruleApi
} from './api'
import {
  getUserList
} from '../users/api'
export default {
  name: 'channelSlotRule',
  mixins: [status, config],
  data () {
    return {

      userList: [],
      companyList: [],
      categoryList: [],
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
        columns: [{
          title: '名称',
          key: 'ruleName',
          width: 200

        },
        {
          title: '状态',
          key: 'status',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'dot',
                color: this.dictData.statusBtn[params.row.status + '']
              },
              style: {
                border: 'none !important'
              }

            }, params.row.status ? '启用' : '禁用')
          }
        },

        {
          title: 'url屏蔽',
          key: 'urlStatus',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'dot',
                color: this.dictData.statusBtn[params.row.urlStatus + '']
              },
              style: {
                border: 'none !important'
              }

            }, params.row.urlStatus ? '开启' : '关闭')
          }

        },
        {
          title: '包名屏蔽',
          key: 'packageStatus',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'dot',
                color: this.dictData.statusBtn[params.row.packageStatus + '']
              },
              style: {
                border: 'none !important'
              }

            }, params.row.packageStatus ? '开启' : '关闭')
          }

        },
        {
          title: '关键词屏蔽',
          key: 'wordsStatus',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'dot',
                color: this.dictData.statusBtn[params.row.wordsStatus + '']
              },
              style: {
                border: 'none !important',
                textAlign: 'left'
              }

            }, params.row.wordsStatus ? '开启' : '关闭')
          }

        },
        {
          title: ' ',
          key: 'action',
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
                        ruleApi.updateRuleStatus({
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
      ruleApi.getRule(data).then(resp => {
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
              ruleApi.addRule(this.formData).then(res => {
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
              ruleApi.updateRule(this.formData).then(res => {
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
