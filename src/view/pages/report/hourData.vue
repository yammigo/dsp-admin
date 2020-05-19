<style lang='less'>
</style>
<template>
<div>
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <div>
                    <FormItem>
                        <DatePicker v-model="formSearch.queryStartTime" type="date" placeholder="开始日期" @on-change="changeDateStart" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem prop="queryStartHour">
                        <Input v-model="formSearch.queryStartHour" placeholder="开始小时" clearable style="width:100px" />
                    </FormItem>
                    <FormItem>
                        <DatePicker v-model="formSearch.queryEndTime" type="date" placeholder="结束日期" @on-change="changeDateEnd" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem prop="queryEndHour">
                        <Input v-model="formSearch.queryEndHour" placeholder="结束小时" clearable style="width:100px" />
                    </FormItem>

                </div>
                <div>
                    <FormItem prop="groupId">
                        <Select v-model="formSearch.groupId" style="width:200px;" placeholder="广告组" filterable clearable>
                            <Option v-for="(item, index) in groupList" :key="index" :value="item.id">{{item.groupName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="planId">
                        <Select v-model="formSearch.planId" style="width:200px;" placeholder="计划" filterable clearable>
                            <Option v-for="(item, index) in planList" :key="index" :value="item.id">{{item.planName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="ideaId">
                        <Select v-model="formSearch.ideaId" style="width:200px;" placeholder="创意" filterable clearable>
                            <Option v-for="(item, index) in ideaList" :key="index" :value="item.id">{{item.ideaName}}</Option>
                        </Select>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="companyId">
                        <Select v-model="formSearch.companyId" style="width:200px;" placeholder="公司主体" filterable clearable>
                            <Option v-for="(item, index) in companyList" :key="index" :value="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="userId">
                        <Select v-model="formSearch.userId" style="width:200px;" placeholder="用户" filterable clearable>
                            <Option v-for="(item, index) in userList" :key="index" :value="item.id">{{item.userName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="appId">
                        <Select v-model="formSearch.appId" style="width:200px;" placeholder="应用" filterable clearable>
                            <Option v-for="(item, index) in appList" :key="index" :value="item.id">{{item.appName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="slotId">
                        <Select v-model="formSearch.slotId" style="width:200px;" placeholder="广告位" filterable clearable>
                            <Option v-for="(item, index) in codeList" :key="index" :value="item.id" :label="item.slotName">
                                <div>{{item.slotName}}</div>
                                <div style="color:#ccc">ID:{{item.slotCode}}</div>
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="ios-search" @click="search(1)">查询</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="md-refresh" color="#5cadff" @click="handleReset('formSearch')">重置</Button>
                    </FormItem>

                </div>

                <!-- <div>
                    <FormItem prop="queryStartHour">
                        <Input v-model="formSearch.queryStartHour" placeholder="开始小时" clearable style="width:100px" />
                    </FormItem>
                    <FormItem>-</FormItem>
                    <FormItem prop="queryEndHour">
                        <Input v-model="formSearch.queryEndHour" placeholder="结束小时" clearable style="width:100px" />
                    </FormItem>
                </div> -->
                <div>
                    <FormItem prop="groupBy">
                        <label>分组查询</label>
                        <CheckboxGroup v-model="formSearch.groupBy" @on-change="changeGroup">
                            <!-- <Checkbox label="companyId">
                                <span>公司主体</span>
                            </Checkbox> -->
                            <Checkbox label="userId">

                                <span>用户</span>
                            </Checkbox>
                            <Checkbox label="groupId">

                                <span>广告组</span>
                            </Checkbox>
                            <Checkbox label="planId">

                                <span>计划</span>
                            </Checkbox>
                            <Checkbox label="ideaId">

                                <span>创意</span>
                            </Checkbox>
                            <Checkbox label="channelId">
                                <span>渠道</span>
                            </Checkbox>
                            <Checkbox label="appId">

                                <span>应用</span>
                            </Checkbox>
                            <Checkbox label="slotId">

                                <span>广告位</span>
                            </Checkbox>
                            <Checkbox label="dataDate">
                                <span>日期</span>
                            </Checkbox>
                            <Checkbox label="dataHour">
                                <span>小时</span>
                            </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </div>

            </Form>
        </div>
        <div class="tableBox">
            <!-- <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">创建广告位</Button></div> -->
            <div class="data_table">
                <Table size='small' height="500" :loading="tableData.loading" border :columns="tableData.columns" :data="tableData.data"></Table>
            </div>
            <!-- <div class="table_page" style="margin-top:10px;">
                <Page :total="pageData.total" :page-size="pageData.limit" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-total show-sizer />
            </div> -->
        </div>
    </Card>
</div>
</template>

<script>
import config from '@/mixin/config'
import {
  getCompanyAll,
  getUserAll,
  getGroupAll,
  getPlanAll,
  getIdeaAll,
  getAppAll,
  getCodeAll
} from '@/api/common'
import {
  reportApi
} from './api'
export default {
  name: 'hourData',
  mixins: [config],
  data () {
    return {
      appList: [],
      codeList: [],
      groupList: [],
      planList: [],
      ideaList: [],
      companyList: [],
      userList: [],
      formSearch: {
        queryStartTime: Manba().format(),
        queryEndTime: Manba().format(),
        groupBy: ['dataDate', 'companyId', 'userId', 'groupId', 'planId', 'ideaId', 'appId', 'slotId', 'channelId', 'dataHour']
      },
      formData: {

      },
      ruleValidate: {

      },
      tableH: false,
      tableData: {
        loading: false,
        filterKey: {
          dataHour: ['dataHour'],
          dataDate: ['dataDate'],
          userId: ['userCompanyName'],
          companyId: ['companyName'],
          groupId: ['groupName'],
          planId: ['planName'],
          ideaId: ['ideaName'],
          channelId: ['channelName'],
          appId: ['appName'],
          slotId: ['slotName']
        },
        columns: [],
        commonCol: [{
          title: '金额',
          key: 'amount',
          width: 120,
          align: 'right'
        },
        {
          title: '返回数',
          key: 'sendCount',
          width: 120,
          align: 'right'
        },
        {
          title: '展现数',
          key: 'showCount',
          width: 120,
          align: 'right'
        },
        {
          title: '点击数',
          key: 'clickCount',
          width: 120,
          align: 'right'
        },
        {
          title: '开始下载',
          key: 'downStartCount',
          width: 120,
          align: 'right'
        },
        {
          title: '完成下载',
          key: 'downEndCount',
          width: 120,
          align: 'right'
        },
        {
          title: '开安装数',
          key: 'installStartCount',
          width: 120,
          align: 'right'
        },
        {
          title: '完成安装',
          key: 'installEndCount',
          width: 120,
          align: 'right'
        },
        {
          title: '开始播放',
          key: 'playStartCount',
          width: 120,
          align: 'right'
        },
        {
          title: '完成播放',
          key: 'playEndCount',
          width: 120,
          align: 'right'
        },
        {
          title: '关闭播放',
          key: 'closeCount',
          width: 120,
          align: 'right'
        },
        {
          title: '跳过',
          key: 'skipCount',
          width: 120,
          align: 'right'
        }
        ],
        columnsFilter: [{
          title: '日期',
          key: 'dataDate',
          fixed: 'left',
          render (h, p) {
            return h('div', {}, Manba(p.row.dataDate).format())
          },
          width: 120
        },
        {
          title: '小时',
          key: 'dataHour',
          width: 100,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '用户',
          key: 'userCompanyName',
          width: 120
        },
          // {
          //     title: '公司主体',
          //     key: 'companyName',
          //     width: 120
          // },
        {
          title: '组名称',
          key: 'groupName',
          width: 200,
          render (h, params) {
            return [h('div', {}, params.row.groupId && ('(ID:' + params.row.groupId + ')' + params.row.groupName))]
          }
        },
        {
          title: '计划名称',
          key: 'planName',
          width: 200,
          render (h, params) {
            return [h('div', {}, params.row.planId && ('(ID:' + params.row.planId + ')' + params.row.planName))]
          }

        },
        {
          title: '创意名称',
          key: 'ideaName',
          width: 200,
          render (h, params) {
            return [h('div', {}, params.row.ideaId && ('(ID:' + params.row.ideaId + ')' + params.row.ideaName))]
          }
        },
          // {
          //     title: '渠道',
          //     key: 'channelName',
          //     width: 200
          // },
        {
          title: '应用',
          key: 'appName',
          width: 200
        },
        {
          title: '广告位',
          key: 'slotName',
          width: 200,
          render (h, params) {
            return [h('div', {}, params.row.slotCode && ('(ID:' + params.row.slotCode + ') ' + params.row.slotName))]
          }
        }

        ],
        data: []
      }

    }
  },
  mounted () {
    getGroupAll().then(res => {
      if (res.data.ok) {
        this.groupList = res.data.data.list
      }
    })
    getPlanAll().then(res => {
      if (res.data.ok) {
        this.planList = res.data.data.list
      }
    })
    getIdeaAll().then(res => {
      if (res.data.ok) {
        this.ideaList = res.data.data.list
      }
    })
    getCompanyAll().then(res => {
      if (res.data.ok) {
        this.companyList = res.data.data
      }
    })
    getUserAll().then(res => {
      if (res.data.ok) {
        this.userList = res.data.data.list
      }
    })
    getAppAll().then(res => {
      if (res.data.ok) {
        this.appList = res.data.data.list
      }
    })
    getCodeAll().then(res => {
      if (res.data.ok) {
        this.codeList = res.data.data.list
      }
    })
    this.search()
  },
  methods: {
    changeGroup () {
      // 分组切换
      // this.getList()
    },
    changeDateStart (date) {
      this.formSearch.queryStartTime = date
    },
    changeDateEnd (date) {
      this.formSearch.queryEndTime = date
    },
    filterCol () {
      let showCol = []
      this.formSearch.groupBy.forEach(item => {
        let arr = this.tableData.filterKey[item]
        this.tableData.columnsFilter.forEach(item => {
          if (arr.indexOf(item.key) !== -1) {
            showCol.push(item)
          }
        })
      })
      this.tableData.columns = showCol.concat(this.tableData.commonCol)
    },
    getList (page) {
      let data = {
        ...this.formSearch
      }
      data.groupBy = data.groupBy.join(',')
      this.tableData.loading = true
      reportApi.hourData(data).then(resp => {
        this.tableData.loading = false
        if (resp.data.ok) {
          this.tableData.data = resp.data.data
          this.pageData.total = resp.data.data.total
          this.filterCol()
        }
      })
    },
    search (page) {
      this.getList(page)
    }

  },
  computed: {}
}
</script>
