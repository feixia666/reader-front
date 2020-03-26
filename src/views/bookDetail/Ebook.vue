<template>
  <div class="ebook">
    <div class="content-main"
      ref="main">
      <!-- 显示目录时的遮罩层 -->
      <div class="content-mask"
        v-show="setMenu"
        @click="showMenu"></div>
      <div class="read-wrapper"
        ref="contain">
        <!-- 电子书主体 begin -->
        <div id="read"
          ref="read"
          @click="clickRead"></div>
        <!-- 电子书主体 end -->

        <!-- 翻页按钮 begin -->
        <div class="left btn"
          @click="prevPage">
          <i class="el-icon-arrow-left" />
        </div>
        <div class="right btn"
          @click="nextPage">
          <i class="el-icon-arrow-right" />
        </div>
        <!-- 翻页按钮end -->
        <!-- 右边工具栏 -->
        <div class="toolBar">
          <ul>
            <li>
              <i class="el-icon-s-operation"
                @click="showMenu"></i>
            </li>
            <li>
              <i class="el-icon-setting"
                @click="showFont"></i>
            </li>
            <li>
              <i class="el-icon-view"
                @click="setTheme"></i>
            </li>
            <!-- <li>
              <i class="el-icon-location-outline"></i>
            </li> -->
          </ul>
          <div class="fontsize"
            v-if="setFont">
            <div class="setting-font-size">
              <div class="preview"
                :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
              <div class="select">
                <div class="select-wrapper"
                  v-for="(item,index) in fontSizeList"
                  @click="setFontSize(item.fontSize)"
                  :key="index">
                  <div class="line"></div>
                  <div class="point-wrapper">
                    <div class="point"
                      v-show="defaultFontSize === item.fontSize">
                      <div class="small-point"></div>
                    </div>
                  </div>
                  <div class="line"></div>
                </div>
              </div>
              <div class="preview"
                :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
            </div>
          </div>
          <div class="menu"
            v-if="setMenu">
            <div class="content-item"
              v-for="(item, index) in navigation.toc"
              :key="index"
              @click="jumpTo(item.href)">
              <span class="text">{{item.label}}</span>
            </div>
            <div class="empty"
              v-if="!bookAvailable">加载中...</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Epub from 'epubjs'
export default {
  name: 'ebook',
  data() {
    return {
      ifTitleAndMenuShow: false,
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ],
      DOWNLOAD_URL: 'http://localhost:8089/upload-ebook/book/',
      defaultFontSize: 16,
      themes: '',
      setFont: false,
      setMenu: false,
      themeList: [
        {
          name: 'default',
          style: {
            body: {
              color: '#000',
              background: '#fff'
            }
          }
        },
        {
          name: 'night',
          style: {
            body: {
              color: '#fff',
              background: '#000'
            }
          }
        }
      ],
      defaultTheme: false,
      bookAvailable: false,
      locations: null,
      navigation: null,
      bookpath: ''
    }
  },
  mounted() {
    this.bookpath = this.DOWNLOAD_URL + this.$route.params.fileName + '.epub'
    this.showEpub()
  },
  methods: {
    // 解析电子书
    showEpub() {
      this.book = new Epub(this.bookpath)
      this.rendition = this.book.renderTo('read', {
        width: 500,
        height: 650
      })
      this.rendition.display()
      this.themes = this.rendition.themes
      this.setFontSize(this.defaultFontSize)
      this.registerTheme()
      this.setTheme(this.defaultTheme)
      this.book.ready.then(() => {
        this.navigation = this.book.navigation
        return this.book.locations.generate().then(res => {
          this.locations = this.book.locations
          this.bookAvailable = true
        })
      })
    },
    // 上一页
    prevPage() {
      if (this.rendition) {
        this.rendition.prev()
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next()
      }
    },
    clickRead() {
      console.log(this.$refs.read)
    },
    // 展示选择字体
    showFont() {
      this.setFont = !this.setFont
    },
    // 展示菜单
    showMenu() {
      this.setMenu = !this.setMenu
    },
    // 设置字体大小
    setFontSize(fontSize) {
      this.themes.fontSize(fontSize + 'px')
      this.defaultFontSize = fontSize
    },
    // 给主题设置样式
    registerTheme() {
      this.themeList.forEach(item => {
        this.themes.register(item.name, item.style)
      })
    },
    // 点击设置主题
    setTheme() {
      this.defaultTheme = !this.defaultTheme
      if (this.defaultTheme) {
        this.themes.select('default')
        console.log(this.$refs)
        this.$refs.main.style.background = 'white'
      } else {
        this.themes.select('night')
        this.$refs.main.style.background = 'black'
      }
    },
    // 目录跳转章节
    jumpTo(href) {
      this.rendition.display(href)
      this.showMenu()
    }
    // onProgressChange(progress) {
    //   const percentage = progress / 100
    //   const location =
    //     percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
    //   this.rendition.display(location)
    // },
  }
}
</script>

