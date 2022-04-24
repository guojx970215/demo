import React, { Component } from "react";
import ReactDOM from 'react-dom'
import L from "leaflet";
import domtoimage from "dom-to-image-more";

//import "leaflet/dist/leaflet.js";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";
import "leaflet-routing-machine/dist/leaflet.routing.icons.png";
//import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
//import "leaflet-control-geocoder";
//import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.js";
//import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import ELG from "esri-leaflet-geocoder";
import LRM from "leaflet-routing-machine";
import './MyLeaflet.css'
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png"
});

class MyLeaflet extends Component {
  constructor(props) { 
    super(props)
    this.map = React.createRef();
   
    this.saveLeafletMap = this.saveLeafletMap.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      // San Jose
      lat: 37.334789,
      lng: -121.888138,
      zoom: 13,
      saveClick:false
    }
  }
  

  componentDidMount() {
    
     this.control = L.Routing.control({
      waypoints: [
        L.latLng(38.7436056, -9.2304153),
        L.latLng(38.5334477, -0.1312811)
      ],
      router: new L.Routing.osrmv1({
        language: "en",
        profile: "car"
      }),
      geocoder: L.Control.Geocoder.nominatim({})
    }).addTo(this.map.current.leafletElement);
    this.setState({
      lat: 38.7436056,
      lng: -9.2304153,
    })
  }
  handleClick = (e) => {
    const map = this.map.current
    console.log('this.map1',map)
    this.setState({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    })
  }
  saveLeafletMap() { 
    if (this.state.saveClick) { return }
    this.setState({
      saveClick:true
    })
    let leafletDom = ReactDOM.findDOMNode(this.map.current)
    // this.control.hide()
    let leafletControl = leafletDom.getElementsByClassName('leaflet-control-container')
    leafletControl && (leafletControl[0].style.display = 'none')
    
    domtoimage.toJpeg(leafletDom, {
      width: leafletDom.clientWidth,
      height:leafletDom.clientHeight
    })
    .then(dataUrl => {
      this.props.onSaveMap(dataUrl)
    });
   
  }
  render() {
    const position = [this.state.lat, this.state.lng];
   
    return (
      <div style={{padding:'45px'}}>
        <Map
          className="my-map"
          center={position}
          zoom={this.state.zoom}
          onClick={this.handleClick}
          ref={this.map}
        >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </Map>
        <div className="leaflet-footer">
          <div className="leaflet-button leaflet-confirm" onClick={this.saveLeafletMap}>{this.state.saveClick?'处理中...':'保存'}</div>
          <div className="leaflet-button leaflet-cancel" onClick={this.props.closeDialog}>取消</div>
        </div>
        </div>
    );
  }
}
export default MyLeaflet;
