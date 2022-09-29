import React from "react";
import GoogleMapReact from 'google-map-react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { config } from '../../../../util/Config';

const AnyReactComponent = () => (
	<LocationOnIcon
		style={{color: "red"}}
	/>
);


const GoogleMap = ({ location }) => {
	const zoom = 5;
	const center = {
		lat: -12.048479680972587, 
		lng: -77.06454052172292
	}

	const createMapOptions = () => {
		return {
			panControl: false,
			mapTypeControl: true,
			scrollwheel: false,
			styles: [{ stylers: [{ 'saturation': 0 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
		}
	}
	  
	return (
		// Important! Always set the container height explicitly
		<div style={{ height: '60vh', width: '100%' }}>
			{
				location
				?
				<GoogleMapReact
					bootstrapURLKeys={{ key: config.key_google_map }}
					defaultCenter = {center}
					zoom={zoom}
					yesIWantToUseGoogleMapApiInternals
				>
					<AnyReactComponent
						lat={location.lat}
						lng={location.lng}	
						text = 'Es la ubicación donde marcó la asistencia el docente'
					/>
				</GoogleMapReact>
				:
				<></>
			}
			
		</div>
	);
}
export default GoogleMap;
