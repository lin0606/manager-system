<script></script>

<template>
  <div class="welcome">
    <div class="content"> 
      <div class="sub-title">欢迎体验</div>
      <div class="title">内部管理系统</div>
      <div class="desc">小李的管理系统啦啦啦啦啦啦啦啦啦~</div>
    </div>
    <div class="img"></div>
  </div>
  
</template>

<style scoped lang="scss">
.welcome{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .content{
    position: relative;
    bottom: 90px;
    .sub-title{
      font-size:30px;
      line-height:42px;
      color:#333;
    }
    .title{
      font-size:40px;
      line-height: 62px;
      color:#409eff;
    }
    .desc{
      text-align: right;
      font-size:14px;
      color: #999;
    }
  }
}
</style>
