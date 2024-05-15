import './App.css'
import React from 'react'
import VideoObject from './VideoObject'
import Predictions from './Predictions'

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      predictionVector: [0, 0, 0, 0, 0, 0]
    }
  }

  updateVector = (newVector) => {
    this.setState({predictionVector: newVector });
  }

  render(){
    return (
      <div className='App'>
        <h1 className='MainTitle'>Solar Panel Fault Detection</h1>
        <VideoObject updateVector={this.updateVector} />
        <Predictions predictionVector={this.state.predictionVector}></Predictions>
      </div>
    );
  }
}