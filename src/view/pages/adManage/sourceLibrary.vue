<style lang='less'>
</style>
<template>
<div>
    <Card dis-hover shadow :bordered="false">
        <div slot="title">
            <Form ref="formSearch" :model="formSearch" inline>
                <FormItem prop="userId">
                    <Select v-model="formSearch.userId" placeholder="用户" clearable style="width:200px;">
                        <Option :value="item.id+''" v-for="(item,index) in userList" :key="index">{{item.loginName}}</Option>
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
            <!-- <div class="table_setting" style="margin-bottom:10px;"><Button type="primary" icon="md-add" @click="modalData.type='add';modalData.show = true;">创建用户</Button></div> -->
            <div class="data_table">
                <Table size='small' :loading="tableData.loading" border :columns="tableData.columns" :data="tableData.data"></Table>
            </div>
            <div class="table_page" style="margin-top:10px;">
                <Page :total="pageData.total" :page-size="pageData.limit" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-total show-sizer />
            </div>

        </div>

    </Card>
    <Modal v-model="modalData.show" width="400" title=" " :mask-closable="false" :closable="true">
        <video controls v-if="imgViewSrc.adType==5&&modalData.show" :src="imgViewSrc.url" width="100%"></video>
        <img v-else :src="imgViewSrc.url" width="100%">
        <div slot="footer">

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
  libraryApi
} from './api'
import {
  getUserList
} from '../users/api'

export default {
  name: 'sourceLibrary',
  mixins: [status, config],
  data () {
    return {
      imgViewSrc: '',
      companyList: [],
      userList: [],
      formSearch: {

      },
      formData: {

      },
      ruleValidate: {

        email: [{
          required: true,
          message: '请填写邮箱',
          trigger: 'blur'

        }]

      },
      tableH: 500,
      tableData: {
        loading: false,
        columns: [{
          title: '素材',
          render: (h, params) => {
            if (params.row.adType == 5) {
              return h('video', {
                attrs: {
                  src: params.row.libraryUrl
                },
                style: {
                  height: '60px'
                },
                on: {
                  click: () => {
                    this.imgViewSrc = {
                      url: params.row.libraryUrl,
                      adType: params.row.adType
                    }
                    this.modalData.show = true
                  }
                }
              })
            } else {
              return h('img', {
                attrs: {
                  src: params.row.libraryUrl
                },
                style: {
                  height: '60px'
                },
                on: {
                  click: () => {
                    this.imgViewSrc = {
                      url: params.row.libraryUrl,
                      adType: params.row.adType
                    }
                    this.modalData.show = true
                  }
                }
              })
            }
          },
          width: 400
        },
        {
          title: '广告类型',
          key: 'adTypeName',
          width: 100
        },
        {
          title: '广告样式',
          key: 'adTypeStyleName',
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
                    this.$Modal.confirm({
                      title: '你确定要删除该素材吗',
                      loading: true,
                      onOk: () => {
                        libraryApi.deleteLibrary({
                          id: params.row.id
                        }).then((res) => {
                          if (res.data.ok) {
                            this.$Message.success('删除成功')
                            this.search()
                            this.$Modal.remove()
                          }
                        })
                      },
                      onCancel: () => {

                      }
                    })
                  }
                }

              }, '删除')

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
    this.search(1)
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
      libraryApi.getLibrary(data).then(resp => {
        this.tableData.loading = false
        if (resp.data.ok) {
          this.tableData.data = resp.data.data.list
          this.pageData.total = resp.data.data.total
        }
      })
    },
    search (page) {
      this.getList(page)
    }
  },
  computed: {

  },
  watch: {

  }
}
</script>
