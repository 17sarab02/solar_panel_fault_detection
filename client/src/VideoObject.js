import './video.css'
import React from 'react'
import Status from './Status';
import io from 'socket.io-client';

const ourEndPoint = 'http://127.0.0.1:5500'

export default class VideoObject extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      webCamRunning: false,
      connectionEstablishing: false,
      connectionEstablished: false,
      requestTimer: 1000
    }
    this.videoRef = React.createRef(null)
    this.photoRef = React.createRef(null)
  }

  getVideo = ()=>{
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 512,
        height: 512
      }
    }).then(stream=>{
      let video = this.videoRef.current
      video.srcObject = stream
      video.play()
    }).catch(err=>{
      console.log("Couldn't get WebCam Feed")
    })
  }

  capSnap = ()=>{
    const width = 512
    const height = 512

    let video = this.videoRef.current
    let photo = this.photoRef.current

    photo.width = width
    photo.height = height

    let contextObj = photo.getContext('2d')

    contextObj.drawImage(video, 0, 0, width, height)

    let dataUrl = photo.toDataURL('image/jpeg');

    if (this.socket && this.state.connectionEstablished && this.state.webCamRunning) {
      this.socket.emit('classifyImage', dataUrl);
    }
  }

  startCam = ()=>{
    this.setState({webCamRunning: true})
    this.getVideo()
    this.intervalId = setInterval(this.capSnap, this.state.requestTimer);
  }

  connectToServer = ()=>{
    this.setState({connectionEstablishing: true})

    this.socket = io(ourEndPoint);

    setTimeout(()=>{
      if(!this.state.connectionEstablished)
        this.setState({connectionEstablishing: false})
    }, 10000)

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.setState({ connectionEstablishing: false, connectionEstablished: true });
    });

    this.socket.on('classificationResult', (data) => {
      this.props.updateVector(data)
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.setState({ connectionEstablished: false });
      this.props.updateVector([0, 0, 0, 0, 0])
      this.socket.disconnect()
    });
  }

  disconnectFromServer = ()=>{
    if (this.socket) {
      this.socket.disconnect();
    }
    this.props.updateVector([0, 0, 0, 0, 0])
    this.setState({connectionEstablished: false})
  }

  render(){
    return (
      <div className='VideoContainer'>
      <div className='VideoObject'>
        <div className='VideoBox'>
          <video ref={this.videoRef}></video>
          {this.state.connectionEstablished&&<div className='swipeUp'></div>}
        </div>
        {this.state.webCamRunning&&<canvas onClick={this.capSnap} ref={this.photoRef}></canvas>}
        {!this.state.webCamRunning&&<button className='WebCamButton' onClick={this.startCam} style={{background: 'green'}}>Start Cam</button>}
        {this.state.webCamRunning&&(!this.state.connectionEstablished)&&<button className='ConnectButton' onClick={this.connectToServer} style={{background: 'green'}} disabled={this.state.connectionEstablishing}>Establish Connection</button>}
        {this.state.webCamRunning&&(this.state.connectionEstablished)&&<button className='ConnectButton' onClick={this.disconnectFromServer} style={{background: 'red'}}>Stop Connection</button>}
        <Status ourEndPoint={ourEndPoint} connectionEstablishing={this.state.connectionEstablishing} connectionEstablished={this.state.connectionEstablished} webCamRunning={this.state.webCamRunning}></Status>
      </div>
      </div>
    );
  }
}