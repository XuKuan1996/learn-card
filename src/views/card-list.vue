<template>
  <div>
    <el-table :data="cardList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="卡片标题" width="180" prop="title"></el-table-column>
      <el-table-column label="所属分组" width="180" prop="groupName"></el-table-column>
      <el-table-column label="创建时间" width="180" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-dialog title="修改分组名称" :visible.sync="dialogVisible" width="30%">
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
    </el-dialog>-->
  </div>
</template>

<script>
import { getAllCards, deleteCard } from "../services/card";
export default {
  data: function() {
    return {
      cardList: [],
      dataSource: []
    };
  },
  methods: {
    handleSearch() {
      getAllCards(this).then(res => {
        (this.dataSource = res), (this.cardList = res.map(item => item.value));
      });
    },
    handleEdit(index) {
      const cardId = this.dataSource[index].primaryKey;
      this.$router.push({ name: "carddetail", params: { cardId } });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCard(this, this.dataSource[index].primaryKey)
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
    }
  },
  created() {
    this.handleSearch();
  }
};
</script>

<style>
</style>