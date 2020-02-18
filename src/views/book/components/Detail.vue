<template>
  <el-form ref="postForm"
    :model="postForm"
    :rules="rules">
    <sticky :class-name="'sub-navbar'">
      <el-button v-if="!isEdit"
        @click="showGuide">显示帮助</el-button>
      <el-button v-loading="loading"
        @click="submitForm"
        style="margin-left: 10px"
        type="success">
        {{ isEdit ? '编辑电子书' : '新增电子书' }}
      </el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <warning />
        <el-col :span="24">
          <ebook-upload :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUpLoadRemove" />
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <MdInput v-model="postForm.title"
              :maxlength="100"
              name="name"
              required>
              书名
            </MdInput>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="author"
                label="作者："
                :label-width="labelWidth">
                <el-input v-model="postForm.author"
                  placeholder="作者"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="publisher"
                label="出版社："
                :label-width="labelWidth">
                <el-input v-model="postForm.publisher"
                  placeholder="出版社"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="language"
                label="语言："
                :label-width="labelWidth">
                <el-input v-model="postForm.language"
                  placeholder="语言"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="rootPath"
                label="根文件："
                :label-width="labelWidth">
                <el-input v-model="postForm.author"
                  placeholder="根文件"
                  disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="filePath"
                label="文件路径："
                :label-width="labelWidth">
                <el-input v-model="postForm.filePath"
                  placeholder="文件路径"
                  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="unzipPath"
                label="解压路径："
                :label-width="labelWidth">
                <el-input v-model="postForm.unzipPath"
                  placeholder="解压路径"
                  disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="coverPath"
                label="封面路径："
                :label-width="labelWidth">
                <el-input v-model="postForm.coverPath"
                  placeholder="封面路径"
                  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="originalName"
                label="文件名称："
                :label-width="labelWidth">
                <el-input v-model="postForm.originalName"
                  placeholder="文件名称"
                  disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="封面："
                prop="cover"
                :label-width="labelWidth">
                <a v-if="postForm.cover"
                  :href="postForm.cover"
                  target="_blank">
                  <img :src="postForm.cover"
                    class="preview-img">
                </a>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label-width="labelWidth"
                label="目录：">
                <div v-if="contentsTree && contentsTree.length > 0"
                  class="contents-wrapper">
                  <el-tree :data="contentsTree"
                    @node-click="handleClick"></el-tree>
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from '../../../components/Sticky/index'
import Warning from './Warning'
import EbookUpload from '../../../components/EbookUpload/index'
import MdInput from '../../../components/MDinput/index'
import { createBook, getBook, updateBook } from '../../../api/book'

const fields = {
  title: '标题',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}

export default {
  components: { Sticky, Warning, EbookUpload, MdInput },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + '必须填写'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {
        status: 'draft',
        title: '',
        author: '',
        publisher: '',
        language: '',
        rootPath: '',
        filePath: '',
        unzipPath: '',
        facePath: '',
        fileName: '',
        cover: ''
      },
      fileList: [],
      labelWidth: '120px',
      contentsTree: [],
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const fileName = this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  methods: {
    getBookData(fileName) {
      getBook(fileName).then(res => {
        this.setData(res.data)
      })
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootPath,
        filePath,
        unzipPath,
        originalName,
        url,
        fileName,
        path,
        cover,
        coverPath,
        creator,
        contents,
        rootFile,
        contentsTree
      } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootPath,
        filePath,
        unzipPath,
        originalName,
        publisher,
        url,
        fileName,
        path,
        cover,
        coverPath,
        creator,
        contents,
        rootFile
      }
      this.contentsTree = contentsTree
      this.fileList = [{ name: originalName || fileName, url }]
    },
    setDefault() {
      this.$refs.postForm.resetFields()
      this.contentsTree = []
      this.fileList = []
    },
    showGuide() {
      console.log('show guide')
    },
    submitForm() {
      const onSuccess = res => {
        const { msg } = res
        this.$notify({
          title: '操作成功',
          message: msg,
          type: 'success',
          duration: 2000
        })
        this.loading = false
      }
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
            const book = { ...this.postForm }
            delete book.contentsTree
            if (!this.isEdit) {
              createBook(book)
                .then(res => {
                  onSuccess(res)
                  this.setDefault()
                })
                .catch(() => {
                  this.loading = false
                })
            } else {
              updateBook(book).then(res => {
                onSuccess(res)
              })
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    },
    onUploadSuccess(data) {
      console.log('onsucc', data)
      this.setData(data)
    },
    onUpLoadRemove() {
      this.setDefault()
    },
    handleClick(data) {
      if (data.text) {
        window.open(data.text)
      }
    }
  }
}
</script>

<style lang="scss">
.detail-container {
  padding: 40px 50px 20px;
  .preview-img {
    width: 200px;
    height: 270px;
  }
}
</style>
