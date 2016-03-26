import React, { Component, PropTypes } from 'react'

import { title }   from 'react-isomorphic-render'
import { preload } from 'react-isomorphic-render/redux'
import styler      from 'react-styling'
import { connect } from 'react-redux'

import { bindActionCreators as bind_action_creators } from 'redux'

import { get as get_users, add as add_user, remove as delete_user, upload_picture } from '../../actions/example users'

import Button from '../../components/button'

@preload((dispatch, get_model) => dispatch(get_users()))
@connect
(
	model => 
	({
		users         : model.users.users,
		loading       : model.users.loading,
		loaded        : model.users.loaded,
		loading_error : model.users.loading_error,
		adding_error  : model.users.adding_error,

		uploading_picture       : model.users.uploading_picture,
		uploading_picture_error : model.users.uploading_picture_error
	}),
	dispatch => bind_action_creators
	({
		get_users, 
		add_user, 
		delete_user, 
		upload_picture
	},
	dispatch)
)
export default class Page extends Component
{
	state = {}

	static propTypes =
	{
		get_users     : PropTypes.func.isRequired,
		add_user      : PropTypes.func.isRequired,
		delete_user   : PropTypes.func.isRequired,
		users         : PropTypes.array.isRequired,
		loading       : PropTypes.bool,
		loaded        : PropTypes.bool,
		loading_error : PropTypes.object,
		adding_error  : PropTypes.object,

		uploading_picture       : PropTypes.bool,
		uploading_picture_error : PropTypes.object
	}

	static contextTypes =
	{
		store : PropTypes.object.isRequired
	}

	constructor(props)
	{
		super(props)

		this.refresh     = this.refresh.bind(this)
		this.add_user    = this.add_user.bind(this)
		this.delete_user = this.delete_user.bind(this)

		this.on_picture_file_selected = this.on_picture_file_selected.bind(this)
	}

	componentDidMount()
	{
		// to do: remove second loading here for client-side navigation
		// to do: remove loading here for server-side rendered page
		// if (window.client_side_routing)
		// {
		// 	this.constructor.preload(this.context.store)
		// }
	}

	render()
	{
		const { error, loaded, users } = this.props

		const markup = 
		(
			<section>
				{title("Simple REST API example")}

				<div style={style.container}>
					<p>This is an example of REST API usage with no database persistence (Javascript is required for this particular example)</p>

					{this.render_users(error, loaded, users)}
				</div>
			</section>
		)

		return markup
	}

	render_users(error, loaded, users)
	{
		if (error)
		{
			const markup = 
			(
				<div style={style.users}>
					{'Failed to load the list of users'}

					{/* error.stack || error */}

					<button onClick={this.refresh} style={style.users.refresh}>Try again</button>
				</div>
			)

			return markup
		}

		if (!loaded)
		{
			return <div style={style.users}>Loading users</div>
		}

		if (users.is_empty())
		{
			const markup = 
			(
				<div style={style.users}>
					No users

					<Button action={this.add_user} style={style.users.add}>Add user</Button>

					<Button action={this.refresh} busy={this.state.refreshing} style={style.users.refresh}>Refresh</Button>
				</div>
			)

			return markup
		}

		const no_user_picture = require('../../../../assets/images/no user picture.png')

		const markup = 
		(
			<div style={style.users}>
				<span style={style.users.list.title}>Users</span>

				<button onClick={this.add_user} style={style.users.add}>Add user</button>
				
				<button onClick={this.refresh} style={style.users.refresh}>Refresh</button>

				<div>
					<ul style={style.users.list}>
						{users.map((user, i) =>
						{
							return <li key={user.id}>
								<span style={style.user.id}>{user.id}</span>

								<img style={style.user.picture} src={user.picture ? `/storage/images/${user.picture.sizes[0].name}` : no_user_picture}/>

								<span style={style.user.name}>{user.name}</span>

								<input
									type="file"
									ref={`upload_picture_${i}`}
									style={style.users.upload_picture_input}
									onChange={event => this.on_picture_file_selected(event, user.id)}/>

								<Button 
									busy={this.props.uploading_picture} 
									action={event => this.refs[`upload_picture_${i}`].click()} 
									style={style.users.upload_picture}>

									upload picture
								</Button>

								<Button
									busy={this.props.deleting}
									action={event => this.delete_user(user.id)}
									style={style.users.delete}>

									delete user
								</Button>
							</li>
						})}
					</ul>
				</div>
			</div>
		)

		return markup
	}

	async refresh()
	{
		this.setState({ refreshing: true })
		
		try
		{
			await this.props.get_users()
		}
		catch (error)
		{
			alert('Error refreshing users')
		}
		finally
		{
			this.setState({ refreshing: false })
		}
	}

	async add_user()
	{
		const name = prompt(`Enter user's name`)
		
		if (!name)
		{
			return
		}

		try
		{
			await this.props.add_user({ name: name })
			this.refresh()
		}
		catch (error)
		{
			alert('Error adding user')
		}
	}

	async delete_user(id)
	{
		try
		{
			await this.props.delete_user(id)
			this.refresh()
		}
		catch (error)
		{
			alert('Error deleting user')
		}
	}

	on_picture_file_selected(event, user_id)
	{
		const file = event.target.files[0]
		this.upload_picture(file, user_id)

		// reset the selected file 
		// so that onChange would trigger again 
		// even with the same file
		event.target.value = null
	}

	async upload_picture(file, user_id)
	{
		const data = new FormData()

		data.append('file', file)

		try
		{
			await this.props.upload_picture(user_id, data)
		}
		catch (error)
		{
			alert('DEBUG: Image upload failed. Make sure you have ImageMagick installed.')
		}
	}
}

const style = styler
`
	container

	users
		margin-top : 2em

		list
			display         : inline-block
			list-style-type : none
			padding-left    : 1em

			title
				font-weight : bold

		refresh
			margin-left : 1em

		add
			margin-left : 1em

		delete
			margin-left : 1em

		upload_picture
			margin-left    : 1em
			vertical-align : bottom

		upload_picture_input
			display : none

	user
		id
			color        : #9f9f9f

		name
			margin-left : 0.3em

		picture
			width  : 1em
			height : 1em

			margin-bottom  : 0.05em
			margin-left    : 0.3em

			border : 1px solid #9f9f9f

			vertical-align : bottom
`