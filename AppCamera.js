import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import { RNCamera } from "react-native-camera";
let { width, height } = Dimensions.get("window");
function px2dp(num) {
  return PixelRatio.roundToNearestPixel(num);
}
const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "lightgreen",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Text>Waiting</Text>
  </View>
);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: "",
      moveAnim: new Animated.Value(0)
    };
  }

  startAnimation = () => {
    this.state.moveAnim.setValue(0);
    Animated.timing(this.state.moveAnim, {
      toValue: -300,
      duration: 4000,
      easing: Easing.linear
    }).start(() => this.startAnimation());
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={"Permission to use camera"}
          permissionDialogMessage={
            "We need your permission to use your camera phone"
          }
          onBarCodeRead={e => {
            console.log(e);
            console.log((Date.now() - this.state.time) / 1000);
          }}
        >
          {({ camera, status }) => {
            if (status !== "READY") return <PendingView />;
            return (
              <View style={styles.rectangleContainer}>
                <View
                  style={{ height: (height - 300) / 2,   backgroundColor: "#333333bf" }}
                />
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      height: 302,
                      width: (width - 300) / 2,
                      backgroundColor: "#333333bf"
                    }}
                  />
                  <View>
                    <View style={styles.rectangle} />
                    <Animated.View
                      style={[
                        styles.border,
                        { transform: [{ translateY: this.state.moveAnim }] }
                      ]}
                    />
                  </View>

                  <View
                    style={{
                      height: 302,
                      width: (width - 300) / 2,
                      backgroundColor: "#333333bf"
                    }}
                  />
                </View>
                <View
                  style={{ height: (height - 300) / 2,  backgroundColor: "#333333bf" }}
                >
                  <Text style={styles.rectangleText}>
                    将二维码放入框内，即可自动扫描
                  </Text>
                </View>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }

  takePicture = async function(camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    console.log(data.uri);
  };
  componentDidMount() {
    this.startAnimation();
    this.setState(
      {
        time: Date.now()
      },
      () => {
        console.log(this.state.time);
      }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  },
  rectangleContainer: {
    flex: 1,
    width: width,
    position: "absolute",
    height: height,
    left: 0,
    right: 0,
  },
  rectangle: {
    height: 300,
    width: 300,
    borderWidth: 1,
    borderColor: "#00FF00",
    backgroundColor: "transparent"
  },
  rectangleText: {
    flex: 0,
    color: "#fff",
    marginTop: 10,
    textAlign:'center'
  },
  border: {
    flex: 0,
    width: 300,
    height: 2,
    backgroundColor: "#00FF00"
  }
});
