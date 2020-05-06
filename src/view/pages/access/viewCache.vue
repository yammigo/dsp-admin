
<template>
  <div class="content_main">
    <Row class='margin-top-10'>
    	<span class="label_txt">模块列表：</span>
        <Select clearable style="width:150px" v-model="formData.sysCode">
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
        <Col span="11" class="margin-top-20">
          <Input :rows="20" type="textarea" :value="resulstData"></Input>
        </Col>
        <Button type="primary" class="margin-left-20" @click="getDataList">执行</Button>
        <Button type="primary" class="margin-left-20" @click="resetSearch">重置</Button>
    </Row>
  </div>
</template>
<script>
export default{
  name: 'viewCache',
  data () {
    return {
      formData: {},
      moduleList: {},
      methodList: [],
      resulstData: ''
    }
  },
  created () {
    this.getModuleList()
  },
  methods: {
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
          this.resulstData = rt.data
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
