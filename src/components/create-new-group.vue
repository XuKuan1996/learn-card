<template>
  <div id="create-new-group">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="text-align: left;">
        <span>新建分组</span>
        <el-button type="text" @click="onSubmit" style="float: right; padding: 3px 0">创建</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="分组名称：">
          <el-input v-model="form.groupName" placeholder="请输入分组名称"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { createObjectStore, addObject } from "../db/dbOperations";
import { createGroup } from "../services/group";
export default {
  data: function() {
    return {
      form: {
        groupName: ""
      }
    };
  },
  methods: {
    addData() {
      const result = addObject(this, "object_stores", {
        groupName: this.form.groupName,
        createTime: new Date().getTime()
      });
      result.then(
        value => {
          if (value) {
            this.$notify({
              type: "success",
              message: "添加成功！"
            });
          }
        },
        error => {
          this.$notify({
            type: "error",
            message: "添加失败！"
          });
          console.log(error);
        }
      );
    },
    onSubmit() {
      if (this.$db) {
        createGroup(this, {
          groupName: this.form.groupName,
          createTime: new Date().getTime()
        })
          .then(res => {
            if (res) {
              this.$notify({
                type: "success",
                message: "创建成功！"
              });
            }
          })
          .catch(err => {
            this.$notify({
              type: "error",
              message: "创建失败！"
            });
          });
        // if (!this.$db.objectStoreNames.contains("object_stores")) {
        //   const result = createObjectStore(
        //     this,
        //     "object_stores",
        //     { autoIncrement: true },
        //     [
        //       {
        //         name: "groupName",
        //         keyPath: "groupName",
        //         options: { unique: true }
        //       }
        //     ]
        //   );
        //   result.then(
        //     value => {
        //       this.addData()
        //     },
        //     error => {
        //       console.log(error);
        //     }
        //   );
        // } else {
        //   this.addData()
        // }
        //   if (this.$db.objectStoreNames.contains("object_stores")) {
        //     this.$notify({
        //       type: "warning",
        //       message: "分组名称已存在！"
        //     });
        //     return;
        //   }
        //   const result = createObjectStore(this, this.form.groupName, {
        //     autoIncrement: true
        //   });
        //   result.then(
        //     value => {
        //       console.log(value);
        //       if (value) {
        //         this.$notify({
        //           type: "success",
        //           title: "成功",
        //           message: "创建成功"
        //         });
        //       }
        //     },
        //     error => {
        //       console.log(error);
        //       this.$notify({
        //         type: "error",
        //         message: "创建失败！"
        //       });
        //     }
        //   );
        // } else {
        //   this.$notify({
        //     type: "error",
        //     title: "错误",
        //     message: "数据库未连接！"
        //   });
        // }
      }
    }
  }
};
</script>

<style>
#create-new-group {
  width: 50%;
  margin: 0 auto;
  margin-top: 30vh;
}
.submit-button {
  float: right;
}
.editor {
  width: 100%;
  height: 200px;
  border: 1px solid green;
  overflow: auto;
  text-align: left;
  padding: 1em;
}
#editor {
  min-height: 100px;
}
</style>