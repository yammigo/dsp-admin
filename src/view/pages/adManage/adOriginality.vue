<style lang='less'>
</style>
<template>
<div>
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
            <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">添加创意</Button></div>
            <div class="data_table">
                <Table size='small' :loading="tableData.loading" border :columns="tableData.columns" :data="tableData.data"></Table>
            </div>
            <div class="table_page" style="margin-top:10px;">
                <Page :total="pageData.total" :page-size="pageData.limit" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-total show-sizer />
            </div>

        </div>

    </Card>
    <Modal v-model="modalData.show" :title="modalData.type=='add'?'添加创意':'修改创意'" :mask-closable="false" :closable="false">
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
            <Row>
                <Col span="11">
                <FormItem label="所属计划" prop="planId">
                    <Select v-if="modalData.show" v-model="formData.planId" placeholder="计划名称" clearable>
                        <Option :value="item.id+''" v-for="(item,index) in planList" :key="index">{{item.planName}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <!-- <Col span="2" style="text-align: center">-</Col> -->
                <Col span="11">
                <FormItem label="密码" prop="password">
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
    <Modal v-model="modalData.show" title="查看创意" :mask-closable="false" :closable="false">

    </Modal>
</div>
</template>

<script>
import dictData from './dict'
import status from '@/mixin/status'
import config from '@/mixin/config'
import {
  getCompany
} from '@/api/common'
import {
  ideaApi,
  adPlanApi
} from './api'
export default {
  name: 'adOriginality',
  mixins: [status, config],
  data () {
    return {
      companyList: [],
      planList: [],
      formSearch: {

      },
      formData: {

      },
      ruleValidate: {},
      tableH: 500,
      tableData: {
        loading: false,
        columns: [

          {
            title: '创意名称',
            key: 'ideaName',

            width: 200

          },
          {
            title: '创意标题',
            key: 'ideaTitle',
            width: 200
          },
          {
            title: '副标题',
            key: 'ideaSubtitle',
            width: 200
          },
          {
            title: '内容',
            key: 'context',
            width: 200
          },
          {
            title: '跳转链接',
            key: 'clickUrl',
            width: 400
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            width: 140,
            fixed: 'right',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: dictData.statusType[params.row.status + '']
                }

              }, dictData.authStatus[params.row.status + ''])
            }

          },
          {
            title: '所属公司主体',
            key: 'companyName',

            width: 120

          },
          {
            title: '产品名称',
            key: 'productName',
            width: 200
          },
          {
            title: '所属计划',
            key: 'planName',

            width: 200

          },
          {
            title: '所属组',
            key: 'groupName',
            width: 200

          },

          {
            title: ' ',
            key: 'action',
            fixed: 'right',
            align: 'left',
            width: 200,
            render: (h, params) => {
              let button = []
              if (params.row.status == -2) {
                return ''
              }
              if (params.row.status == -1) {
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
                        this.$Modal.confirm({
                          title: '你确定要通过吗？',
                          loading: true,
                          onOk: () => {
                            ideaApi.updateStatus({
                              id: params.row.id,
                              status: 1
                            }).then(res => {
                              if (res.data.ok) {
                                this.$Message.success(res.data.msg)
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

                  }, '审核通过'),
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
                          title: '你确定要不通过吗？',
                          loading: true,
                          onOk: () => {
                            ideaApi.updateStatus({
                              id: params.row.id,
                              status: '-2'
                            }).then(res => {
                              if (res.data.ok) {
                                this.$Message.success(res.data.msg)
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

                  }, '审核不通过')

                ])
              }
              if (params.row.status == 0) {
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
                        this.$Modal.confirm({
                          title: '你确定要通过吗？',
                          loading: true,
                          onOk: () => {
                            ideaApi.updateStatus({
                              id: params.row.id,
                              status: 1
                            }).then(res => {
                              if (res.data.ok) {
                                this.$Message.success(res.data.msg)
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

                  }, '启用')

                ])
              }
              if (params.row.status == 1) {
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
                        this.$Modal.confirm({
                          title: '你确定要通过吗？',
                          loading: true,
                          onOk: () => {
                            ideaApi.updateStatus({
                              id: params.row.id,
                              status: 0
                            }).then(res => {
                              if (res.data.ok) {
                                this.$Message.success(res.data.msg)
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

                  }, '禁用')

                ])
              }
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
    adPlanApi.getAdPlan({
      page: 1,
      limit: 10000,
      data: {}
    }).then(res => {
      if (res.data.ok) {
        this.planList = res.data.data.list
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
      ideaApi.getIdea(data).then(resp => {
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
              ideaApi.addIdea(this.formData).then(res => {
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
              ideaApi.updateIdea(this.formData).then(res => {
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
