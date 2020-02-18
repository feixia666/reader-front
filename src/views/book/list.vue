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
        <template slot-scope="{ row: {title}}">
          <span>{{title}}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination :total="0" />
  </div>
</template>

<script>
import pagination from '../../components/Pagination'
import waves from '../../directive/waves'
import { getCategory, listBook } from '../../api/book'
export default {
  components: {
    pagination
  },
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      listQuery: {
        title: '',
        author: '',
        category: ''
      },
      list: '',
      category: [
        {
          value: '选项1',
          label: '黄金糕'
        }
      ],
      showCover: false
    }
  },
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listBook(this.listQuery).then(res => {
        this.list = res.data
      })
    },
    getCategoryList() {
      getCategory().then(res => {
        this.category = res.data
      })
    },
    sortChange() {
      console.log('sortchange')
    },
    handleFilter() {
      console.log('keyup')
      this.getList()
    },
    handleCreate() {
      this.$router.push({})
    },
    changeShowCover(value) {
      this.showCover = value
    }
  }
}
</script>
