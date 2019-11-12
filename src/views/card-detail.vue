<template>
  <div>
    <el-form :model="form" ref="form" :rules="rules">
      <el-row>
        <el-col :span="10">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title" style="width: 50%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="所属分组：" prop="groupId">
            <el-select
              v-model="form.groupId"
              style="width: 50%;"
              clearable
              filterable
              @visible-change="visibleChange"
            >
              <el-option
                v-for="item in groupList"
                :key="item.primaryKey"
                :label="item.groupName"
                :value="item.primaryKey"
                style="z-index: 100000;"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click="submitForm('form')" round type="primary" style="float: right;">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs type="border-card" v-show="true" :key="editorKey">
      <el-tab-pane label="正面">
        <editor @getContent="getFrontContent" :init-content="frontContent"></editor>
      </el-tab-pane>
      <el-tab-pane label="背面">
        <editor @getContent="getBackContent" :init-content="backContent"></editor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import editor from "../components/editor.vue";
import { getGroupList } from "../services/group";
import { createCard, getCardById, updateCard } from '../services/card';
export default {
  data: function() {
    return {
      dataSource: [],
      frontContent: undefined,
      backContent: undefined,
      editorKey: 0,
      form: {
        title: undefined,
        groupId: undefined
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        groupId: [{ required: true, message: "请选择分组", trigger: "blur" }]
      },
      groupList: [],
      tabVisible: true,
      cardId: undefined,
    };
  },
  components: {
    editor
  },
  methods: {
    handleSearch(){
      console.log(this.$router)
      const { currentRoute={} } = this.$router;
      const { params={} } = currentRoute;
      const { cardId } = params;
      if(cardId){
        console.log(getCardById)
        getCardById(this, Number(cardId)).then(res => {
          console.log('cardd', res)
          if(res){
            this.dataSource = res
            this.form.title = res.title
            this.form.groupId = res.groupId
            this.frontContent = res.frontContent
            this.backContent = res.backContent
            this.cardId = Number(cardId)
            this.editorKey = this.editorKey + 1
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleGetGroupList(){
      getGroupList(this).then(res => {
      if (res && Array.isArray(res)) {
        this.groupList = res.map(item => ({...item.value, primaryKey: item.primaryKey}));
      }
    });
    },
    getFrontContent(data) {
      this.frontContent = data;
    },
    getBackContent(data) {
      this.backContent = data;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.dataSource)
          const data = {
            ...this.dataSource,
            title: this.form.title,
            groupId: this.form.groupId,
            frontContent: this.frontContent,
            backContent: this.backContent,
          }
          console.log('data', data)
          updateCard(this, data, this.cardId).then(res => {
            if(res){
              this.$notify({
                type: 'success',
                message: '更新成功！',
              })
            }
          }).catch(err => {
            this.$notify({
              type: 'error',
              message: '更新失败！',
            })
          }).finally(() => {
            this.handleSearch()
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    visibleChange(e){
      this.tabVisible = !e
    }
  },
  created(){
    this.handleSearch()
    this.handleGetGroupList()
  }
};
</script>

<style>
</style>