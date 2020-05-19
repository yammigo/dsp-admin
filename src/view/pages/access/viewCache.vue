<template>
<div class="content_main">
    <Row class='margin-top-10'>
        <span class="label_txt">模块列表：</span>
        <Select clearable style="width:150px" v-model="formData.sysCode" @on-change="getKeysList">
            <Option v-for="item in moduleList" :value="item.code" :key="item.code">{{item.name}}</Option>
        </Select>
        <span class="label_txt margin-left-20">KEY值：</span>
        <Input style="width:150px" v-model="formData.key" placeholder="请先选择模块" @on-blur="getKeyList"></Input>
        <span class="label_txt margin-left-20">方法：</span>
        <Select clearable style="width:150px" v-model="formData.operaCode" placeholder="请先填写KEY值">
            <Option v-for="item in methodList" :value="item.code" :key="item.code">{{item.name}}</Option>
        </Select>
        <span class="label_txt margin-left-20">param1：</span>
        <Input style="width:150px" v-model="formData.param1"></Input>
        <span class="label_txt margin-left-20">param2：</span>
        <Input style="width:150px" v-model="formData.param2"></Input>
        <Button type="primary" style="margin-right:20px;margin-left:20px;" @click="getDataList">执行</Button>
        <Button type="primary" @click="resetSearch">重置</Button>
        <Row>
            <Col span="11" style="margin-top:20px;">
            <div style="height:400px;overfow:auto;border:solid 1px #eee;background:#fff;">
                <div v-for="(item,index) in keyList" :key="index" class="keyListItem" @click="setKey(item.key)">{{item.name}}</div>
            </div>
            </Col>
            <Col span="11" style="margin-top:20px;">
            <!-- <Input :rows="20" type="textarea" :value="resulstData"></Input> -->
            <div style="height:400px;overfow:auto;border:solid 1px #eee;background:#fff;">
                <json-view v-if="resulstData" :data="resulstData" />
            </div>

            </Col>
        </Row>

        <!-- <json-view :data="json"/> -->
    </Row>
</div>
</template>

<script>
import jsonView from 'vue-json-views'
export default {
  name: 'viewCache',
  components: {
    jsonView
  },
  data () {
    return {
      json: {
        name: 'fanjiantao',
        age: 25
      },
      formData: {},
      moduleList: {},
      methodList: [],
      resulstData: '',
      keyList: []
    }
  },
  created () {
    this.getModuleList()
  },
  methods: {
    setKey (key) {
      this.$set(this.formData, 'key', key)
    },
    getKeysList (data) {
      this.$set(this.formData, 'key', '')
      if (data) {
        this.axios.post('/cache/private/keys.do', {
          sysCode: data
        }).then(rt => {
          if (rt.code == 0) {
            this.keyList = rt.data
          }
        })
      } else {
        this.keyList = []
      }
    },
    // 获取模块列表
    getModuleList () {
      this.axios.post('/cache/private/modules.do', {}).then(rt => { // 获取模块列表
        if (rt.code == 0) {
          this.moduleList = rt.data.list
        }
      })
    },
    // 检测KEY
    getKeyList () {
      if (this.formData.sysCode && this.formData.key) {
        this.axios.post('/cache/private/getMethods.do', {
          sysCode: this.formData.sysCode,
          key: this.formData.key
        }).then(rt => {
          if (rt.code == 0) {
            this.methodList = rt.data.list
          }
        })
      }
    },
    // 获取缓存数据
    getDataList () {
      this.axios.post('/cache/private/execute.do', this.formData).then(rt => {
        if (rt.code == 0) {
          try {
            this.resulstData = JSON.parse(rt.data)
          } catch (error) {
            this.resulstData = rt.data
          }

          this.$Message.success(rt.msg)
        }
      })
    },
    // 重置
    resetSearch () {
      this.formData = {}
      this.methodList = {}
    }
  }
}
</script>

<style lang="less">
.keyListItem {
    cursor: pointer;
    padding: 10px;
}

.keyListItem:hover {
    background: #eee;
}
</style>
