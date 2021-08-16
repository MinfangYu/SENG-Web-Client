<template>
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
      <el-menu-item index="2-1" disabled>Register</el-menu-item>
      <el-menu-item index="2-2" disabled>Login</el-menu-item>
      <el-menu-item index="2-3">Profile</el-menu-item>
      <el-menu-item index="2-4">Logout</el-menu-item>
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
    <el-menu-item index="4">Mypage</el-menu-item>
  </el-menu>
  <el-card class="profile">
    <template #header>
      <div class="card-header">
        <span>User Profile</span>
        <el-button class="edit" type="text" @click="changeProfile">Edit</el-button>
      </div>
    </template>
    <label class="text" style="margin-right: 20px;color: dimgray">First Name:</label>
    <label class="item">{{userInfo.firstName}}</label>
    <br>
    <label class="text" style="margin-right: 20px;color: dimgray">Last Name:</label>
    <label class="item">{{userInfo.lastName}}</label>
    <br>
    <label class="text" style="margin-right: 10px;color: dimgray" >Email:</label>
    <label class="item">{{userInfo.email}}</label>
    <br>
    <label class="text" style="margin-right: 10px;color: dimgray" >Profile Picture:</label>
    <div class="demo-image">
        <el-image
            style="width: 300px; height: 300px"
            :src='url'></el-image>
      </div>

  </el-card>
  <br>
  <br>
  <el-button class="submit" @click="returnPage">My Events</el-button>
</template>

<script>
export default {
  name: "Profile.vue",
  data() {
    return {
      userId:sessionStorage.getItem("userId"),
      pathId:this.$route.params.userId,
      userInfo: [],
      password: "",
      currentPassword: "",
      pwdFlag: true,
      url:"",
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  mounted() {
    this.getUserInfo();
    this.getUserImage();
  },
  methods: {
    changePassword: function(e) {
      this.pwdFlag = !this.pwdFlag;
      e.preventDefault();
    },
    getUserInfo() {
      this.axios.get('http://localhost:4941/api/v1/users/'+this.userId, {params:{"id": this.userId},
        headers: {"X-Authorization": sessionStorage.getItem("token")}})
          .then((response) => {
            this.userInfo = response.data;
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    getUserImage() {
      this.axios.get('http://localhost:4941/api/v1/users/'+this.userId+'/image')
          .then(() => {
            this.url = 'http://localhost:4941/api/v1/users/'+this.userId+'/image';
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
            this.url = 'https://free-images.com/or/7497/cherry_tree_blossom_2007.jpg';
          });
    },
    returnPage() {
      this.$router.push("/events/my");
    },
    changeProfile() {
      this.$router.push("/users/my/patch");
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
}
.text {
  font-size: 18px;
}

.item {
  font-size: 20px;
  margin-bottom: 18px;
}
.profile {
  width: 480px;
  margin: auto;
}
.submit {
  height: 50px;
  width: 130px;
  font-size: 20px;
}
.edit {
  height: 50px;
  width: 50px;
  font-size: 20px;
}
</style>