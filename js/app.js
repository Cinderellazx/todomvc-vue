(function (window, Vue, undefined) {

	const list = [{
			id: 1,
			content: 'abc',
			isFinish: true
		},
		{
			id: 2,
			content: 'abc',
			isFinish: false
		},
		{
			id: 3,
			content: 'abc',
			isFinish: true
		}
	]
	new Vue({
		el: '#app',
		data: {
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || list,
			content: '',
			// checked: this.activeNum
			beforeUpdate: {},
			showArr: [],
			activeBtn: 1

		},
		computed: {
			activeNum() {
				return this.dataList.filter((item) => {
					return item.isFinish === false
				}).length
			},


			// 重点
			toggleAll: {
				get() {
					return this.dataList.every((item) => item.isFinish)
				},

				set(val) {
					this.dataList.forEach((item) => item.isFinish = val)
				}
			}
		},
		methods: {
			// 添加
			addItem() {
				if (!this.content.trim()) {
					return;
				}
				this.dataList.unshift({
					content: this.content.trim(),
					isFinish: false,
					id: this.dataList.sort((a, b) => {
						return a.id - b.id
					})[this.dataList.length - 1]['id'] + 1
				});
				this.content = '';
			},

			// 删除单条（根据索引）
			delItem(index) {
				this.dataList.splice(index, 1);
			},

			delAll() {
				this.dataList = this.dataList.filter((item) => {
					return item.isFinish === false
				})

			},

			showEdit(index) {
				this.$refs.show.forEach((item) => item.classList.remove('editing'));

				this.$refs.show[index].classList.add('editing');

				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]));
			},

			updateItem(index) {
				if (!this.dataList[index].content.trim()) {
					return this.dataList.splice(index, 1)
				}
				if (this.dataList[index].content.trim() !== this.beforeUpdate.content) {
					this.dataList[index].isFinish = false
				}
				this.$refs.show[index].classList.remove('editing');
				this.beforeUpdate = {};
			},

			backItem(index) {
				this.dataList[index].content = this.beforeUpdate.content;
				this.$refs.show[index].classList.remove('editing');
				this.beforeUpdate = {};
			},

			hashChange() {
				switch (window.location.hash) {
					case '#/':
					case '':
						this.showAll();
						this.activeBtn = 1;
						break;
					case '#/completed':
						this.activeAll(true);
						this.activeBtn = 3;
						break;
					case '#/active':
						this.activeAll(false);
						this.activeBtn = 2;
						break;
				}
			},

			showAll() {
				this.showArr = this.dataList.map(() => true);
			},

			activeAll(boo) {
				this.showArr = this.dataList.map((item) => item.isFinish === boo);

				if (this.dataList.every((item) => item.isFinish === !boo)) {
					return window.location.hash = '#/';
				}
			}
		},
		// 监听data中的数据
		watch: {
			dataList: {
				handler(newArr, oldArr) {
					window.localStorage.setItem('dataList', JSON.stringify(newArr));
				},
				// 深度监听，可以监听到对象内属性值发生改变。
				deep: true
			}

		},
		// 自定义指令
		directives: {
			focus: {
				inserted(el) {
					el.focus();
				}
			}
		},

		created() {
			this.hashChange();

			window.onhashchange = () => {
				this.hashChange();
			}
		}

	})

})(window, Vue);
