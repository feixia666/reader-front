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
      <el-button class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px;"
        @click="handleCreate">新增</el-button>
      <el-checkbox v-model="showCover"
        class="filter-item"
        style="margin-left: 5px;"
        @change="changeShowCover">显示封面</el-checkbox>
    </div>
    <el-table :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"></el-table-column>
      <el-table-column label="书名"
        width="150"
        align="center">
        <template slot-scope="{ row: {titleWrapper}}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者"
        width="150"
        align="center">
        <template slot-scope="{ row: {authorWrapper}}">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="出版社"
        prop="publisher"
        align="center"
        width="150"></el-table-column>
      <el-table-column label="分类"
        prop="categoryText"
        align="center"
        width="150"></el-table-column>
      <el-table-column label="语言"
        prop="language"
        align="center"
        width="150"></el-table-column>
      <el-table-column v-if="showCover"
        label="封面"
        prop="categoryText"
        align="center"
        width="150">
        <template slot-scope="scope"><a :href="scope.row.cover"
            target="_blank">
            <img :src="scope.row.cover"
              style="width: 120px; height: 180px;">
          </a></template>
      </el-table-column>
      <el-table-column label="文件名"
        prop="fileName"
        align="center"
        width="100"></el-table-column>
      <el-table-column label="文件路径"
        prop="filePath"
        align="center"
        width="100">
        <template slot-scope="{ row: { filePath }}">
          <span>{{ filePath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面路径"
        prop="coverPath"
        align="center"
        width="100">
        <template slot-scope="{ row: { coverPath }}">
          <span>{{ coverPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解压路径"
        prop="unzipPath"
        align="center"
        width="100">
        <template slot-scope="{ row: { unzipPath }}">
          <span>{{ unzipPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传人"
        prop="createUser"
        align="center"
        width="100">
        <template slot-scope="{ row: { createUser }}">
          <span>{{ createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间"
        prop="createDt"
        align="center"
        width="100">
        <template slot-scope="{ row: { createDt }}">
          <span>{{ createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
        width="120"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <el-button type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row.fileName)"></el-button>
          <el-button type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.fileName)"
            style="color: #f56c6c;"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="handleFilter" />
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
      list: '',
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
        sort: '+id'
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
    handleCreate() {
      this.$router.push({})
    },
    handleUpdate(fileName) {
      this.$router.push(`/book/edit/${fileName}`)
    },
    handleDelete(fileName) {
      this.$confirm('此操作将永久删除该电子书，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBook(fileName).then(res => {})
      })
    },
    changeShowCover(value) {
      this.showCover = value
    }
  }
}
</script>
