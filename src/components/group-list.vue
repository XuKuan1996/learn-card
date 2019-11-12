<template>
  <div>
    <el-table :data="groupList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="分组名称" width="180" prop="groupName"></el-table-column>
      <el-table-column label="创建时间" width="180" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑名称</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改分组名称" :visible.sync="dialogVisible" width="30%">
      <span>
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="新的分组名称：" prop="newGroupName">
            <el-input v-model="form.newGroupName"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getObjectStores } from "../db/dbOperations";
import { getGroupList, updateGroup, deleteGroup } from "../services/group";
export default {
  data: function() {
    return {
      dataSource: [],
      groupList: [],
      dialogVisible: false,
      form: {
        newGroupName: undefined
      },
      rules: {
        newGroupName: [
          { required: true, message: "请输入分组名称", trigger: "blur" }
        ]
      },
      row: undefined,
      index: undefined
    };
  },
  methods: {
    handleSearch() {
      getGroupList(this).then(res => {
        this.dataSource = res;
        if (res && Array.isArray(res)) {
          this.groupList = res.map(item => {
            const { createTime } = item.value;
            if (createTime) {
              return {
                ...item.value,
                createTime: new Date(createTime).toLocaleTimeString(),
                primaryKey: item.primaryKey
              };
            } else {
              return item.value;
            }
          });
        }
      });
    },
    handleEdit(index, row) {
      console.log(row);
      this.row = row;
      this.index = index;
      this.dialogVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteGroup(this, this.dataSource[index].primaryKey)
            .then(res => {
              if (res) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            })
            .finally(() => {
              this.handleSearch();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.index);
          const newData = {
            ...this.dataSource[this.index].value,
            groupName: this.form.newGroupName
          };
          const key = this.dataSource[this.index].primaryKey;
          updateGroup(this, newData, key)
            .then(res => {
              console.log(res);
              if (res) {
                this.$notify({
                  type: "success",
                  message: "更新成功！"
                });
              }
            })
            .catch(err => {
              this.$notify({
                type: "error",
                message: "更新失败！"
              });
            })
            .finally(() => {
              this.dialogVisible = false;
              this.form.newGroupName = undefined;
              this.handleSearch();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    this.handleSearch();
  }
};
</script>

<style>
</style>