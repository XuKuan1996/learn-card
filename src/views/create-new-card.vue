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
            <el-select v-model="form.groupId" style="width: 50%;" clearable filterable @visible-change="visibleChange">
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
          <el-button @click="submitForm('form')" round type="primary" style="float: right;">创建</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs type="border-card" v-show="tabVisible">
      <el-tab-pane label="正面">
        <editor @getContent="getFrontContent"></editor>
      </el-tab-pane>
      <el-tab-pane label="背面">
        <editor @getContent="getBackContent"></editor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import editor from "../components/editor.vue";
import { getGroupList } from "../services/group";
import { createCard } from '../services/card';
export default {
  data: function() {
    return {
      frontContent: "",
      backContent: "",
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
    };
  },
  components: {
    editor
  },
  methods: {
    getFrontContent(data) {
      this.frontContent = data;
    },
    getBackContent(data) {
      this.backContent = data;
    },
    // create() {
    //   console.log(this.$db);
    //   const transaction = this.$db.transaction(["数学"], "readwrite");
    //   transaction.onerror = function(e) {
    //     console.log(e);
    //   };
    //   transaction.onsuccess = function(e) {
    //     console.log(e);
    //   };
    //   const objectStore = transaction.objectStore("数学");
    //   const request = objectStore.add({
    //     frontContent: this.frontContent,
    //     backContent: this.backContent,
    //     id: new Date().getTime()
    //   });
    //   request.onsuccess = function(e) {
    //     console.log(e);
    //   };
    // },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          createCard(this, {...this.form, frontContent: this.frontContent, backContent: this.backContent, createTime: new Date().getTime()}).then(res => {
            if(res){
              this.$notify({
                type: 'success',
                message: '创建成功！',
              })
            }
          }).catch(err => {
            this.$notify({
              type: 'error',
              message: '创建失败！',
            })
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
  mounted() {
    getGroupList(this).then(res => {
      if (res && Array.isArray(res)) {
        this.groupList = res.map(item => ({...item.value, primaryKey: item.primaryKey}));
      }
    });
  }
};
</script>

<style>
</style>