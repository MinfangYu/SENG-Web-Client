<template>
  <div class="registerBox">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="margin-top: -60px"
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
        <el-menu-item index="3-2" disabled>Create Event</el-menu-item>
      </el-submenu>
      <el-menu-item index="4" disabled>Mypage</el-menu-item>
    </el-menu>

    <!--    <span>Message: {{ error }}</span>-->
    <div v-if="errorFlag" class= error style="color: #ff0000;">
      <el-alert class="el-alert" title="error alert" type="error" show-icon center :closable="false">{{ error }}</el-alert>
    </div>

    <el-form ref="form" class="register" :model="form"  style="width: 600px; font-size: larger">
      <el-form-item label="First Name" required="true">
        <el-input name="firstName" class="firstName" v-model="firstName" placeholder="First Name" width="100px"></el-input>
      </el-form-item>
      <el-form-item label="Last Name" required="true">
        <el-input name="lastName" class="lastName" v-model="lastName" placeholder="Last Name"></el-input>
      </el-form-item>
      <el-form-item label="Email" required="true">
        <el-input name="email" class="email" v-model="email" placeholder="Email" prefix-icon="el-icon-message"></el-input>
      </el-form-item>
      <el-form-item label="Password" required="true">
        <el-input :type="pwdFlag ? 'text' : 'password'" prefix-icon="el-icon-lock" v-model="password" placeholder="Password"></el-input>
        <i :class="pwdFlag?icon2:icon1" style="position: absolute; right: 0.7rem; top: 3.2rem; font-size: 20px" @click="pwdFlag=!pwdFlag"></i>

      </el-form-item>
      <el-form-item label="Profile Picture">
        <el-upload
            :class="{hide: uploadDisabled}"
            action="https://jsonplaceholder.typicode.com/posts/"
            accept=".jpeg,.png,.gif"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :on-change="handleChange"
            :on-preview="handlePictureCardPreview"
            :file-list="diaImg"
            >
          <i class="el-icon-plus"></i>
          <template #tip>
            <div class="el-upload__tip">
              Can only upload JPEG, PNG, or GIF picture
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="\">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="checkUsers">Register</el-button>
        <el-button @click="returnPage">Return</el-button>
      </el-form-item>
    </el-form>
    <br>
  </div>
</template>

<script>
import {h} from "vue";

export default {
  name: "Register.vue",
  data() {
    return {
      dialogImageUrl:'',
      dialogVisible: false,
      activeIndex: '1',
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      loading: false,
      userId: null,
      token: null,
      error: "",
      errorFlag: false,
      pwdFlag: false,
      imageUrl: '',
      icon1: 'el-icon-view',
      icon2: 'el-icon-minus',
      uploadDisabled:false,
    }
  },
  methods: {
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
    changePassword() {
      this.pwdFlag = !this.pwdFlag;
    },
    checkUsers: async function() {
      if (this.password.length < 8) {
        this.$message({
          type: 'error',
          message: h('i', {style: 'color: teal'}, 'Password must be at least 8 characters!')
        });
      } else {
        await this.axios.post('http://localhost:4941/api/v1/users/register', {"firstName": this.firstName, "lastName": this.lastName,
          "email": this.email, "password": this.password})
            .then((response) => {
              this.userId = response.data.userId;
              this.loginUsers();
              // this.putImage();
            }, (error) => {
              this.error = error.response.statusText.slice(13,error.response.statusText.length-1);
              this.errorFlag = true;
            });
      }

    },
    loginUsers() {
      this.axios.post('http://localhost:4941/api/v1/users/login', {"email": this.email, "password": this.password})
          .then((response) => {
            sessionStorage.setItem("userId", response.data.userId);
            this.userId = response.data.userId
            sessionStorage.setItem("token", response.data.token);
            this.token = response.data.token;
            this.putImage();
            this.$router.push("/users/my");
          }, (error) => {
            this.error = error.response.statusText.slice(13,error.response.statusText.length-1);
            this.errorFlag = true;
          });
    },
    putImage() {
      this.axios.put("http://localhost:4941/api/v1/users/"+this.userId+"/image", this.imageUrl,
          {headers: {"X-Authorization": sessionStorage.getItem("token"), "Content-Type": this.imageUrl.type}})
          .then(() => {
            // this.$router.push("/users/my");
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    returnPage() {
      this.$router.push("/");
    },
    // handleAvatarSuccess(res, file) {
    //   this.$message({
    //     type: 'success',
    //     message: `Success`
    //   });
    //
    //   console.log(this.imageUrl)
    // },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif';
      if (!isJPG) {
        this.$message.error("Can only upload JPEG, PNG, or GIF picture!");
      }
      return isJPG;
    },
    open() {
      this.$alert(this.error, 'Register Fail', {
        confirmButtonText: 'OK',
      });
    },
    handleChange(file,fileList){
      this.imageUrl = file.raw;
      if(fileList.length >= 1){
        this.uploadDisabled = true;
      }
    },
    handleRemove() {
      this.uploadDisabled = false
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style scoped>
.hide /deep/ .el-upload--picture-card {
  display: none;
}
.register {
  margin-top: 50px;
  display: inline-block;
}
</style>
