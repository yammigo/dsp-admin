<style lang="less">
    @import './access.less';
</style>

<template>
    <div class="access">
        <Row class="margin-left-10 menu_operatebtn_list">
            <Col span="20">
                <Button type="primary" @click="addMenu">添加菜单</Button>
                <Button type="primary" class="margin-left-10" @click="modifyMenu">修改</Button>
                <Button type="primary" class="margin-left-10" @click="deleteMenu">删除</Button>
            </Col>
        </Row>
        <Row class="margin-left-10">
            <Col span="20">
                <Tree :data="menuList" class="menu_tree" ref="tree"></Tree>
            </Col>
        </Row>
        <Spin size="large" fix v-show="spinShow"></Spin>
        <!--添加/修改菜单-->
        <Modal
            v-model="modifyMenuModal"
            :title="modalTitle"
            :mask-closable="false"
            @on-ok="modifyMenuOk">
            <Row>
                <Col span="4"><span class="label_txt">名称：</span></Col>
                <Col span="10">
                    <Input v-model="menuInfo.name"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4"><span class="label_txt">类型：</span></Col>
                <Col span="10">
                    <RadioGroup v-model="menuInfo.type" class="label_txt">
                        <Radio label="1">菜单</Radio>
                        <Radio label="2">权限</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="margin-top-10" v-show="menuInfo.type == 2">
                <Col span="4"><span class="label_txt">接口地址：</span></Col>
                <Col span="18">
                    <Input v-model="menuInfo.authCode"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10" v-show="menuInfo.type != 2">
                <Col span="4"><span class="label_txt">路由：</span></Col>
                <Col span="10">
                    <Input v-model="menuInfo.link"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10" v-show="menuInfo.type != 2">
                <Col span="4"><span class="label_txt">图标：</span></Col>
                <Col span="10">
                    <Input v-model="menuInfo.icon"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4"><span class="label_txt">父菜单：</span></Col>
                <Col span="10">
                    <Input v-model="menuInfo.parentId"></Input>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="4"><span class="label_txt">排序：</span></Col>
                <Col span="10">
                    <Input v-model="menuInfo.sort"></Input>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
export default {
  name: 'menuManage',
  data () {
    return {
      menuList: [],
      modifyMenuModal: false,
      menuInfo: {},
      addMenuSign: false, // 是否添加菜单
      modalTitle: '修改菜单',
      spinShow: true
    }
  },
  created () {
    this.getAllMenuList()
  },
  methods: {
    // 添加菜单
    addMenu () {
      this.addMenuSign = true
      this.menuInfo = {
        type: '1',
        icon: 'android-list'
      }
      this.modalTitle = '添加菜单'
      this.modifyMenuModal = true
      let selMenuList = this.$refs.tree.getSelectedNodes()
      if (selMenuList.length) {
        this.menuInfo.parentId = selMenuList[0].item.id
      }
    },
    // 修改菜单
    modifyMenu () {
      this.addMenuSign = false
      this.modalTitle = '修改菜单'
      let selMenuList = this.$refs.tree.getSelectedNodes()
      if (!selMenuList.length) {
        this.$Message.error('请先选中要修改菜单')
        return
      }
      if (selMenuList[0].item) {
        this.modifyMenuModal = true
        this.menuInfo = selMenuList[0].item
        this.menuInfo.type += ''
      } else {
        this.$Message.error('此菜单无法修改')
      }
    },
    // 删除菜单
    deleteMenu () {
      let self = this
      let selMenuList = this.$refs.tree.getSelectedNodes()
      if (!selMenuList.length) {
        this.$Message.error('请先选择要删除菜单')
        return
      }
      this.$Modal.confirm({
        content: '确定要删除吗？',
        onOk: function () {
          let selMenu = selMenuList[0].item
          self.axios.post('/menu/delete.do', { ids: selMenu.id }).then(rt => {
            if (rt.code == 0) {
              self.$Message.success(rt.msg)
              self.getAllMenuList()
            }
          })
        }
      })
    },
    // 添加、修改确认
    modifyMenuOk () {
      let self = this
      let url = '/menu/update.do'
      if (this.addMenuSign) {
        url = '/menu/add.do'
      }
      this.addMenuSign = false
      this.axios.post(url, this.menuInfo).then(rt => {
        if (rt.code == 0) {
          self.$Message.success(rt.msg)
          self.getAllMenuList()
        }
      })
    },
    // 获取所有菜单
    getAllMenuList () {
      let self = this
      self.menuList = []
      this.axios.post('/menu/getAllMenu.do').then(rt => {
        self.spinShow = false
        if (rt.code == 0) {
          let menuArr = rt.data
          menuArr.forEach(function (item) {
            let menuConfig = {
              title: item.name,
              // expand: true,
              item: item
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
          childrenList.push({ title: item.name, item: item })
        }
      })

      return childrenList
    }
    // 更新拥有的菜单权限(左侧菜单)
    /* updateMyMeun(){

        } */
  }
}
</script>

<style>

</style>
