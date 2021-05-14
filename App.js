// import React, { useState, useEffect, useRef } from 'react';
// // import React from 'react';
// import {
//   StyleSheet,
//   useColorScheme,
//   Text,
//   ToastAndroid,
//   BackHandler,
// } from 'react-native';
// import { WebView } from 'react-native-webview';

// const App = () => {
//   const [backButtonEnabled, setBackButtonEnabled] = useState(false);
//   const [clicked, setClicked] = useState(false);
//   const webViewEl = useRef(null);

//   useEffect(() => {
//     setClicked(false);
//     console.log(333333333, Platform.OS)
//     if (Platform.OS === 'android') {
//       BackHandler.addEventListener('hardwareBackPress', onBackAndroid);
//     } 
//   }, []);

//   // const isDarkMode = useColorScheme() === 'dark';

//   // const backgroundStyle = {
//   //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   // };

//   const onNavigationStateChange = navState => {
//     console.log('1111111', navState.canGoBack)
//     // ToastAndroid.show(navState.canGoBack)
//     setBackButtonEnabled(navState.canGoBack);
//   };

//   const onBackAndroid = () => {
//     console.log(2222, backButtonEnabled)
//     if (backButtonEnabled) {
//       console.log(6666);
//       webViewEl.current.goBack();
//       return true;
//     } else {
//       console.log(77777777)
//       if (clicked) {
//         //点过一次了。
//         console.log('back')
//         return false;
//       }
//       setClicked(true);
//       ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
//       return true;
//     }
//   };
  
//   return <WebView
//     ref={webViewEl}
//     onNavigationStateChange={onNavigationStateChange}
//     source={{ uri: 'http://www.baidu.com' }} />
//   // return <WebView source={{ uri: 'http://10.45.24.54:3000/' }} />

// };

// // const styles = StyleSheet.create({
// //   sectionContainer: {
// //     marginTop: 32,
// //     paddingHorizontal: 24,
// //   },
// //   sectionTitle: {
// //     fontSize: 24,
// //     fontWeight: '600',
// //   },
// //   sectionDescription: {
// //     marginTop: 8,
// //     fontSize: 18,
// //     fontWeight: '400',
// //   },
// //   highlight: {
// //     fontWeight: '700',
// //   },
// // });

// export default App;


import React, { Component } from 'react';
// import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  Text,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';

class App extends Component {
  constructor(props) {
    super(props);
    this.backButtonEnabled = false;
    this.clicked = false;
  }

  componentDidMount() {
    this.clicked = false;
    console.log(333333333, Platform.OS)
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    } 
  }

  componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onNavigationStateChange = navState => {
    console.log('1111111', navState.canGoBack)
    this.backButtonEnabled = navState.canGoBack;
  };

  onBackAndroid = () => {
    // const lastUrl = window.location;
    console.log('22222',this.refs['mainWebView'].location);
    // console.log('this.clicked', this.clicked)
    
    if (this.backButtonEnabled) {
      this.refs['mainWebView'].goBack();
      return true;
    } else {
      if (this.clicked) {
        //点过一次了。
        console.log('back')
        return false;
      }
      this.clicked = true;
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  }
  
  render() {
    return <WebView
      ref="mainWebView"
      onNavigationStateChange={this.onNavigationStateChange}
      injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage('navigationStateChange');
              return res;
            }
          }

          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage('navigationStateChange'); // web端向APP端发送消息
          });
        })();
        true; 
      `}
      onMessage={({nativeEvent}) => {  // App接受从 web端传来的消息
        console.log('nativeEvent', nativeEvent)
        if (nativeEvent && nativeEvent.data === 'navigationStateChange') {
          this.backButtonEnabled = nativeEvent.canGoBack; // 这时记录下页面的可回退状态,然后通过ref获取该webview,调用它的goBack方法就可以了
        }
      }}
      // source={{ uri: 'http://10.45.24.54:8000/' }} />
      source={{ uri: 'http://v9-mobile-test.800best.com' }} />
  }

};

export default App;

