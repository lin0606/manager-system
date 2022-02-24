<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item lable="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="roleList" border style="width: 100%" row-key="id">
        <el-table-column
          v-for="item in colums"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handlePermission(scope.row)"
            >
              设置权限
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row._id)"
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
      title="角色新增"
      v-model="showModal"
      :before-close="handleCloseDialog"
    >
      <el-form
        :model="roleForm"
        ref="dialogForm"
        lable-width="100px"
        :rules="rules"
      >
        <el-form-item prop="roleName" lable="角色名称">
          <el-input
            placeholder="请输入角色名称"
            v-model="roleForm.roleName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="roleForm.remark"
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

    <el-dialog
      title="设置权限"
      v-model="showPermission"
      :before-close="handlePermsionCloseDialog"
    >
      <el-form lable-width="100px">
        <el-form-item prop="roleName" lable="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item prop="remark" label="选择权限">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="_id"
            :props="{ label: 'menuName' }"
            default-expand-all
            ref="permissionTree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "../utils/utils";
export default {
  name: "User",
  data() {
    return {
      queryForm: {
        menuState: 1,
      },
      roleList: [],
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
          width: 180,
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              let name = this.actionMap[key];
              if (key && name) names.push(name);
            });
            return names.join(",");
          },
        },
        {
          label: "创建时间", // 按钮权限的标识
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
          width: 180,
        },
        {
          label: "更新时间", // 按钮权限的标识
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
          width: 180,
        },
      ],
      pager: {
        total: 0,
        pageSize: 10,
      },
      showModal: false,
      roleForm: {},
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      action: "add",
      showPermission: false,
      curRoleName: "",
      curRoleId: "",
      menuList: [],
      actionMap: {},
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    async getRoleList() {
      const { list, page } = await this.$api.roleList({
        ...this.queryForm,
        ...this.pager,
      });
      this.pager = page;
      this.roleList = list;
    },
    handleAdd() {
      this.showModal = true;
      this.action = "add";
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    handleCloseDialog() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          // 这里的this是role组件这个实例
          let { roleForm, action } = this;
          let params = { ...roleForm, action };
          let res = await this.$api.roleOperate(params);
          if (res) {
            this.showModal = false;
            this.$message.success("创建成功");
            this.handleReset("dialogForm");
            this.getRoleList();
          }
        }
      });
    },
    // 编辑
    handleEdit(row) {
      this.action = "edit";
      this.showModal = "true";
      this.$nextTick(() => {
        // this.roleForm = row;
        this.roleForm = {
          _id: row._id,
          remark: row.remark,
          roleName: row.roleName,
        };
      });
    },
    // 删除
    async handleDelete(_id) {
      await this.$api.roleOperate({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getRoleList();
    },
    // 设置权限弹框 取消按钮
    handlePermsionCloseDialog() {
      this.showPermission = false;
    },
    handlePermission(row) {
      this.showPermission = true;
      this.curRoleId = row._id;
      this.curRoleName = row.roleName;
      const { checkedKeys } = row.permissionList;
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(checkedKeys);
      });
    },
    async getMenuList() {
      const list = await this.$api.menuList();
      this.menuList = list;
      this.getActionMap(list);
    },
    async handlePermissionSubmit() {
      let nodes = this.$refs.permissionTree.getCheckedNodes();
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((node) => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys, //按钮级别
          halfCheckedKeys: parentKeys.concat(halfKeys), //半选中的按钮
        },
      };

      await this.$api.updatePermission(params);
      this.showPermission = false;
      this.$message.success("设置成功");
      this.getRoleList();
    },
    getActionMap(list) {
      let actionMap = {};
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          if (item.children && item.action) {
            actionMap[item_id] = item.menuName;
          }
          // 相当于一级菜单，递归将二级菜单展示出来
          if (item.children && !item.action) {
            deep(item.children);
          }
        }
      };
      deep(JSON.parse(JSON.stringify(list)));
      this.actionMap = actionMap;
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getRoleList();
    },
  },
};
</script>

<style lang="sass">
</style>