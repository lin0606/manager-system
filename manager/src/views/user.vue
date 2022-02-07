<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item lable="用户Id" prop="userId">
          <el-input v-model="userId" placeholder="请输入用户id"></el-input>
        </el-form-item>
        <el-form-item lable="用户名" prop="userName">
          <el-input v-model="userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item lable="状态" prop="state">
          <el-select>
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger" @click="handlePatchDelete">批量删除</el-button>
      </div>
      <el-table
        :data="userList.arr"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in colums"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleClick">
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="pagination"
        layout="prev, pager, next"
        :total="pager.total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, getCurrentInstance } from "vue";
export default {
  name: "User",
  setup() {
    const { proxy } = getCurrentInstance();
    onMounted(() => {
      getUserList();
    });
    const user = reactive({
      state: 0,
    });
    const userList = reactive({
      arr: [],
    });
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10,
    });
    const columns = reactive([
      {
        lable: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        //格式化指定列的值
        formatter(row,columns,value){
            return{
                0:'管理员',
                1:'普通用户'
            }[value]
        }
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row,columns,value){
            return{
                1:'在职',
                2:'离职',
                3:'试用期'
            }[value]
        }
      },
      {
        label: "注册时间",
        prop: "createTime",
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
      },
    ]);
    const getUserList = async () => {
      let params = { ...user, ...pager };
      const { page, list } = await proxy.$api.userList(params);
      pager.total = page.total;
      userList.arr = list;
    };
    // 查询
    const handleQuery = () => {
      getUserList();
    };
    // 重置
    const handleReset = () => {
      proxy.$refs.form.resetFields();
    };
    // 点击分页
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };
    // 用户单个删除
    const handleDelete = async (row) => {
      const res = await proxy.$api.userDelete({
        userIds: [row.userId],
      });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("删除失败");
      }
    };
    const checkUserIds = ref([]);
    // 批量删除
    const handlePatchDelete = () => {
      if (checkUserIds.value.length == 0) {
        proxy.$message.error("没有选，请选择要删除的用户");
        return;
      }
      const res = await proxy.$api.userDelete({
        userIds: checkUserIds.value,
      });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("删除失败");
      }
    };
    const handleSelectionChange = async(list) => {
        let arr = [];
        list.forEach(ele =>{
            arr.push(ele.userId);
        })
        checkUserIds.value = arr;
    };
    return {
      user,
      userList,
      columns,
      pager,
      checkUserIds,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePatchDelete,
      handleSelectionChange,
    };
  },
};
</script>

<style lang="sass">
</style>