<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item lable="用户Id" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户id"></el-input>
        </el-form-item>
        <el-form-item lable="用户名" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item lable="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'user-add'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDelete"
          v-has="'user-parse-delete'"
          >批量删除</el-button
        >
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
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
              v-has="'user-edit'"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              v-has="'user-delete'"
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
    <el-dialog
      title="用户新增"
      v-model="showModal"
      :before-close="handleCloseDialog"
    >
      <el-form
        :model="userForm"
        ref="dialogForm"
        lable-width="100px"
        :rules="rules"
      >
        <el-form-item prop="userName" lable="用户名">
          <el-input
            placeholder="请输入用户名"
            v-model="userForm.userName"
            :disabled="action == 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userEmail" lable="邮箱">
          <el-input
            placeholder="请输入邮箱"
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
          >
            <template #append>@llr.com</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" lable="手机号">
          <el-input
            placeholder="请输入手机号"
            v-model="userForm.mobile"
          ></el-input>
        </el-form-item>
        <el-form-item prop="job" lable="岗位">
          <el-input placeholder="请输入岗位" v-model="userForm.job"></el-input>
        </el-form-item>
        <el-form-item prop="state" lable="状态">
          <el-select v-model="userForm.state" placeholder="请选择">
            <el-option :value="1" lable="在职"></el-option>
            <el-option :value="2" lable="离职"></el-option>
            <el-option :value="3" lable="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roleList" lable="系统角色">
          <!-- 加上multiple会变为多选 -->
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in rolelist"
              :key="role._id"
              :value="role._id"
              :lable="role.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId" lable="部门">
          <!-- value 和 lable 提交的是value值，显示的是lable的值-->
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', lable: 'deptName' }"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, getCurrentInstance, toRaw, ref } from "vue";
import utils from "../utils/utils";
export default {
  name: "User",
  setup() {
    const { proxy } = getCurrentInstance();
    onMounted(() => {
      getUserList();
      getRoleList();
      getDeptList();
    });
    const user = reactive({
      state: 1,
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
        formatter(row, columns, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, columns, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
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
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
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
    const handlePatchDelete = async () => {
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
    // 批量删除选择的函数
    const handleSelectionChange = (list) => {
      let arr = [];
      list.forEach((ele) => {
        arr.push(ele.userId);
      });
      checkUserIds.value = arr;
    };
    // 用户新增
    const showModal = ref(false);
    const handleCreate = () => {
      action.value = "add";
      showModal.value = true;
    };
    const userForm = reactive({});
    // 新增取消
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    // 新增确定
    let action = ref("add");
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm); //将双向数据绑定对象变为普通对象
          params.userEmail += "@llr.com";
          params.action = action.value;
          let res = await proxy.$api.userSubmit(params);
          if (res) {
            showModal.value = false;
            if (action.value == "add") {
              proxy.$message.success("新增用户成功");
            } else {
              proxy.$message.success("编辑用户成功");
            }

            handleReset("dialogForm");
            getUserList();
          }
        }
      });
    };
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择部门",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
    });
    // 获取角色列表
    const roleList = ref([]);
    const getRoleList = async () => {
      const res = await proxy.$api.getRoleList();
      roleList.value = res;
    };
    //获取部门列表
    const deptList = ref([]);
    const getDeptList = async () => {
      const res = await proxy.$api.getDeptList();
      deptList.value = res;
    };
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      proxy.$nextTick(() => {
        // row.state = Number(row.state);
        row.state = row.state - 0;
        Object.assign(userForm, row);
      });
    };

    const handleCloseDialog = () => {
      handleReset("dialogForm");
      showModal.value = false;
    };
    return {
      user,
      userList,
      columns,
      pager,
      checkUserIds,
      userForm,
      rules,
      roleList,
      deptList,
      action,

      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePatchDelete,
      handleSelectionChange,
      showModal,
      handleCreate,
      handleClose,
      handleSubmit,
      getRoleList,
      getDeptList,
      handleEdit,
      handleCloseDialog,
    };
  },
};
</script>

<style lang="sass">
</style>