<style lang='less'>
</style>
<template>
<div>
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <FormItem>
                    <DatePicker v-model="formSearch.queryStartTime" type="date" placeholder="开始日期" @on-change="changeDateStart" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem>
                    -
                </FormItem>
                <FormItem>
                    <DatePicker v-model="formSearch.queryEndTime" type="date" placeholder="结束日期" @on-change="changeDateEnd" style="width: 200px"></DatePicker>
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
                <div>
                    <FormItem prop="groupBy">
                        <label>分组查询</label>
                        <CheckboxGroup v-model="formSearch.groupBy" @on-change="changeGroup">
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
                        </CheckboxGroup>
                    </FormItem>
                </div>

            </Form>
        </div>
        <div class="tableBox">
            <!-- <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">创建广告位</Button></div> -->
            <div class="data_table">
                <Table size='small' :loading="tableData.loading" border :columns="tableData.columns" :data="tableData.data"></Table>
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
  getAppAll,
  getCodeAll
} from '@/api/common'
import {
  reportApi
} from './api'
export default {
  name: 'AdChannel',
  mixins: [config],
  data () {
    return {
      appList: [],
      codeList: [],
      formSearch: {
        queryStartTime: Manba().format(),
        queryEndTime: Manba().format(),
        groupBy: ['dataDate', 'channelId', 'appId', 'slotId']
      },
      formData: {

      },
      ruleValidate: {

      },
      tableH: false,
      tableData: {
        loading: false,
        filterKey: {
          dataDate: ['dataDate'],
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
          key: 'installStartCount',
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
          width: 200
        },
        {
          title: '渠道',
          key: 'channelName',
          width: 200
        },
        {
          title: '应用',
          key: 'appName',
          width: 200
        },
        {
          title: '广告位',
          key: 'slotName',
          width: 200
          // render(h,params) {
          //     return [h("div",{},params.row.slotCode)]
          // },
        }

        ],
        data: []
      }

    }
  },
  mounted () {
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
      this.getList()
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
      reportApi.adChannel(data).then(resp => {
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
