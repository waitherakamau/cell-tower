import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const Branches = [
    {
        "BranchCode": "1",
        "BranchName": "GSM_1",
        "location": { "lat": -0.127716, "lng": 34.777908 }
    },
    {
        "BranchCode": "2",
        "BranchName": "GSM_2, Range: 2796m",
        "location": { "lat": -0.07576 , "lng": 34.78157      }
    },
    {
        "BranchCode": "3",
        "BranchName": "GSM_3, Range: 1000m",
        "location": { "lat": -1.218795776, "lng": 36.85569763      }
    }
]
 
export class MapContainer extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        }
    }
     
      onMarkerClick = (props, marker, e) =>
        this.setState({
          selectedPlace: props,
          activeMarker: marker,
          showingInfoWindow: true
        });
     
      onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          })
        }
      };
    
  render() {
    const coords = { "lat": -0.127716, "lng": 34.777908 };
    return (
      <Map 
        initialCenter={coords}
        google={this.props.google} 
        zoom={13}
        style={{width: '45%', height: '100%'}}
        onClick={this.onMapClicked}
      >
 
        {
            Branches.map((branch, index) => {
                if(branch.location){
                    return (
                        <Marker
                            key = {index}
                            name={branch.BranchName}
                            onClick={this.onMarkerClick}
                            position={branch.location} />
                    )
                }
            })
        }
        
 
        <InfoWindow  marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow} 
          onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ("AIzaSyDm4iTNrhxUBgnK1qhVxUXgSCRFX2ziu2U")
})(MapContainer)