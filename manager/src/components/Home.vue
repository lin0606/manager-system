
<template>
  <div class="container">
    <div :class="['nav-side',isCollapase?'fold':'unfold']">
      <el-menu
        default-active="2"
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        :collapse="false"
        router
      >
        <tree-menu :userMenu="userMenu"></tree-menu>
        <!-- <el-sub-menu index="2">
          <template #title>
            <i class="el-icon-setting"></i>
            <span>审批管理</span>
          </template>
            <el-menu-item index="2-1">休假管理</el-menu-item>
            <el-menu-item index="2-2">待我管理</el-menu-item>
        </el-sub-menu>  -->
      </el-menu>
    </div>
    <div :class="['content-right',isCollapase?'fold':'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <fold class="menu-fold" @click="toggle"></fold>
          <div class="bread">
            <bread-curb></bread-curb>
          </div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount>0 ? true:false" class="user-badge">
            <el-icon class="el-icon-bell">
              <bell></bell>
            </el-icon>
            </el-badge> 
            <el-dropdown @command="handleLogout">
              <span class="user-link">
                {{userInfo.userName}}
                <el-icon class="el-icon--right">
                  <arrow-down></arrow-down>  
                </el-icon>  
              </span> 
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>邮箱:{{userInfo.userEmail}}</el-dropdown-item>
                  <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>  
            </el-dropdown> 
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from "./TreeMenu.vue";
import breadcrumb from "./Breadcrumb.vue"
import {Setting,Fold,Bell,ArrowDown} from '@element-plus/icons'
export default {
  name: "home",
  components:{
    setting:Setting,
    fold:Fold,
    bell:Bell, 
    arrowDown: ArrowDown,
    TreeMenu,
    breadcrumb,
  },
  data(){
    return {
      userInfo:this.$store.state.userInfo,
      userMenu:[],
      isCollapase:false,
      noticeCount:0
    }
  },
  mounted(){
    this.getNoticeCount()
  },
  methods:{
    handleLogout(key){
      console.log(key);
      if(key == "email") return;
      this.$store.commit('saveUserInfo',"");
      this.userInfo = null
      this.$router.push('/login')
    },
    toggle(){
      this.isCollapase = !this.isCollapase
    },
    async getNoticeCount(){
      const res = await this.$api.noticeCount()
      this.noticeCount = res;
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
  // 菜单
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    // overflow-y: auto;
    transition: width 0.5s;
    .nav-menu{
      .menu-setting{
        width: 20px;
        height: 32px;
        margin-right: 12px;
      }
      border-right: none;
      height: calc(100vh - 50px);
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left{
        display: flex;
        align-items: center;
        z-index: 10;
        .menu-fold{
          width: 20px;
          height: 20px;
          margin-right: 15px;
        }
      }
      .user-info{
        .user-badge{
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link{
          cursor: pointer;
          color: #6280ca;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        height: 100%;
        background-color: #fff;
      }
    }
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
  }
}
</style>
