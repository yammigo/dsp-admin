<style lang="less">
    @import './access.less';
</style>

<template>
    <div class="access">
        <Row>
            <!-- <Col span="4">
                <label class="label_txt">角色名：<Input placeholder="" style="width: 60%;"></Input></label>
            </Col> -->
            <Col span="4">
                <!-- <Button type="primary">查询</Button> -->
                <!-- <Button type="primary" class="margin-left-10">重置</Button> -->
                <Button type="primary" class="margin-left-20" @click="addNewRole">新增</Button>
            </Col>
        </Row>
        <Table class="margin-top-20" border :columns="roleConfig" :data="roleList"></Table>
        <div class="page_wrap">
            <Page :total="roleTotal" :page-size="pageSize" show-total @on-change="changePage"></Page>
        </div>
        <Spin size="large" fix v-show="spinShow"></Spin>
        <!--编辑/添加角色-->
        <Modal
            v-model="editModal"
            :title="modalTitle"
            :mask-closable="false"
            @on-ok="editInfoOk"
            ok-text="保存">
            <Row class="margin-top-10">
                <Col span="4"><span class="label_txt">角色名称：</span></Col>
                <Col span="8">
                    <Input v-model="newName"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4"><span class="label_txt">角色描述：</span></Col>
                <Col span="16">
                    <Input v-model="newType" type="textarea" :autosize="{minRows: 3,maxRows: 8}"></Input>
                </Col>
            </Row>
        </Modal>
        <!--分配权限-->
        <Modal
            v-model="setAccessModal"
            title="分配权限"
            :mask-closable="false"
            width="800"
            ok-text="保存">
            <Row class="set_access_main">
                <Tree class="menu_tree" :data="menuList" show-checkbox ref="tree"></Tree>
            </Row>
            <div slot="footer">
                <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="setAccessCancel"><span>关闭</span></button>
                <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="setAccessOk"><span>保存</span></button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
  name: 'roleManage',
  data () {
    return {
      roleInfo: {}, // 角色信息
      newName: '', // 新名
      newType: '', // 新描述
      modalTitle: '修改角色',
      editModal: false,
      setAccessModal: false,
      addRoleName: '',
      editModalTitle: '编辑角色',
      roleTotal: 0,
      roleList: [],
      menuList: [],
      curRoleId: '',
      pageNum: 1,
      pageSize: 20,
      rolePermissionList: [],
      spinShow: true,
      roleConfig: [
        {
          title: '角色名',
          align: 'center',
          key: 'name',
          width: 300
        },
        {
          title: '角色描述',
          align: 'center',
          key: 'type'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.editInfo(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.setAccess(params.row.id)
                  }
                }
              }, '分配权限'),
              h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.deleteUser(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList () {
      let self = this
      this.axios.post('/role/list.do', {
        page: this.pageNum,
        limit: this.pageSize,
        data: {}
      }).then(rt => {
        self.spinShow = false
        if (rt.code == 0) {
          self.roleTotal = rt.data.total
          self.roleList = rt.data.list
        }
      })
    },
    editInfo (idx) {
      this.editModal = true
      this.addRoleSign = false
      this.roleInfo = this.roleList[idx]
      this.newName = this.roleInfo.name
      this.newType = this.roleInfo.type
    },
    modifyPwd (id) {
      this.modifyPwdModal = true
    },
    deleteUser (id) {
      var self = this
      this.$Modal.confirm({
        content: '确定要删除吗？',
        onOk: function () {
          self.axios.post('/role/deleteRole.do', {
            ids: id
          }).then(rt => {
            if (rt.code == 0) {
              self.$Message.success(rt.msg)
              self.getRoleList()
            }
          })
        }
      })
    },
    editInfoOk () {
      let self = this
      let params = {
        id: this.roleInfo.id,
        name: this.newName,
        type: this.newType
      }
      let url = '/role/updateRole.do'
      // 添加
      if (this.addRoleSign) {
        params = {
          name: this.newName,
          type: this.newType
        }
        url = '/role/addRole.do'
      }
      this.axios.post(url, params).then(rt => {
        if (rt.code == 0) {
          if (self.addRoleSign) {
            self.getRoleList()
          } else {
            self.roleInfo.name = self.newName
            self.roleInfo.type = self.newType
          }
          self.$Message.success(rt.msg)
        }
      })
    },
    addNewRole () {
      this.modalTitle = '添加角色'
      this.editModal = true
      this.addRoleSign = true
      this.newName = ''
      this.newType = ''
    },
    setAccess (id) {
      this.menuList = []
      this.getRolePermission(id)
      this.curRoleId = id
    },
    setAccessOk () {
      let self = this
      let selAccessList = this.$refs.tree.getCheckedNodes()
      let list = []
      selAccessList.forEach(function (item) {
        list.push(item.item.id)
      })
      this.axios.post('/role/assignPermissions2Role.do', {
        roleId: self.curRoleId,
        menuIds: list.join()
      }).then(rt => {
        if (rt.code == 0) {
          self.$Message.success(rt.msg)
          this.setAccessModal = false
        }
      })
    },
    setAccessCancel () {
      this.setAccessModal = false
    },
    // 获取当前角色拥有权限
    getRolePermission (id) {
      let self = this
      this.axios.post('/role/getRoleMenuIdSets.do', { roleId: id }).then(rt => {
        if (rt.code == 0) {
          this.setAccessModal = true
          self.rolePermissionList = rt.data
          this.getAllMenuList()
        }
      })
    },
    // 获取所有菜单
    getAllMenuList () {
      let self = this
      this.menuList = []
      this.axios.post('/menu/getAllMenu.do').then(rt => {
        if (rt.code == 0) {
          let menuArr = rt.data
          menuArr.forEach(function (item) {
            let menuConfig = {
              title: item.name,
              item: item
              // checked: self.checkHasPromission(item.id)
            }
            if (item.children && item.children.length) {
              let childrenMeun = self.getChildrenMenu(item.children)
              menuConfig.children = childrenMeun
            }
            self.menuList.push(menuConfig)
          })
        }
      })
    },
    // 获取子菜单
    getChildrenMenu (data) {
      let self = this
      let childrenList = []
      data.forEach(function (item) {
        if (item.children && item.children.length) {
          let list = self.getChildrenMenu(item.children)
          childrenList.push({ title: item.name, item: item, children: list })
        } else {
          childrenList.push({ title: item.name, checked: self.checkHasPromission(item.id), item: item })
        }
      })
      return childrenList
    },
    // 是否有权限
    checkHasPromission (id) {
      let flag = false
      if (this.rolePermissionList.indexOf(id) != -1) {
        flag = true
      }
      return flag
    },
    // 改变页码
    changePage (pageNum) {
      this.pageNum = pageNum
      this.getRoleList()
    }

  }
}
</script>