<style lang="scss" scoped>
@import './components/global.scss';

.ebook {
  position: relative;
  .content-main {
    width: 100%;
    height: 2000px;
    position: absolute;
    background: white;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .read-wrapper {
      position: absolute;
      left: 50px;
      .btn {
        border-radius: 50%;
        background: rgba(0, 0, 0, 0);
        position: absolute;
        top: 50%;
        width: 50px;
        height: 50px;
      }
      .left {
        left: -50px;
      }
      .right {
        left: 500px;
      }
      .toolBar {
        ul {
          position: absolute;
          padding-left: 0;
          left: 580px;
          top: 20px;
          li {
            list-style: none;
            width: 50px;
            height: 50px;
            padding-left: 12px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0);
            border: 1px solid rgb(131, 115, 115);
            margin-bottom: 5px;
            i {
              // border-radius: 50%;
              font-size: 25px;
              line-height: 50px;
            }
          }
        }
        .fontsize {
          z-index: 20;
          position: absolute;
          top: 92px;
          left: 635px;
          width: 250px;
          height: 48px;
          border-radius: 15px;
          padding: 0 10px;
          background: rgba(0, 0, 0, 0.5);
          .setting-font-size {
            height: 100%;
            display: flex;
            align-items: center;
            .preview {
              flex: 0 0 px2rem(40);
              @include center;
            }
            .select {
              display: flex;
              flex: 1;
              .select-wrapper {
                flex: 1;
                display: flex;
                align-items: center;
                &:first-child {
                  .line {
                    &:first-child {
                      border-top: none;
                    }
                  }
                }
                &:last-child {
                  .line {
                    &:last-child {
                      border-top: none;
                    }
                  }
                }
                .line {
                  flex: 1;
                  height: 0;
                  border-top: px2rem(2) solid #ccc;
                }
                .point-wrapper {
                  position: relative;
                  flex: 0 0 0;
                  width: 0;
                  height: px2rem(7);
                  border-left: px2rem(3) solid #ccc;
                  .point {
                    position: absolute;
                    top: px2rem(-8);
                    left: px2rem(-10);
                    width: px2rem(30);
                    height: px2rem(30);
                    border-radius: 50%;
                    background: white;
                    border: px2rem(1) solid #ccc;
                    box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
                    @include center;

                    .small-point {
                      width: px2rem(15);
                      height: px2rem(15);
                      background: black;
                      border-radius: 50%;
                    }
                  }
                }
              }
            }
          }
        }
        .menu {
          z-index: 200;
          position: absolute;
          top: 0px;
          left: 635px;
          bottom: 0;
          width: 250px;
          height: 100%;
          background: white;
          .content-item {
            padding: 20px 15px;
            border-bottom: 1px solid #f4f4f4;
            .text {
              font-size: 16px;
              color: #333;
            }
          }
        }
      }
      i {
        font-size: 50px;
        color: rgb(131, 115, 115);
      }
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        display: flex;
        .left {
          flex: 0 0 px2rem(100);
        }
        .middle {
          flex: 1;
        }
        .right {
          flex: 0 0 px2rem(100);
        }
      }
    }
    .content-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
      display: flex;
      bottom: 0;
      right: 0;
      height: 5000px;
      background: rgba(51, 51, 51, 0.8);
    }
  }
}
</style>