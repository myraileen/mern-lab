import React from "react";
import "./App.css";

import Users from "./Users";
// import User from "./User";
import UserDetail from "./UserDetail";
import NewUserForm from "./NewUserForm";

import axios from "axios";
import { Route, Link, Redirect, Switch, withRouter } from "react-router-dom";

const backendUrl = "http://localhost:8080/api/users/";

class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      users: [],
      newUserName: "",
      newUserEmail: "",
      newTodoDescription: "" 
    };	
  }

  componentDidMount() {
    this.getUsersAxios();
  }

  getUsersAxios() {
    axios({ method: "GET", url: backendUrl }).then(users =>
      this.setState({ users: users.data })
    );
  }

  createUserAxios() {
    axios({
      method: "POST",
      url: backendUrl,
      data: {
        name: this.state.newUserName,
        email: this.state.newUserEmail
      }
    }).then(newUser => {
      console.log(newUser);
      this.setState(prevState => ({
        users: [...prevState.users, newUser.data]
      }));
    });
  }

  deleteAxiosUser = event => {
    event.preventDefault();

    axios({
      method: "DELETE",
      url: `${backendUrl}${event.target.id}`
    }).then(deletedUser => {
      this.getUsersAxios();
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.createUserAxios();
  };

  handleChange = event => {
    console.log(event.target.value)
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleNewTodoSubmit = event => {
    console.log(event.target.id)
    event.preventDefault();
    axios({
      method: "POST",
      url: `${backendUrl}${event.target.id}/new-todo/`,
      data: {
        description: this.state.newTodoDescription
      }
      //there is a more efficient way...
    }).then(newUser => {
      console.log(newUser)
      this.setState({newTodoDescription: ''});
      this.getUsersAxios();
      //without this line... the page would need to be manually refreshed.
      //this line is causing the page to be remounted... 
      //there is a more efficient way to do this
      this.props.history.push(`/users/${newUser.data._id}`);
    });
  }

  toggleDone = event => {
    event.preventDefault();
    let todoId = event.target.getAttribute('data-todo-id');
    axios({
      method: "PUT",
      url: `${backendUrl}${event.target.id}/update-todo/${todoId}`,
    }).then(user => {
      this.getUsersAxios();
      this.props.history.push(`/users/${user.data._id}`)
    });
  };


  render() {
    return (
      <div className='App'>
        <nav>
          <Link to='/'>All Users</Link>
          <Link to='/new-user-form'>New User Form</Link>
        </nav>
        <Switch>
          <Route
            exact
            path='/'
            render={routerProps => (
              <Users
                users={this.state.users}
                handleDelete={this.deleteAxiosUser}
              />
            )}
          />
          <Route
            path='/users/:id'
            render={routerProps => (
              <UserDetail {...routerProps} users={this.state.users}
              newTodoDescription={this.state.newTodoDescription}
              handleChange={this.handleChange}
              handleNewTodoSubmit={this.handleNewTodoSubmit} 
              toggleDone={this.toggleDone}/>
            )}
          />
          <Route
            path='/new-user-form'
            render={() => (
              <NewUserForm
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
              />
            )}
          />
          <Route path='/*' render={() => <Redirect to='/' />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
