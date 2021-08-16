<template>
  <div class="loginBox">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <el-menu-item index="1">Home</el-menu-item>
      <el-submenu index="2">
        <template #title>User</template>
        <el-menu-item index="2-1">Register</el-menu-item>
        <el-menu-item index="2-2">Login</el-menu-item>
        <el-menu-item index="2-3" disabled>Profile</el-menu-item>
        <el-menu-item index="2-4" disabled>Logout</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template #title>Event</template>
        <el-menu-item index="3-1">View Events</el-menu-item>
        <div v-if="status != null">
          <el-menu-item index="3-2">Create Event</el-menu-item>
        </div>
        <div v-if="status == null">
          <el-menu-item index="3-2" disabled>Create Event</el-menu-item>
        </div>
      </el-submenu>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item>
    </el-menu>

    <div v-if="errorFlag" class= error style="color: #ff0000;">
      <el-alert title="error alert" type="error"  show-icon center :closable="false">{{ error }}</el-alert>
    </div>

    <el-form ref="form" class="login" :model="form" style="width: 600px; font-size: larger">
      <el-form-item label="Email" required="true">
        <el-input name="email" class="email" v-model="email" placeholder="Email" prefix-icon="el-icon-message"></el-input>
      </el-form-item>
      <el-form-item label="Password" required="true">
        <el-input :type="pwdFlag ? 'text' : 'password'" prefix-icon="el-icon-lock" v-model="password" placeholder="Password"></el-input>
        <i :class="pwdFlag?icon2:icon1" style="position: absolute; right: 0.7rem; top: 3.2rem; font-size: 20px" @click="pwdFlag=!pwdFlag"></i>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="checkUsers">Login</el-button>
        <el-button @click="returnPage">Return</el-button>
      </el-form-item>
    </el-form>
    <br>
  </div>

</template>

<script>
export default {
  name: "Login.vue",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      userId: null,
      token: null,
      error: "",
      errorFlag: false,
      users: [],
      pwdFlag: false,
      icon1: 'el-icon-view',
      icon2: 'el-icon-minus',
    }
  },
  methods: {
    checkUsers() {
      this.axios.post('http://localhost:4941/api/v1/users/login', {"email": this.email, "password": this.password})
          .then((response) => {
            sessionStorage.setItem("userId", response.data.userId);
            sessionStorage.setItem("token", response.data.token);
            this.$router.push("/users/my");
          }, (error) => {
            this.error = error.response.statusText.slice(13,error.response.statusText.length-1);
            this.errorFlag = true;
          });
    },
    returnPage() {
      this.$router.push("/");
    },
    open() {
      this.$alert(this.error, 'Login Fail', {
        confirmButtonText: 'OK',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      });
      // window.location.reload();
    },
    handleSelect(key) {
      if (key === "1") {
        this.activeIndex = "1";
        this.$router.push({path:"/"});
      }else if(key === "2-1") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/register"});
      } else if(key === "2-2") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/login"});
      } else if(key === "2-3") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/my"});
      } else if(key === "2-4") {
        sessionStorage.clear();
        this.activeIndex = "1";
        this.$router.push({path:"/"});
      } else if(key === "3-1") {
        this.activeIndex = "1";
        this.$router.push({path:"/events"});
      } else if(key === "3-2") {
        this.activeIndex = "1";
        this.$router.push({path:"/events/create"});
      } else if(key === "4") {
        this.activeIndex = "1";
        this.$router.push({path:"/events/my"});
      }
    },
  }
}
</script>

<style scoped>
.el-menu-demo {
  margin-top: -60px;
}
.login {
  margin-top: 80px;
  display: inline-block;
}

</style>