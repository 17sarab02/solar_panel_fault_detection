import React from 'react'

export default class Status extends React.Component{
  render(){
    return (
      <div className='Status'>
        <h4>
        {
          this.props.webCamRunning
            ?this.props.connectionEstablishing
              ?'Loading...'
              :(this.props.connectionEstablished)
                ?`Connection established with ${this.props.ourEndPoint}`
                :'No connection has been established'
            :'Video Stream has not started yet'
        }
        </h4>
      </div>
    );
  }
}