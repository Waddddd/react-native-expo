import React,{ useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions';
import Toolbar from './toolbar.component';
import Gallery from './gallery.component';
import styles from './styles';

const CameraPage = () => {
    cam = null;
    const [captures, setCaptures] = useState([]);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [capturing, setCapturing] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back) ;
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    handleCaptureIn = () => setCapturing(true);
    handleCaptureOut = () => {
        if (capturing) 
            cam.stopRecording();
    };
    handleShortCapture = async () => {
        const photoData = await cam.takePictureAsync();
        setCapturing(false);
        setCaptures([photoData, ...captures]);
    };
    handleLongCapture = async () => {
        const videoData = await cam.recordAsync();
        setCapturing(false);
        setCaptures([videoData, ...captures]);
    };

    useEffect(()=>{
        const handlePermission = async() => {
            const camera = await Permissions.askAsync(Permissions.CAMERA);
            const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

            setHasCameraPermission({ hasCameraPermission });
        }
        handlePermission();
    },[]);
  
    if (hasCameraPermission === null) {
        return <View />;
    } else if (hasCameraPermission === false) {
        return <Text>Access to camera has been denied.</Text>;
    }
        
    return (
        <React.Fragment>
        <View>
            <Camera
                type = {cameraType}
                flashMode = {flashMode}
                style = {styles.preview}
                ref = {camera => cam = camera}
            />
        </View>
        {captures.length > 0 && <Gallery captures={captures}/>}
        <Toolbar
            capturing={capturing}
            flashMode={flashMode}
            cameraType={cameraType}
            setFlashMode={setFlashMode}
            setCameraType={setCameraType}
            onCaptureIn={handleCaptureIn}
            onCaptureOut={handleCaptureOut}
            onLongCapture={handleLongCapture}
            onShortCapture={handleShortCapture}
        />
        </React.Fragment>
    )
}

export default CameraPage;