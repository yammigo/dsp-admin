<style lang="less">
@import './login.less';
</style>

<template>
<div class="login">
    <div class="login-con">
        <Card icon="log-in" title="欢迎登录" :bordered="false">
            <div class="form-con">
                <login-form @on-success-valid="handleSubmit"></login-form>
                <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
            </div>
        </Card>
    </div>
</div>
</template>

<script>
import LoginForm from '_c/login-form'
import {
  mapActions,
  mapMutations
} from 'vuex'
import {
  setNewMenuList
} from '@/libs/util'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    ...mapMutations([
      'setUserName',
      'setToken',
      'setMenuData'
    ]),
    handleSubmit ({
      username,
      pswd,
      rememberMe
    }) {
      this.handleLogin({
        username,
        pswd,
        rememberMe
      }).then(res => {
        if (res.code == 0) {
          this.setUserName(username)
          this.setToken(res.data.token)
          this.setMenuData(res.data.menus)
          Utils.saveCookie('userName', username)
          this.$router.push({
            name: this.$config.homeName
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
