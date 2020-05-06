<style lang='less'>
</style>
<template>
<div>
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <FormItem prop="loginName">
                    <Select v-model="formSearch.groupId" placeholder="所属组" clearable filterable>
                        <Option :value="item.id+''" v-for="(item,index) in groupList" :key="index">{{item.groupName}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="userId">
                    <Select v-model="formSearch.userId" placeholder="用户" filterable clearable>
                        <Option :value="item.id+''" v-for="(item,index) in userList" :key="index">{{item.loginName}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="mobile">
                    <Input type="text" v-model="formSearch.mobile" clearable>
                    <div slot="prepend">计划名称</div>
                    </Input>
                </FormItem>
                <FormItem prop="companyId">
                    <Select v-model="formSearch.companyId" placeholder="公司主体" clearable style="width:200px">
                        <Option :value="item.id" v-for="(item,index) in companyList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="status">
                    <Select v-model="formSearch.status" placeholder="状态" clearable style="width:100px">
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
            <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">创建计划</Button></div>
            <div class="data_table">
                <Table size='small' :loading="tableData.loading" border :columns="tableData.columns" :data="tableData.data"></Table>
            </div>
            <div class="table_page" style="margin-top:10px;">
                <Page :total="pageData.total" :page-size="pageData.limit" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-total show-sizer />
            </div>

        </div>

    </Card>
    <Modal :width="800" v-model="modalData.show" :title="modalData.type=='add'?'创建计划':'修改计划'" :mask-closable="false" :closable="false">
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
            <Row>
                <Col span="11">
                <FormItem label="所属组" prop="groupId">
                    <Select v-model="formData.groupId" placeholder="请选择" clearable filterable>
                        <Option :value="item.id+''" v-for="(item,index) in groupList" :key="index">{{item.groupName}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="11">
                <FormItem label="计划名称" prop="planName">
                    <Input v-model="formData.planName" />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                <FormItem label="投放平台" prop="platformType">
                    <CheckboxGroup v-model="formData.platformType">
                        <Checkbox :label="1">
                            <span>Android</span>
                        </Checkbox>
                        <Checkbox :label="2">
                            <span>IOS</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                </Col>

            </Row>
            <Row>
                <Col>
                <FormItem label="投放地域">
                    <selectCity v-if="modalData.show" v-model="formData.cityCodes" :dictCity="dictCityList"></selectCity>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                <FormItem label="开始时间" prop="putStartDate">
                    <DatePicker type="date" v-model="formData.putStartDate" placeholder="投放开始" @on-change="(date)=>{formData.putStartDate=date}" style="width:100%"></DatePicker>
                </FormItem>
                </Col>
                <!-- <Col span="2" style="text-align: center">-</Col> -->
                <Col span="11">
                <FormItem label="结束时间" prop="putEndDate">
                    <DatePicker type="date" v-model="formData.putEndDate" placeholder="投放结束" @on-change="(date)=>{formData.putEndDate=date}" style="width:100%"></DatePicker>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <FormItem label="投放时段">
                    <weekTime v-model="formData.weekHours"></weekTime>
                </FormItem>
            </Row>
            <Row>
                <Col span="11">
                <FormItem label="出价方式" prop="bidType">
                    <Select v-model="formData.bidType" placeholder="请选择" clearable>
                        <Option value="1">cpc</Option>
                        <Option value="2">cpm</Option>
                    </Select>
                </FormItem>
                </Col>

                <Col span="11">
                <FormItem label="投放方式" prop="putType">
                    <Select v-model="formData.putType" placeholder="请选择" clearable>
                        <Option value="1">匀速</Option>
                        <Option value="2">快速</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                <FormItem label="日预算" prop="putAmountDay">
                    <Input v-model="formData.putAmountDay" />
                </FormItem>
                </Col>

                <Col span="11">
                <FormItem label="出价金额" prop="bidAmount">
                    <Input v-model="formData.bidAmount" />
                </FormItem>
                </Col>
            </Row>
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
import selectCity from './components/selectCity'
import weekTime from './components/weekTime'
import {
  getCompany,
  getCityList
} from '@/api/common'
import {
  adPlanApi,
  adGroupApi
} from './api'
import {
  getUserList
} from '../users/api'
export default {
  name: 'adPlan',
  mixins: [status, config],
  components: {
    selectCity,
    weekTime
  },
  data () {
    return {
      groupList: [],
      userList: [],
      companyList: [],
      selectCityList: [],
      dictCityList: [],
      formSearch: {

      },
      formData: {},
      ruleValidate: {
        groupId: [{
          required: true,
          message: '请选择分组',
          trigger: 'change'
        }],
        planName: [{
          required: true,
          message: '请填写计划名称',
          trigger: 'blur'
        }],
        platformType: [{
          required: true,
          type: 'array',
          min: 1,
          message: '至少选择一个投放平台',
          trigger: 'change'
        }],
        // cityIds: [{
        //     required: true,
        //     message: '请选择投放地域',
        //     trigger: 'blur'

        // }],
        // weekHours: [{
        //     required: true,
        //     message: '请选择投放时段',
        //     trigger: 'blur',

        // }],
        bidType: [{
          required: true,
          message: '请选择出价方式',
          trigger: 'change'

        }],
        putType: [{
          required: true,
          message: '请选择投放方式',
          trigger: 'change'
        }]
        // putAmountDay: [{
        //     required: true,
        //     message: '请填写日预算',
        //     trigger: 'blur'
        // }],
        // bidAmount: [{
        //     required: true,
        //     message: '出价金额',
        //     trigger: 'blur'
        // }]

      },
      tableH: false,
      tableData: {
        loading: false,
        columns: [{
          title: '广告组名称',
          key: 'groupName',
          width: 200
        },
        {
          title: '计划名称',
          key: 'planName',
          width: 200
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
          title: '投放平台',
          key: 'platformType',
          width: 120,

          render: (h, params) => {
            let platform = {
              '1': 'Android',
              '2': 'IOS'
            }
            return h('div', {}, params.row.platformType.length < 2 ? platform[params.row.platformType[0]] : (platform[params.row.platformType[0] + ''] + '-' + platform[params.row.platformType[1] + '']))
          }
        },
        {
          title: '所属公司主体',
          key: 'companyName',
          width: 120
        },

        {
          title: '投放方式',
          key: 'putType',
          width: 120,
          render: (h, params) => {
            return h('div', {}, params.row.putType == 1 ? '匀速投放' : '快速投放')
          }
        },
        {
          title: '日预算',
          key: 'putAmountDay',
          width: 120,
          align: 'right'
        },
        {
          title: '日消耗',
          key: 'useAmountDay',
          width: 120,
          align: 'right'
        },
        {
          title: '出价方式',
          key: 'bidType',
          width: 120,
          render: (h, params) => {
            return h('div', {}, params.row.bidType == 1 ? 'cpc' : 'cpm')
          }
        },
        {
          title: '出价金额',
          key: 'bidAmount',
          width: 120
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
          align: 'left',
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
                    params.row.groupId += ''
                    params.row.putType += ''
                    params.row.bidType += ''
                    this.formData = {
                      ...params.row
                    }
                    this.formData.companyId += ''
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
                        adPlanApi.updateStatus({
                          id: params.row.id,
                          status: status
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

              }, this.dictData.statusA[params.row.status ? 0 : 1 + ''] || '未知')

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
    getCityList({}).then(res => {
      if (res.data.ok) {
        // console.log(res.data.data);
        // 初始化字典
        this.dictCityList = JSON.parse(JSON.stringify(res.data.data))
      }
    })
    this.getUserList()
    adGroupApi.getAdGroup({
      page: 1,
      limit: 10000,
      data: {}
    }).then(res => {
      if (res.data.ok) {
        // console.log(res.data.data);
        this.groupList = res.data.data.list
      }
    })
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
      adPlanApi.getAdPlan(data).then(resp => {
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
              adPlanApi.addPlan(this.formData).then(res => {
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
              adPlanApi.updatePlan(this.formData).then(res => {
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
