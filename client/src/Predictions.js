import './predictions.css'
import React from 'react'


const totalWidth = 300

export default class Predictions extends React.Component{
  render(){
    return (
      <div className='PredictionContainer'>
      <div className='PredictionBox'>
        <h2>Predictions</h2>
        <div className='PredictionBar'>
          <h3>{`Bird Drop ${Math.round(this.props.predictionVector[0]*100)} %`}</h3>
          <div className='BarTrace'></div>
          <div className='ActualBar' style={{width: `${this.props.predictionVector[0]*totalWidth}px`}}></div>
        </div>
        <div className='PredictionBar'>
          <h3>{`Clean ${Math.round(this.props.predictionVector[1]*100)} %`}</h3>
          <div className='BarTrace'></div>
          <div className='ActualBar' style={{width: `${this.props.predictionVector[1  ]*totalWidth}px`}}></div>
        </div>
        <div className='PredictionBar'>
          <h3>{`Dirty ${Math.round(this.props.predictionVector[2]*100)} %`}</h3>
          <div className='BarTrace'></div>
          <div className='ActualBar' style={{width: `${this.props.predictionVector[2]*totalWidth}px`}}></div>
        </div>
        <div className='PredictionBar'>
          <h3>{`Electrical Damage ${Math.round(this.props.predictionVector[3]*100)} %`}</h3>
          <div className='BarTrace'></div>
          <div className='ActualBar' style={{width: `${this.props.predictionVector[3]*totalWidth}px`}}></div>
        </div>
        <div className='PredictionBar'>
          <h3>{`Physical Damage ${Math.round(this.props.predictionVector[5]*100)} %`}</h3>
          <div className='BarTrace'></div>
          <div className='ActualBar' style={{width: `${this.props.predictionVector[5]*totalWidth}px`}}></div>
        </div>
        <div className='PredictionBar'>
          <h3>{`No Panel ${Math.round(this.props.predictionVector[4]*100)} %`}</h3>
          <div className='BarTrace'></div>
          <div className='ActualBar' style={{width: `${this.props.predictionVector[4]*totalWidth}px`}}></div>
        </div>
      </div>
      </div>
    );
  }
}