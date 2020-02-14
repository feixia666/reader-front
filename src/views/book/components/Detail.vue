<template>
  <el-form ref="postForm"
    :model="postForm">
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
              <el-form-item prop="facePath"
                label="封面路径："
                :label-width="labelWidth">
                <el-input v-model="postForm.facePath"
                  placeholder="封面路径"
                  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="fileName"
                label="文件名称："
                :label-width="labelWidth">
                <el-input v-model="postForm.fileName"
                  placeholder="文件名称"
                  disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="封面："
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
                <div>
                  <el-tree v-if="postForm.contents && postForm.contents.length > 0"
                    class="preview-wrapper"></el-tree>
                </div>
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

export default {
  components: { Sticky, Warning, EbookUpload, MdInput },
  props: {
    isEdit: Boolean
  },
  data() {
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
      labelWidth: '120px'
    }
  },
  methods: {
    showGuide() {
      console.log('show guide')
    },
    submitForm() {
      this.loading = true
    },
    onUploadSuccess() {
      console.log('onsucc')
    },
    onUpLoadRemove() {
      console.log('onremove')
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
