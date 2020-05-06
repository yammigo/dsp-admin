import Main from '@/components/main'
export default [
  {
    path: '/access',
    name: 'access',
    meta: {
      icon: 'md-menu',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'sysUserManage',
        meta: {
          title: '系统用户管理'
        },
        component: () => import('@/view/pages/access/userManage.vue')
      },
      {
        path: 'role',
        name: 'roleManage',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/view/pages/access/roleManage.vue')
      },
      {
        path: 'menu',
        name: 'menuManage',
        meta: {
          title: '菜单管理'
        },
        component: () => import('@/view/pages/access/menuManage.vue')
      },
      {
        path: 'cache',
        name: 'viewCache',
        meta: {
          title: '查看缓存'
        },
        component: () => import('@/view/pages/access/viewCache.vue')
      },
      {
        path: 'tsask',
        name: 'timedTask',
        meta: {
          title: '定时任务'
        },
        component: () => import('@/view/pages/access/timedTask.vue')
      },
      {
        path: 'sysConfig',
        name: 'sysConfig',
        meta: {
          title: '系统参数配置'
        },
        component: () => import('@/view/pages/access/sysConfig.vue')
      }
    ]

  },
  {
    path: '/sms',
    name: 'sms',
    meta: {
      icon: 'md-menu',
      title: '短信管理'
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'smsList',
        meta: {
          title: '短信记录'
        },
        component: () => import('@/view/pages/sms/smsList.vue')
      },
      {
        path: 'channel',
        name: 'smsChannel',
        meta: {
          title: '短信通道'
        },
        component: () => import('@/view/pages/sms/smsChannel.vue')
      },
      {
        path: 'warning',
        name: 'warningManage',
        meta: {
          title: '报警组'
        },
        component: () => import('@/view/pages/sms/warningManage.vue')
      }
    ]

  },
  {
    path: '/users',
    name: 'users',
    meta: {
      icon: 'md-menu',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'usersManage',
        name: 'usersManage_page',
        meta: {
          icon: 'md-menu',
          title: '广告主列表'
        },
        component: () => import('@/view/pages/users/usersManage.vue')
      },
      {
        path: 'recharge',
        name: 'recharge_page',
        meta: {
          icon: 'md-menu',
          title: '充值'
        },
        component: () => import('@/view/pages/users/recharge.vue')
      }
    ]

  },
  {
    path: '/adManage',
    name: 'adManage',
    meta: {
      icon: 'md-menu',
      title: '广告管理'
    },
    component: Main,
    children: [
      {
        path: 'adGroup',
        name: 'adGroup',
        meta: {
          icon: 'md-menu',
          title: '广告组'
        },
        component: () => import('@/view/pages/adManage/adGroup.vue')
      },
      {
        path: 'adPlan',
        name: 'adPlan',
        meta: {
          icon: 'md-menu',
          title: '广告计划'
        },
        component: () => import('@/view/pages/adManage/adPlan.vue')
      },
      {
        path: 'adOriginality',
        name: 'adOriginality',
        meta: {
          icon: 'md-menu',
          title: '广告创意'
        },
        component: () => import('@/view/pages/adManage/adOriginality.vue')
      },
      {
        path: 'sourceLibrary',
        name: 'sourceLibrary',
        meta: {
          icon: 'md-menu',
          title: '素材库'
        },
        component: () => import('@/view/pages/adManage/sourceLibrary.vue')
      }

    ]

  },
  {
    path: '/channelManage',
    name: 'channelManage',
    meta: {
      icon: 'md-menu',
      title: '渠道管理'
    },
    component: Main,
    children: [
      {
        path: 'channelApp',
        name: 'channelApp',
        meta: {
          icon: 'md-menu',
          title: '应用'
        },
        component: () => import('@/view/pages/channel/channelApp.vue')
      },
      {
        path: 'channelSlot',
        name: 'channelSlot',
        meta: {
          icon: 'md-menu',
          title: '广告位'
        },
        component: () => import('@/view/pages/channel/channelSlot.vue')
      },
      {
        path: 'channelSlotRule',
        name: 'channelSlotRule',
        meta: {
          icon: 'md-rule',
          title: '广告位策略'
        },
        component: () => import('@/view/pages/channel/channelSlotRule.vue')
      }

    ]

  },
  {
    path: '/report',
    name: 'report',
    meta: {
      icon: 'md-menu',
      title: '报表'
    },
    component: Main,
    children: [
      {
        path: 'Advertiser',
        name: 'Advertiser',
        meta: {
          icon: 'md-menu',
          title: '应用'
        },
        component: () => import('@/view/pages/report/Advertiser.vue')
      },
      {
        path: 'AdChannel',
        name: 'AdChannel',
        meta: {
          icon: 'md-menu',
          title: '渠道日报'
        },
        component: () => import('@/view/pages/report/AdChannel.vue')
      },
      {
        path: 'hourData',
        name: 'hourData',
        meta: {
          icon: 'md-menu',
          title: '渠道日报'
        },
        component: () => import('@/view/pages/report/hourData.vue')
      }

    ]

  }
]
