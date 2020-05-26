<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title"
        placeholder="书名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter" />
      <el-input v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter" />
      <el-select v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter">
        <el-option v-for="item in category"
          :key="item.value"
          :label="item.label + '(' + item.num + ')'"
          :value="item.value" />
      </el-select>
      <el-button class="filter-item"
        v-waves
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px;"
        @click="handleFilter">查询</el-button>
    </div>
    <div class="bookList clearfix">
      <div class="bookItem"
        v-for="item in list"
        :key="item.id">
        <div class="img"
          @click="handleView(item.fileName)">
          <img :src="item.cover">
        </div>
        <div class="msg">
          <p :title="item.title">{{item.title}}</p>
          <span :title="item.author">{{item.author}}</span>
        </div>
      </div>
    </div>
    <div class="fenye">
      <pagination v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="handleFilter" />
    </div>

  </div>
</template>

<script>
import pagination from '../../components/Pagination'
import waves from '../../directive/waves'
import { getCategory, listBook, deleteBook } from '../../api/book'
import { parseTime } from '../../utils'
export default {
  components: {
    pagination
  },
  directives: {
    waves
  },
  filters: {
    valueFilter(value) {
      return value || '无'
    },
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '无'
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      listQuery: {},
      list: [],
      category: [],
      showCover: false,
      total: 0
    }
  },
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    parseQuery() {
      let listQuery = {
        page: 1,
        pageSize: 20,
        sort: '-id'
      }
      this.listQuery = { ...listQuery, ...this.listQuery }
    },
    wrapperKeyword(key, value) {
      function hightlight(value) {
        return `<span style="color: #1890ff">${value}</span>`
      }
      if (!this.listQuery[key]) {
        return value
      } else {
        return value.replace(new RegExp(this.listQuery[key], 'ig'), value =>
          hightlight(value)
        )
      }
      this.listQuery[key]
    },
    getList() {
      this.listLoading = true
      listBook(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.count
        this.listLoading = false
        this.list.forEach(book => {
          book.titleWrapper = this.wrapperKeyword('title', book.title)
          book.authorWrapper = this.wrapperKeyword('author', book.author)
        })
      })
    },
    getCategoryList() {
      getCategory().then(res => {
        this.category = res.data
      })
    },
    sortChange(data) {
      const { prop, order } = data
      this.sortBy(prop, order)
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    handleFilter() {
      this.getList()
    },
    handleView(fileName) {
      let params = {}
      params.fileName = fileName
      this.$router.push({ name: 'bookView', params })
    }
  }
}
</script>

<style lang="scss">
.bookList {
  width: 1190px;
  .bookItem {
    width: 270px;
    height: 425px;
    margin-right: 15px;
    overflow: hidden;
    cursor: pointer;
    float: left;
    .img {
      width: 260px;
      height: 300px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .msg {
      p {
        font-weight: 700;
        word-break: break-all;
        text-overflow: ellipsis;
      }
    }
  }
}
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
</style>
