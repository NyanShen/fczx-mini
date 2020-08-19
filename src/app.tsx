import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configStore from './store'
import './app.scss'

const store = configStore();

class App extends Component {

  render() {
    return (
      <Provider store={store} >
        {this.props.children}
      </Provider>
    )
  }
}

export default App
