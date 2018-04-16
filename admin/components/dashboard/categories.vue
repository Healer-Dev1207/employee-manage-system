<template>
    <div>
			<v-row>
				<v-col>
					<h2> Categories </h2>
				</v-col>
				<v-dialog max-width="600px" v-model="dialog">
					<template v-slot:activator="{ on, attrs }">
						<v-btn 
							fab 
							outlined 
							small 
							color="mainpurple" 
							class="mt-2 mr-6" 
							@click="dialog = true"
							v-on="on"
							v-bind="attrs"
						>
							<v-icon>
								mdi-tab-plus
							</v-icon>
						</v-btn>
					</template>
					<v-card>
						<v-container>
							<v-card-title>
								<h3> Add Category </h3>
							</v-card-title>
							<v-card-text>
								<v-form ref="form">
										<v-text-field
											color="mainpurple"
											label="Category" 
											v-model="category"
										>
										</v-text-field>
										<v-row justify="end">
											<v-btn text class="mainpurple mr-10 mt-3 white--text text-capitalize" @click="submit" >Submit</v-btn>
										</v-row>
								</v-form>
							</v-card-text>
						</v-container>
					</v-card>
				</v-dialog>
			</v-row>
			
			
			<v-divider></v-divider>
			<v-card outlined class="mt-3" color="mainpurple">
				<div v-for="(item, i) in items" :key="i">
					<v-row class="pa-4 pt-2">
						<v-col>
							<h3 class="white--text"> {{item}} </h3>
						</v-col>
						<v-btn
							color="white"
							class="mt-3 mr-4 "
							fab
							small
							@click="deleteCtg(item)"
						>
							<v-icon color="error" medium>
							mdi-delete
							</v-icon>
						</v-btn>
						
					</v-row>
					<v-divider dark class="mb-2 mt-n2"></v-divider>
				</div>
			</v-card>
			<v-snackbar
			v-model="snackbar"
			:timeout="4000"
			:color="snackbarColor"
			top
			>
			{{message}}
			<template v-slot:action="{ attrs }">
				<v-btn
				fab
				color="white"
				x-small
				v-bind="attrs"
				@click="snackbar = false"
				>
					<v-icon
					color="error"
					size=23>
						mdi-close-box
					</v-icon>
				</v-btn>
			</template>
			</v-snackbar>
    </div>
</template>


<script>
export default {

		// TODO: Change chart code to modift catgs

    data() {
			return {
				message: null,
				snackbarColor: 'false',
				snackbar: false,
				dialog: false,
				category: null,
				items: [
					...this.$auth.user.categories
				]
			}
		},

	methods: {
		async submit() {
			try {
				this.dialog = false
				let data = await this.$axios.$post('admin/category/add', {
					category: this.category
				})
				this.items.push(this.category)
				this.category = null
				this.message = data.message
				this.snackbarColor = '#73cfa6'
				this.snackbar = true
			} catch(err) {
				if(err.response){
					this.message = err.response.data.error
					this.snackbarColor = 'error'
					this.snackbar = true
				}
			}
		},

		async deleteCtg(item) {
			try {
				this.dialog = false
				let data = await this.$axios.$post('admin/category/delete', {
					category: item
				})
				this.items = this.items.filter(i => i != item)
				this.message = data.message
				this.snackbarColor = '#73cfa6'
				this.snackbar = true
			} catch {
				if(err.response){
					this.message = err.response.data.error
					this.snackbarColor = 'error'
					this.snackbar = true
				}
			}
		}
	}
}
</script>
