<template>
	<div class="post">
		<h2 class="sub-title">New Post</h2>
		<div class="result" v-if="result">{{ result }}</div>
		<div class="form">
			<dl>
				<dt><label for="word">単語</label></dt>
				<dd><input type="text" v-model="name" name="word" id="word" /></dd>
			</dl>
			<dl>
				<dt><label for="kana">かな</label></dt>
				<dd><input type="text" v-model="kana" name="kana" id="kana" /></dd>
			</dl>
			<dl>
				<dt><label for="detail">詳細</label></dt>
				<dd><textarea v-model="detail" name="detail" id="detail"></textarea></dd>
			</dl>
			<button v-on:click="addTodo">Add</button>
		</div>
		<button @click="logout" class="logout">ログアウト</button>
	</div>
</template>

<script>
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import "firebase/compat/auth"

export default {
	name: 'PostView',
	data: function () {
		return {
			db: null,
			name: '',
			kana: '',
			detail: '',
			result: ''
		}
	},
	mounted(){
		let self = this;
		firebase.auth().onAuthStateChanged(function(user) {
			if (!user) {
				self.$router.push({name: 'signin', params: {logoutText: "ログアウトしました"}}).catch(()=>{})
			}
		})
	},
	created: function() {
		this.db = firebase.firestore()
	},
	methods: {
		logout: function () {
			firebase.auth().signOut()
		},
		addTodo: function () {
			const self = this;
			const checkVal = [self.name,self.kana,self.detail];
			if(!checkVal.includes('')){
				self.db.collection('words').add({
				name: self.name,
				kana: self.kana,
				detail: self.detail
				})
				.then(() => {
					self.name = '',
					self.kana = '',
					self.detail = '',
					self.result = '登録に成功しました'
				})
			}else{
				self.result = '未入力項目があります'
			}
		}
	}
}
</script>

<style scoped lang="scss">
	.logout{
		margin: 20px auto 0;
        background: $primary-sub;
        color: $primary-point;
        display: block;
        width: 100%;
        line-height: 40px;
        letter-spacing: 0.2em;
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 3px 0 $primary-point;
        max-width:200px;
        &:hover{
            color: $primary-bg;
            background: $primary-point;
            box-shadow: 0 3px 0 $primary-sub; 
        }
	}
</style>