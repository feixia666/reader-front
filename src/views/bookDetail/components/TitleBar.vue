<template>
  <transition name="slide-down">
    <div class="title-wrapper"
      v-show="ifTitleAndMenuShow">
      <div class="left">
        <span class="iconfont icon icon-arrow-lift"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="iconfont icon icon-cart-Empty"></span>
        </div>
        <div class="icon-wrapper">
          <span class="iconfont icon icon-bussiness-man"></span>
        </div>
        <div class="icon-wrapper">
          <span class="iconfont icon icon-ellipsis"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    ifTitleAndMenuShow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import './global.scss';
.title-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 101;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);
  display: flex;
  .left {
    flex: 0 0 px2rem(60);
    @include center;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .icon-wrapper {
      flex: 0 0 px2rem(40);
      @include center;
    }
  }
}
</style>