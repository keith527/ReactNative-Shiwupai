
import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Router, Scene, ActionConst} from 'react-native-router-flux';

import FoodsScene from './scene/FoodsScene';
import TabBarView from './scene/TabBarView';
import FeedDetail from './scene/feed/FeedDetail';
import Login from './scene/Login';


// const getSceneStyle = (props, computedProps) => {
//     const style = {
//         flex: 1,
//         backgroundColor: '#fff',
//         shadowColor: null,
//         shadowOffset: null,
//         shadowOpacity: null,
//         shadowRadius: null,
//     };
//     if (computedProps.isActive) {
//         style.marginTop = computedProps.hideNavBar ?
//             0 : Navigator.NavigationBar.Styles.General.TotalNavHeight;
//         style.marginBottom = computedProps.hideTabBar ? 0 : 50;
//     }
//     return style;
// };

export default class AppNavigation2 extends Component{

    render(){
        return(
            <Router>
                <Scene key="modal" modal>
                    <Scene key="root">
                        <Scene key="main" component={TabBarView} hideNavBar/>
                        <Scene key="foodInfo" component={FoodsScene} hideNavBar/>
                        <Scene key="feedDetail" component={FeedDetail} hideNavBar/>
                    </Scene>
                    <Scene key="login" component={Login} hideNavBar/>
                </Scene>
            </Router>
        );
    }
}

const styles = StyleSheet.create({
    navBar: {//
        backgroundColor: '#3e9ce9'
    },
    navBarTitle: {
        color: '#fff',
        fontSize: 20,
    }
});